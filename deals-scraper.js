/**
 * GameFree — Deals Scraper
 * Obtiene juegos con 80%+ de descuento de CheapShark
 * y los guarda en la tabla `deals` de Supabase.
 */

import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Mapa de IDs de tienda de CheapShark → nombre legible
const STORES = {
  "1" : "Steam",
  "25": "Epic Games",
  "7" : "GOG",
  "11": "Humble Bundle",
  "23": "GamersGate",
  "24": "WinGameStore",
};

// ── PASO 1: Fetch de CheapShark ───────────────────────────────
// upperPrice sin límite, lowerPrice 0, sortBy = Savings (mayor ahorro primero)
async function fetchDeals(minDiscount = 80) {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`🔥  GameFree Deals Scraper — mínimo ${minDiscount}% descuento`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const params = new URLSearchParams({
    sortBy   : "Savings",   // ordena por mayor ahorro primero
    pageSize : 60,          // máximo permitido por CheapShark
    onSale   : 1,
    lowerPrice: 0.50,       // excluye juegos casi gratis permanentes
  });

  const response = await fetch(
    `https://www.cheapshark.com/api/1.0/deals?${params}`
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const allDeals = await response.json();
  console.log(`✅  Deals recibidos: ${allDeals.length}`);

  // ── PASO 2: Filtrar por descuento mínimo ─────────────────────
  const filtered = allDeals.filter((deal) => {
    const discount     = parseFloat(deal.savings);
    const salePrice    = parseFloat(deal.salePrice);
    const normalPrice  = parseFloat(deal.normalPrice);

    return (
      discount >= minDiscount &&   // descuento mínimo configurable
      salePrice > 0 &&             // excluye gratuitos (esos van en games)
      normalPrice > 1              // excluye juegos de $0.99 o menos
    );
  });

  console.log(`🎯  Deals con ${minDiscount}%+ de descuento: ${filtered.length}`);
  return filtered;
}

// ── PASO 3: Normalizar al schema de la tabla `deals` ─────────
function normalizeDeal(deal) {
  const storeName    = STORES[deal.storeID] ?? `Tienda ${deal.storeID}`;
  const discountPct  = Math.round(parseFloat(deal.savings));

  return {
    title          : deal.title,
    thumbnail_url  : deal.thumb,
    store_name     : storeName,
    claim_url      : `https://www.cheapshark.com/redirect?dealID=${deal.dealID}`,
    original_price : parseFloat(deal.normalPrice),
    sale_price     : parseFloat(deal.salePrice),
    discount_pct   : discountPct,
    metacritic     : deal.metacriticScore
                       ? parseInt(deal.metacriticScore)
                       : null,
  };
}

// ── PASO 4: Guardar en Supabase ───────────────────────────────
async function saveDeals(deals) {
  if (deals.length === 0) return;

  const rows = deals.map(normalizeDeal);

  const { error } = await supabase
    .from("deals")
    .upsert(rows, { onConflict: "claim_url" });

  if (error) {
    console.error("❌  Error al guardar en Supabase:", error.message);
    process.exit(1);
  }

  console.log(`✅  ${rows.length} deals guardados en Supabase.`);
}

// ── PASO 5: Limpiar deals viejos ─────────────────────────────
// Eliminamos deals que tengan más de 48h para mantener el feed fresco
async function removeOldDeals() {
  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

  const { data: old, error } = await supabase
    .from("deals")
    .select("id, title")
    .lt("created_at", cutoff);

  if (error || !old || old.length === 0) {
    console.log("🗑️   Sin deals antiguos que limpiar.");
    return;
  }

  await supabase
    .from("deals")
    .delete()
    .in("id", old.map((d) => d.id));

  console.log(`🗑️   ${old.length} deal(s) antiguos eliminados.`);
}

// ── MAIN ──────────────────────────────────────────────────────
async function main() {
  try {
    const deals = await fetchDeals(80); // Cambiar umbral aquí (80 = 80%+)

    const byStore = deals.reduce((acc, d) => {
      const store = STORES[d.storeID] ?? `Tienda ${d.storeID}`;
      acc[store] = (acc[store] || 0) + 1;
      return acc;
    }, {});

    console.log("\n📊  Distribución por tienda:");
    Object.entries(byStore).forEach(([store, count]) => {
      console.log(`     ${store}: ${count} deal(s)`);
    });
    console.log();

    await saveDeals(deals);
    await removeOldDeals();

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✔️   Deals scraper completado.");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  } catch (err) {
    console.error("💥  Error fatal:", err.message);
    process.exit(1);
  }
}

main();
