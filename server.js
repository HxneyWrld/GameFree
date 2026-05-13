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
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
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

// ─────────────────────────────────────────────────────────────
// MIDDLEWARE: verificarToken
// ─────────────────────────────────────────────────────────────
// Intercepta rutas protegidas. Lee el JWT que el frontend
// envía en el header Authorization: Bearer <token>.
// Si el token es válido, adjunta el user_id al objeto req
// para que los endpoints lo usen sin repetir la verificación.
// ─────────────────────────────────────────────────────────────
async function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Token requerido." });
  }

  const token = authHeader.split(" ")[1];

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ success: false, message: "Token inválido o expirado." });
  }

  req.user  = user;
  req.token = token; // lo necesitamos para crear el cliente autenticado
  next();
}

// Crea un cliente Supabase autenticado como el usuario.
// Esto hace que auth.uid() funcione en las políticas RLS.
function supabaseAs(token) {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth:   { persistSession: false },
  });
}

// ─────────────────────────────────────────────────────────────
// AUTH: Registro
// POST /api/auth/register
// Body: { email, password }
// ─────────────────────────────────────────────────────────────
app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email y contraseña requeridos." });
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return res.status(400).json({ success: false, message: error.message });
  }

  return res.status(201).json({
    success: true,
    message: "Usuario registrado. Revisá tu email para confirmar la cuenta.",
    user: { id: data.user.id, email: data.user.email },
  });
});

// ─────────────────────────────────────────────────────────────
// AUTH: Recuperar contraseña
// POST /api/auth/recover
// Body: { email }
// ─────────────────────────────────────────────────────────────
app.post("/api/auth/recover", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email requerido." });
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    return res.status(400).json({ success: false, message: error.message });
  }

  return res.status(200).json({
    success: true,
    message: "Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña.",
  });
});

// ─────────────────────────────────────────────────────────────
// AUTH: Restablecer contraseña
// POST /api/auth/reset-password
// Body: { password, access_token, refresh_token }
// ─────────────────────────────────────────────────────────────
app.post("/api/auth/reset-password", async (req, res) => {
  const { password, access_token, refresh_token } = req.body;
  
  if (!password || !access_token || !refresh_token) {
    return res.status(400).json({ success: false, message: "Faltan credenciales para el restablecimiento." });
  }

  const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // 1. Establecer la sesión activa en el cliente de Supabase usando los tokens de la URL
  const { error: sessionError } = await db.auth.setSession({
    access_token,
    refresh_token
  });

  if (sessionError) {
    return res.status(400).json({ success: false, message: "Sesión expirada o inválida. Solicita un nuevo correo." });
  }

  // 2. Actualizar la contraseña para el usuario autenticado
  const { error } = await db.auth.updateUser({ password });

  if (error) {
    return res.status(400).json({ success: false, message: error.message });
  }

  return res.status(200).json({ success: true, message: "Contraseña actualizada exitosamente." });
});

// ─────────────────────────────────────────────────────────────
// AUTH: Login
// POST /api/auth/login
// Body: { email, password }
// Devuelve el access_token que el frontend guarda y
// envía en cada request protegido.
// ─────────────────────────────────────────────────────────────
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email y contraseña requeridos." });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return res.status(401).json({ success: false, message: "Credenciales incorrectas." });
  }

  return res.status(200).json({
    success: true,
    // El frontend guarda este token en localStorage y lo envía
    // en el header Authorization de cada petición protegida.
    token: data.session.access_token,
    user:  { id: data.user.id, email: data.user.email },
  });
});

// ─────────────────────────────────────────────────────────────
// FEED: GET /api/games/free
// REEMPLAZA el endpoint anterior — ahora filtra juegos
// ya reclamados si el usuario está autenticado.
// ─────────────────────────────────────────────────────────────
app.get("/api/games/free", async (req, res) => {
  try {
    // Intentamos leer el token si viene, pero no lo exigimos
    // (el feed es público; el filtro de "ya lo tengo" es opcional)
    let claimedIds = [];
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const { data: { user } } = await supabase.auth.getUser(token);

      if (user) {
        // Traemos los IDs de juegos ya reclamados por este usuario
        const { data: claimed } = await supabase
          .from("user_claimed_games")
          .select("game_id")
          .eq("user_id", user.id);

        claimedIds = (claimed ?? []).map((r) => r.game_id);
      }
    }

    let query = supabase
      .from("games")
      .select("*")
      .order("expiration_date", { ascending: true, nullsFirst: false });

    // Si el usuario tiene juegos reclamados, los excluimos del feed
    if (claimedIds.length > 0) {
      query = query.not("id", "in", `(${claimedIds.join(",")})`);
    }

    const { data: games, error } = await query;
    if (error) throw new Error(error.message);

    return res.status(200).json({ success: true, count: games.length, data: games });
  } catch (err) {
    console.error("[GET /api/games/free]", err.message);
    return res.status(500).json({ success: false, message: "Error interno." });
  }
});

// ─────────────────────────────────────────────────────────────
// CLAIMED: Marcar juego como "Ya lo tengo"
// POST /api/games/:id/claim   → marca como reclamado
// DELETE /api/games/:id/claim → desmarca
// ─────────────────────────────────────────────────────────────
app.post("/api/games/:id/claim", verificarToken, async (req, res) => {
  const { id: game_id } = req.params;
  const user_id = req.user.id;
  const db = supabaseAs(req.token);

  console.log(`[POST /claim] user=${user_id} game=${game_id}`);

  const { error } = await db
    .from("user_claimed_games")
    .insert({ user_id, game_id });

  if (error) {
    console.error("[POST /claim] Supabase error:", error);
    if (error.code === "23505") {
      return res.status(409).json({ success: false, message: "Ya reclamado anteriormente." });
    }
    return res.status(500).json({ success: false, message: error.message });
  }

  return res.status(201).json({ success: true, message: "Juego marcado como reclamado." });
});

app.delete("/api/games/:id/claim", verificarToken, async (req, res) => {
  const { id: game_id } = req.params;
  const user_id = req.user.id;
  const db = supabaseAs(req.token);

  console.log(`[DELETE /claim] user=${user_id} game=${game_id}`);

  const { error } = await db
    .from("user_claimed_games")
    .delete()
    .eq("user_id", user_id)
    .eq("game_id", game_id);

  if (error) {
    console.error("[DELETE /claim] Supabase error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }

  return res.status(200).json({ success: true, message: "Desmarcado correctamente." });
});

// ─────────────────────────────────────────────────────────────
// FAVORITES: Agregar / quitar favorito
// POST   /api/games/:id/favorite
// DELETE /api/games/:id/favorite
// ─────────────────────────────────────────────────────────────
app.post("/api/games/:id/favorite", verificarToken, async (req, res) => {
  const { id: game_id } = req.params;
  const user_id = req.user.id;
  const db = supabaseAs(req.token);

  console.log(`[POST /favorite] user=${user_id} game=${game_id}`);

  const { error } = await db
    .from("user_favorites")
    .insert({ user_id, game_id });

  if (error) {
    console.error("[POST /favorite] Supabase error:", error);
    if (error.code === "23505") {
      return res.status(409).json({ success: false, message: "Ya está en favoritos." });
    }
    return res.status(500).json({ success: false, message: error.message });
  }

  return res.status(201).json({ success: true, message: "Agregado a favoritos." });
});

app.delete("/api/games/:id/favorite", verificarToken, async (req, res) => {
  const { id: game_id } = req.params;
  const user_id = req.user.id;
  const db = supabaseAs(req.token);

  console.log(`[DELETE /favorite] user=${user_id} game=${game_id}`);

  const { error } = await db
    .from("user_favorites")
    .delete()
    .eq("user_id", user_id)
    .eq("game_id", game_id);

  if (error) {
    console.error("[DELETE /favorite] Supabase error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }

  return res.status(200).json({ success: true, message: "Quitado de favoritos." });
});

// ─────────────────────────────────────────────────────────────
// HISTORIAL: Juegos reclamados por el usuario
// GET /api/user/library
// ─────────────────────────────────────────────────────────────
app.get("/api/user/library", verificarToken, async (req, res) => {
  try {
    // JOIN implícito: traemos los datos completos del juego
    // a través de la relación user_claimed_games → games
    const { data, error } = await supabase
      .from("user_claimed_games")
      .select(`
        claimed_at,
        games (
          id, title, thumbnail_url, store_name,
          claim_url, original_price
        )
      `)
      .eq("user_id", req.user.id)
      .order("claimed_at", { ascending: false });

    if (error) throw new Error(error.message);

    return res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// FAVORITOS: Lista de favoritos del usuario
// GET /api/user/favorites
// ─────────────────────────────────────────────────────────────
app.get("/api/user/favorites", verificarToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("user_favorites")
      .select(`
        favorited_at,
        games (
          id, title, thumbnail_url, store_name,
          claim_url, original_price
        )
      `)
      .eq("user_id", req.user.id)
      .order("favorited_at", { ascending: false });

    if (error) throw new Error(error.message);

    return res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});