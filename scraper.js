/**
 * GameFree - Scraper v2.0 (Multisource)
 * ─────────────────────────────────────────────────────────────
 * API: GamerPower (https://gamerpower.com/api-read)
 * Sin API key. Cubre: Epic, Steam, GOG, itch.io, Prime Gaming,
 * Humble Bundle, IndieGala, Fanatical y más.
 *
 * Cambio respecto a v1: GamerPower ya diferencia giveaways de
 * juegos F2P permanentes por diseño — solo trackea promociones
 * por tiempo limitado, así que no necesitamos el filtro manual
 * de normalPrice > 0. En cambio, filtramos por type === "game"
 * para excluir loot (skins, moneda virtual, DLCs).
 */

import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

// ── Cliente Supabase ──────────────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// ── Mapa de plataformas ───────────────────────────────────────
// GamerPower usa slugs internos. Los normalizamos a nombres
// legibles para mostrar en el frontend y los badges de color.
const PLATFORM_NAMES = {
  "epic-games-store" : "Epic Games",
  "steam"            : "Steam",
  "gog"              : "GOG",
  "itch.io"          : "itch.io",
  "prime-gaming"     : "Prime Gaming",
  "humble-store"     : "Humble Bundle",
  "indiegala"        : "IndieGala",
  "fanatical"        : "Fanatical",
  "ubisoft"          : "Ubisoft Connect",
  "battlenet"        : "Battle.net",
  "drm-free"         : "DRM-Free",
};

// ── PASO 1: Fetch de GamerPower ───────────────────────────────
// Pedimos todos los giveaways de PC activos, tipo "game".
// GamerPower también trackea loot (skins, monedas) y betas,
// así que filtramos solo juegos completos.
async function fetchGiveaways() {
  // Endpoint: todos los giveaways de PC en curso
  const url = "https://www.gamerpower.com/api/giveaways?platform=pc&type=game";

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🎮  GameFree — Scraper v2.0 (Multisource)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`📡  Consultando GamerPower API...`);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  // GamerPower devuelve { status: 0, status_message: "..." }
  // cuando no hay giveaways activos (no es un array).
  if (!Array.isArray(data)) {
    console.log("😴  GamerPower no reporta giveaways activos ahora mismo.");
    return [];
  }

  return data;
}

// ── PASO 2: Normalizar campos ─────────────────────────────────
// GamerPower usa nombres distintos a nuestra tabla en Supabase.
// Esta función traduce un objeto de GamerPower al schema de `games`.
function normalizeGiveaway(giveaway) {
  // GamerPower devuelve platforms como "PC, Epic Games Store" o "PC, Itch.io, DRM-Free"
  // Usamos coincidencia por palabras clave para ser robustos ante variaciones de formato.
  const p = (giveaway.platforms || "").toLowerCase();

  let storeName;
  if      (p.includes("epic"))      storeName = "Epic Games";
  else if (p.includes("steam"))     storeName = "Steam";
  else if (p.includes("gog"))       storeName = "GOG";
  else if (p.includes("itch"))      storeName = "itch.io";
  else if (p.includes("prime"))     storeName = "Prime Gaming";
  else if (p.includes("humble"))    storeName = "Humble Bundle";
  else if (p.includes("indiegala")) storeName = "IndieGala";
  else if (p.includes("fanatical")) storeName = "Fanatical";
  else if (p.includes("ubisoft"))   storeName = "Ubisoft Connect";
  else if (p.includes("battle"))    storeName = "Battle.net";
  else if (p.includes("drm"))       storeName = "DRM-Free";
  else                              storeName = giveaway.platforms ?? "PC";

  const originalPrice = parseFloat(
    (giveaway.worth || "0").replace("$", "").trim()
  ) || 0;

  let expirationDate = null;
  if (giveaway.end_date && giveaway.end_date !== "N/A") {
    const parsed = new Date(giveaway.end_date);
    if (!isNaN(parsed)) expirationDate = parsed.toISOString();
  }

  return {
    title          : giveaway.title,
    thumbnail_url  : giveaway.image,
    store_name     : storeName,
    claim_url      : giveaway.open_giveaway_url,
    original_price : originalPrice,
    expiration_date: expirationDate,
  };
}

// ── PASO 3: Guardar en Supabase ───────────────────────────────
// Usamos upsert con onConflict en claim_url para que si el
// scraper corre dos veces con el mismo juego, no lo duplique
// sino que actualice los datos (por si cambia la fecha de expiración).
async function saveToDatabase(games) {
  if (games.length === 0) return;

  const { error } = await supabase
    .from("games")
    .upsert(games, { onConflict: "claim_url" });

  if (error) {
    console.error("❌  Error al guardar en Supabase:", error.message);
    process.exit(1);
  }

  console.log(`✅  ${games.length} juego(s) guardados/actualizados en Supabase.`);
}

// ── PASO 4: Limpiar juegos expirados ─────────────────────────
// GamerPower solo devuelve giveaways activos. Si un juego que
// teníamos en BD ya no aparece en la respuesta, significa que
// expiró. Lo eliminamos para que no aparezca en el feed.
async function removeExpiredGames(activeClaimUrls) {
  if (activeClaimUrls.length === 0) return;

  // Traemos todos los claim_urls actuales en nuestra BD
  const { data: currentGames, error } = await supabase
    .from("games")
    .select("id, claim_url, title");

  if (error || !currentGames) return;

  // Filtramos los que ya no están en la respuesta de GamerPower
  const expired = currentGames.filter(
    (g) => !activeClaimUrls.includes(g.claim_url)
  );

  if (expired.length === 0) {
    console.log("🗑️   Sin juegos expirados que limpiar.");
    return;
  }

  const expiredIds = expired.map((g) => g.id);

  const { error: deleteError } = await supabase
    .from("games")
    .delete()
    .in("id", expiredIds);

  if (deleteError) {
    console.error("⚠️  Error al eliminar juegos expirados:", deleteError.message);
    return;
  }

  console.log(`🗑️   ${expired.length} juego(s) expirado(s) eliminado(s):`);
  expired.forEach((g) => console.log(`     - ${g.title}`));
}

// ── FUNCIÓN PRINCIPAL ─────────────────────────────────────────
async function main() {
  try {
    // 1. Obtener giveaways de GamerPower
    const rawGiveaways = await fetchGiveaways();

    if (rawGiveaways.length === 0) {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      return;
    }

    console.log(`✅  Giveaways recibidos: ${rawGiveaways.length}`);

    // 2. Normalizar al schema de nuestra BD
    const normalized = rawGiveaways.map(normalizeGiveaway);

    // 3. Resumen por tienda
    const byStore = normalized.reduce((acc, g) => {
      acc[g.store_name] = (acc[g.store_name] || 0) + 1;
      return acc;
    }, {});

    console.log("\n📊  Distribución por tienda:");
    Object.entries(byStore).forEach(([store, count]) => {
      console.log(`     ${store}: ${count} juego(s)`);
    });
    console.log();

    // 4. Guardar en Supabase
    await saveToDatabase(normalized);

    // 5. Limpiar juegos expirados
    const activeUrls = normalized.map((g) => g.claim_url);
    await removeExpiredGames(activeUrls);

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`✔️   Scraping completado. BD actualizada.`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  } catch (err) {
    console.error("💥  Error fatal:", err.message);
    process.exit(1);
  }
}

main();