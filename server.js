/**
 * GameFree - Fase 2: Servidor Express + API REST
 * ─────────────────────────────────────────────────
 * Responsabilidades de este archivo:
 *   1. Conectarse a Supabase (PostgreSQL en la nube)
 *   2. Exponer el endpoint GET /api/games/free
 *   3. Manejar errores de forma centralizada
 *
 * Ejecutar: node server.js
 */

// ── Dependencias ──────────────────────────────────────────────
// dotenv carga las variables de .env al objeto process.env
// DEBE llamarse antes de cualquier otro import que las use.
import "dotenv/config";
import express    from "express";
import { createClient } from "@supabase/supabase-js";

// ── Validación temprana de variables de entorno ───────────────
// Si faltan las credenciales de Supabase, el servidor no tiene
// sentido que arranque. Mejor fallar rápido con un mensaje claro.
const { SUPABASE_URL, SUPABASE_ANON_KEY, PORT = 3000 } = process.env;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("❌  ERROR: Faltan variables de entorno.");
  console.error("    Verificá que el archivo .env exista con SUPABASE_URL y SUPABASE_ANON_KEY.");
  process.exit(1);
}

// ── Inicialización del cliente de Supabase ────────────────────
// createClient devuelve una instancia lista para hacer queries.
// La anon key permite operaciones de lectura pública (RLS de Supabase
// controla los permisos más finos; lo configuraremos en Fase 3 con auth).
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Inicialización de Express ─────────────────────────────────
const app = express();

// Middleware: parsea el body de las peticiones como JSON.
// Necesario ahora para futuros endpoints POST (ej: Fase 3 - auth).
app.use(express.json());

// Middleware: cabeceras CORS básicas.
// Permite que el frontend en Vercel/Netlify consulte esta API
// sin bloqueos del navegador por política de mismo origen.
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // En prod: reemplazar * por tu dominio
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// ─────────────────────────────────────────────────────────────
// ENDPOINT: GET /api/games/free
// ─────────────────────────────────────────────────────────────
// Devuelve todos los juegos actualmente gratuitos almacenados
// en la tabla `games` de Supabase, ordenados por expiración
// más próxima primero (lógica FOMO: los que expiran antes arriba).
// ─────────────────────────────────────────────────────────────
app.get("/api/games/free", async (req, res) => {
  try {
    // ── Query a Supabase ──────────────────────────────────────
    // .from("games")  → tabla objetivo
    // .select("*")    → todos los campos (en Fase 3 limitaremos columnas)
    // .order(...)     → expiración más cercana primero; NULLs al final
    const { data: games, error } = await supabase
      .from("games")
      .select("*")
      .order("expiration_date", { ascending: true, nullsFirst: false });

    // Supabase no lanza excepciones: los errores vienen en el campo `error`.
    // Si existe, lo propagamos como un Error estándar de JavaScript.
    if (error) {
      throw new Error(error.message);
    }

    // ── Respuesta exitosa ─────────────────────────────────────
    // Seguimos el formato de respuesta envelope: { success, count, data }
    // Esto facilita que el frontend React distinga resultados vacíos
    // de errores reales, y que en el futuro agreguemos paginación.
    return res.status(200).json({
      success : true,
      count   : games.length,      // Cuántos juegos hay ahora mismo
      data    : games,             // Array de objetos juego
    });

  } catch (err) {
    // ── Manejo de errores ─────────────────────────────────────
    // Logueamos el error internamente con detalle para debugging,
    // pero al cliente solo le enviamos un mensaje genérico seguro
    // (nunca exponemos stack traces ni detalles de infraestructura).
    console.error("[GET /api/games/free] Error:", err.message);

    return res.status(500).json({
      success : false,
      message : "Error interno al consultar los juegos. Intenta más tarde.",
    });
  }
});

// ─────────────────────────────────────────────────────────────
// ENDPOINT: GET /health
// ─────────────────────────────────────────────────────────────
// Endpoint de salud: permite verificar que el servidor está vivo.
// GitHub Actions y servicios de monitoreo lo usan para validar
// que el deploy fue exitoso antes de servir tráfico real.
// ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({
    status    : "ok",
    service   : "GameFree API",
    timestamp : new Date().toISOString(),
  });
});

// ─────────────────────────────────────────────────────────────
// ARRANQUE DEL SERVIDOR
// ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`🚀  GameFree API corriendo en http://localhost:${PORT}`);
  console.log(`📦  Supabase conectado: ${SUPABASE_URL}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  GET /api/games/free  →  lista de juegos gratuitos");
  console.log("  GET /health          →  estado del servidor");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
});