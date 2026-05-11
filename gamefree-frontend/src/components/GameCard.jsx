import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Heart } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const STORE_STYLES = {
  "Epic Games": "bg-emerald-500 text-white",
  "Steam": "bg-blue-900 text-white",
  "GOG": "bg-purple-600 text-white",
  "itch.io": "bg-rose-600 text-white",
  "Prime Gaming": "bg-orange-500 text-white",
  "Humble Bundle": "bg-rose-600 text-white",
  "IndieGala": "bg-teal-500 text-white",
  "Fanatical": "bg-pink-500 text-white",
  "Ubisoft Connect": "bg-sky-500 text-white",
  "Battle.net": "bg-cyan-500 text-white",
};

export default function GameCard({ game, onClaimed, onUnclaimed, onUnfavorited, initialClaimed = false, initialFavorited = false }) {
  const { token, isLoggedIn } = useAuth();

  const [claimed,   setClaimed]   = useState(initialClaimed);
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading,   setLoading]   = useState(false);
  const [removing,  setRemoving]  = useState(false);

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
    const method = wasFavorited ? "DELETE" : "POST";
    const json   = await callApi(`/api/games/${game.id}/favorite`, method);
    if (json.success) {
      setFavorited(!wasFavorited);
      if (wasFavorited) {
        setRemoving(true);
        setTimeout(() => onUnfavorited?.(game.id), 500);
      }
    }

    setLoading(false);
  }

  const badgeStyle = STORE_STYLES[game.store_name] || "bg-[#30363d] text-white";

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-xl bg-[#161b22] border border-[#30363d] transition-all duration-300 ease-out ${
        removing || (claimed && !initialClaimed)
          ? "opacity-0 scale-95 pointer-events-none"
          : "hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50 hover:border-[#8b949e]"
      }`}
    >
      {/* Image Container */}
      <div className="relative aspect-[16/9] overflow-hidden bg-[#0d1117]">
        {game.thumbnail_url ? (
          <img
            src={game.thumbnail_url}
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🎮</div>
        )}
        
        {/* Store Badge */}
        <span
          className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-semibold shadow-lg backdrop-blur-sm ${badgeStyle}`}
        >
          {game.store_name}
        </span>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] via-transparent to-transparent opacity-80" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 p-4 flex-1">
        {/* Title */}
        <h3 className="text-lg font-bold text-white line-clamp-2 leading-tight flex-1">
          {game.title}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-3">
          {game.original_price > 0 && (
            <span className="text-sm text-[#8b949e] line-through">
              ${game.original_price.toFixed(2)}
            </span>
          )}
          <span className="px-2 py-0.5 text-sm font-bold text-emerald-400 bg-emerald-400/10 rounded">
            GRATIS
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 mt-auto">
          <a
            href={game.claim_url}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors text-center"
          >
            Reclamar →
          </a>
          
          {isLoggedIn && (
            <>
              <button
                onClick={handleFavorite}
                disabled={loading}
                title={favorited ? "Quitar de favoritos" : "Agregar a favoritos"}
                className={`flex items-center justify-center h-10 w-10 rounded-lg border transition-colors disabled:opacity-50 ${
                  favorited
                    ? "border-rose-500 bg-rose-500/20 hover:bg-rose-500/30 text-rose-500"
                    : "border-[#30363d] bg-[#21262d] hover:bg-[#30363d] text-[#8b949e]"
                }`}
              >
                <Heart
                  className={`h-5 w-5 transition-colors ${favorited ? "fill-rose-500 text-rose-500" : "text-[#8b949e]"}`}
                />
              </button>

              <button
                onClick={handleClaim}
                disabled={loading}
                title={claimed ? "Marcar como no reclamado" : "Ya lo tengo"}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 border ${
                  claimed
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400"
                    : "border-[#30363d] text-[#8b949e] hover:bg-[#21262d]"
                }`}
              >
                {loading ? "..." : claimed ? "✓" : "Tengo"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}