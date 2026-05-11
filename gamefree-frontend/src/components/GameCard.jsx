import { useState } from "react";
import { Heart, ExternalLink, Check, Gamepad2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

/* ── Colores por tienda ─────────────────────────────────── */
const STORE_CONFIG = {
  "Epic Games":      { bg: "#1a1a2e", border: "#3d3d5c", color: "#c8d6e5", dot: "#00d084" },
  "Steam":           { bg: "#1b2838", border: "#2a475e", color: "#c6d4df", dot: "#1b90ff" },
  "GOG":             { bg: "#2a1f3d", border: "#6b21a8", color: "#d8b4fe", dot: "#a855f7" },
  "itch.io":         { bg: "#1f0a0a", border: "#7f1d1d", color: "#fca5a5", dot: "#ef4444" },
  "Prime Gaming":    { bg: "#1a1508", border: "#78350f", color: "#fcd34d", dot: "#f59e0b" },
  "Humble Bundle":   { bg: "#1a0f08", border: "#7c2d12", color: "#fdba74", dot: "#f97316" },
  "IndieGala":       { bg: "#0a1a1a", border: "#134e4a", color: "#5eead4", dot: "#14b8a6" },
  "Fanatical":       { bg: "#1a0a1a", border: "#701a75", color: "#f0abfc", dot: "#d946ef" },
  "Ubisoft Connect": { bg: "#081828", border: "#1e3a5f", color: "#93c5fd", dot: "#3b82f6" },
  "Battle.net":      { bg: "#081828", border: "#164e63", color: "#67e8f9", dot: "#06b6d4" },
};

export default function GameCard({
  game,
  onClaimed,
  onUnclaimed,
  onUnfavorited,
  initialClaimed   = false,
  initialFavorited = false,
}) {
  const { token, isLoggedIn } = useAuth();

  const [claimed,   setClaimed]   = useState(initialClaimed);
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading,   setLoading]   = useState(false);
  const [removing,  setRemoving]  = useState(false);
  const [imgError,  setImgError]  = useState(false);

  const store  = STORE_CONFIG[game.store_name] ?? { bg: "#161b22", border: "#30363d", color: "#8b949e", dot: "#8b949e" };
  const isVisible = !removing && !(claimed && !initialClaimed);

  async function callApi(endpoint, method) {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  }

  async function handleClaim() {
    if (!isLoggedIn || loading) return;
    setLoading(true);
    if (!claimed) {
      const json = await callApi(`/api/games/${game.id}/claim`, "POST");
      if (json.success || json.message === "Ya reclamado anteriormente.") {
        setClaimed(true);
        setTimeout(() => onClaimed?.(game.id), 800);
      }
    } else {
      const json = await callApi(`/api/games/${game.id}/claim`, "DELETE");
      if (json.success) {
        setClaimed(false);
        setRemoving(true);
        setTimeout(() => onUnclaimed?.(game.id), 500);
      }
    }
    setLoading(false);
  }

  async function handleFavorite() {
    if (!isLoggedIn || loading) return;
    setLoading(true);
    const wasFavorited = favorited;
    const json = await callApi(`/api/games/${game.id}/favorite`, wasFavorited ? "DELETE" : "POST");
    if (json.success) {
      setFavorited(!wasFavorited);
      if (wasFavorited) {
        setRemoving(true);
        setTimeout(() => onUnfavorited?.(game.id), 500);
      }
    }
    setLoading(false);
  }

  return (
    <article
      className="game-card"
      style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "scale(1) translateY(0)" : "scale(0.95) translateY(8px)" }}
    >
      {/* ── Imagen ──────────────────────────────────────── */}
      <div className="game-card-img-wrap">
        {game.thumbnail_url && !imgError ? (
          <img
            src={game.thumbnail_url}
            alt={game.title}
            className="game-card-img"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="game-card-img-fallback">
            <Gamepad2 size={40} color="#30363d" />
          </div>
        )}

        {/* Badge tienda sobre la imagen */}
        <span
          className="game-card-store-badge"
          style={{ background: store.bg, border: `1px solid ${store.border}`, color: store.color }}
        >
          <span className="game-card-store-dot" style={{ background: store.dot }} />
          {game.store_name}
        </span>

        {/* Overlay degradado inferior */}
        <div className="game-card-img-overlay" />

        {/* Botón favorito flotante (solo logueado) */}
        {isLoggedIn && (
          <button
            onClick={handleFavorite}
            disabled={loading}
            aria-label={favorited ? "Quitar de favoritos" : "Agregar a favoritos"}
            className={`game-card-fav-btn ${favorited ? "game-card-fav-btn--active" : ""}`}
          >
            <Heart
              size={16}
              className={favorited ? "game-card-fav-icon--filled" : "game-card-fav-icon"}
            />
          </button>
        )}
      </div>

      {/* ── Contenido ───────────────────────────────────── */}
      <div className="game-card-body">
        {/* Título */}
        <h3 className="game-card-title">{game.title}</h3>

        {/* Precio */}
        <div className="game-card-price-row">
          {game.original_price > 0 && (
            <span className="game-card-original-price">${game.original_price.toFixed(2)}</span>
          )}
          <span className="game-card-free-badge">GRATIS</span>
        </div>

        {/* Acciones */}
        <div className="game-card-actions">
          {/* Reclamar → abre link externo */}
          <a
            href={game.claim_url}
            target="_blank"
            rel="noreferrer"
            className="game-card-claim-btn"
          >
            Reclamar
            <ExternalLink size={14} />
          </a>

          {/* Marcar como tengo (solo logueado) */}
          {isLoggedIn && (
            <button
              onClick={handleClaim}
              disabled={loading}
              aria-label={claimed ? "Marcar como no reclamado" : "Ya lo tengo"}
              className={`game-card-have-btn ${claimed ? "game-card-have-btn--claimed" : ""}`}
            >
              {loading ? (
                <span className="game-card-spinner" />
              ) : claimed ? (
                <><Check size={14} /> Tengo</>
              ) : (
                "Ya lo tengo"
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}