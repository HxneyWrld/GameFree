/**
 * GameFree - Fase 1: Script de Scraping
 * ----------------------------------------
 * API: CheapShark (https://apidocs.cheapshark.com/) — sin API key
 * Requisito: Node.js 18+ (fetch nativo disponible)
 */

// ── NUEVA dependencia al inicio del archivo ───────────────────
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

// ─────────────────────────────────────────────
// CONFIGURACIÓN CENTRAL
// Centralizar parámetros facilita cambiarlos sin tocar la lógica.
// ─────────────────────────────────────────────
const CONFIG = {
  // Endpoint de CheapShark para deals activos
  BASE_URL: "https://www.cheapshark.com/api/1.0/deals",

  // upperPrice:0  → solo juegos cuyo precio actual sea $0
  // pageSize:60   → máximo de resultados por llamada permitido por la API
  // onSale:1      → solo ofertas activas
  PARAMS: new URLSearchParams({
    upperPrice: 0,
    pageSize: 60,
    onSale: 1,
  }),

  // Umbral clave del filtro anti-F2P:
  // un juego Free-to-Play permanente tiene normalPrice = 0.
  // Exigiendo > 0.01 los eliminamos todos.
  MIN_ORIGINAL_PRICE: 0.01,
};

// ── Inicialización de Supabase (después de CONFIG) ────────────
// En local lee el .env; en GitHub Actions leerá los Secrets.
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Mapa de storeID → nombre legible (CheapShark IDs más comunes)
const STORES = {
  1: "Steam",
  2: "GamersGate",
  3: "GreenManGaming",
  7: "GOG",
  8: "Origin",
  11: "Humble Store",
  13: "Uplay",
  15: "Fanatical",
  21: "WinGameStore",
  23: "GameBillet",
  25: "Voidu",
  27: "Epic Games Store",
  28: "Games planet",
  29: "GamesPlanet US",
  31: "IndieGala Store",
  35: "GameBillet",
  37: "Dreamgame",
};

// ─────────────────────────────────────────────
// FUNCIÓN: Guardar en Supabase
// ─────────────────────────────────────────────
// upsert = INSERT + UPDATE en caso de conflicto.
// onConflict: si ya existe un juego con el mismo claim_url,
// actualiza sus datos en lugar de duplicar el registro.
async function saveToDatabase(games) {
  if (games.length === 0) return;

  // Mapeamos los campos de CheapShark a las columnas de nuestra tabla
  const rows = games.map((game) => ({
    title          : game.title,
    thumbnail_url  : game.thumb,
    store_name     : STORES[game.storeID] || `Store ${game.storeID}`,
    claim_url      : `https://www.cheapshark.com/redirect?dealID=${game.dealID}`,
    original_price : parseFloat(game.normalPrice),
    // CheapShark no siempre provee fecha de expiración; la dejamos null por ahora
    expiration_date: null,
  }));

  const { data, error } = await supabase
    .from("games")
    .upsert(rows, { onConflict: "claim_url" }); // claim_url como clave única

  if (error) {
    console.error("❌  Error al guardar en Supabase:", error.message);
    process.exit(1);
  }

  console.log(`✅  ${rows.length} juego(s) guardados/actualizados en Supabase.`);
}

// ─────────────────────────────────────────────
// FUNCIÓN PRINCIPAL
// ─────────────────────────────────────────────
async function fetchFreeGames() {
  const url = `${CONFIG.BASE_URL}?${CONFIG.PARAMS.toString()}`;

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🎮  GameFree — Motor de Scraping v1.0");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`📡  Consultando: ${url}\n`);

  // ── PASO 1: Petición HTTP con fetch nativo (Node 18+) ──────────────────
  // No requiere axios ni node-fetch. fetch() ya viene incluido en Node.
  let rawDeals;
  try {
    const response = await fetch(url);

    // Si la API responde con 4xx o 5xx lanzamos error descriptivo
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // CheapShark retorna un array de objetos "deal" en JSON
    rawDeals = await response.json();
  } catch (error) {
    // Capturamos errores de red (sin internet, DNS, timeout) y HTTP
    console.error("❌  Error al conectar con la API:", error.message);
    process.exit(1); // exit(1) para que GitHub Actions marque el job como fallido
  }

  console.log(`✅  Deals recibidos de la API: ${rawDeals.length}`);

  // ── PASO 2: Filtrado estricto anti-Free-to-Play ────────────────────────
  //
  // PROBLEMA: upperPrice=0 trae también juegos F2P permanentes (Valorant, etc.)
  // porque su salePrice también es "0.00".
  //
  // DISTINCIÓN CLAVE:
  //   ✅ Promo 100% real  →  salePrice="0.00" | normalPrice="29.99"  → INCLUIR
  //   ❌ Free-to-Play     →  salePrice="0.00" | normalPrice="0.00"   → DESCARTAR
  //
  // Solución: exigir que normalPrice > 0.01
  //
  const trulyFreeGames = rawDeals.filter((deal) => {
    const currentPrice  = parseFloat(deal.salePrice);   // Precio actual en oferta
    const originalPrice = parseFloat(deal.normalPrice); // Precio original sin descuento

    return currentPrice === 0 && originalPrice > CONFIG.MIN_ORIGINAL_PRICE;
  });

  // ── PASO 3: Resumen del filtrado ───────────────────────────────────────
  const discarded = rawDeals.length - trulyFreeGames.length;
  console.log(`🚫  F2P permanentes descartados : ${discarded}`);
  console.log(`🎁  Promociones 100% reales     : ${trulyFreeGames.length}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  if (trulyFreeGames.length === 0) {
    console.log("😴  Sin promociones activas en este momento. Intenta más tarde.");
    return;
  }

  // ── PASO 4: Guardar en Supabase ────────────────────────────────────────
  await saveToDatabase(trulyFreeGames);
} // ← cierre de fetchFreeGames()

// ─────────────────────────────────────────────
// PUNTO DE ENTRADA — captura errores fatales no manejados
// ─────────────────────────────────────────────
fetchFreeGames().catch((err) => {
  console.error("💥  Error fatal en el scraper:", err);
  process.exit(1);
});