import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export default function GameCard({ game, onClaimed, onUnclaimed, onUnfavorited, initialClaimed = false, initialFavorited = false }) {
  const { token, isLoggedIn } = useAuth();

  // Inicializamos con el estado real que viene de la API
  const [claimed,   setClaimed]   = useState(initialClaimed);
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading,   setLoading]   = useState(false);
  const [removing,  setRemoving]  = useState(false); // animación de salida

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
      // Marcar como reclamado → desaparece del feed después de la animación
      const json = await callApi(`/api/games/${game.id}/claim`, "POST");
      if (json.success || json.message === "Ya reclamado anteriormente.") {
        setClaimed(true);
        setTimeout(() => onClaimed?.(game.id), 800);
      }
    } else {
      // Desmarcar → desaparece de "Mi biblioteca"
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
      // Si estaba favorito y lo quita → desaparece de "Favoritos"
      if (wasFavorited) {
        setRemoving(true);
        setTimeout(() => onUnfavorited?.(game.id), 500);
      }
    }

    setLoading(false);
  }

const STORE_STYLES = {
  "Epic Games"     : "bg-green-100 text-green-800",
  "Steam"          : "bg-blue-100 text-blue-800",
  "GOG"            : "bg-purple-100 text-purple-800",
  "itch.io"        : "bg-red-100 text-red-800",
  "Prime Gaming"   : "bg-orange-100 text-orange-800",
  "Humble Bundle"  : "bg-yellow-100 text-yellow-800",
  "IndieGala"      : "bg-teal-100 text-teal-800",
  "Fanatical"      : "bg-pink-100 text-pink-800",
  "Ubisoft Connect": "bg-sky-100 text-sky-800",
  "Battle.net"     : "bg-cyan-100 text-cyan-800",
};
  const badgeStyle = STORE_STYLES[game.store_name] ?? "bg-gray-100 text-gray-700";

  return (
    <article className={`flex flex-col bg-white rounded-xl border overflow-hidden shadow-sm transition-all duration-500 ${
      removing || (claimed && !initialClaimed)
        ? "opacity-0 scale-95 pointer-events-none"
        : "hover:shadow-md border-gray-100"
    }`}>

      {game.thumbnail_url ? (
        <img src={game.thumbnail_url} alt={game.title} className="w-full h-40 object-cover" />
      ) : (
        <div className="w-full h-40 bg-indigo-50 flex items-center justify-center text-5xl">🎮</div>
      )}

      <div className="flex flex-col gap-3 p-4 flex-1">

        {/* Badge tienda + botón favorito */}
        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${badgeStyle}`}>
            {game.store_name}
          </span>

          {isLoggedIn && (
            <button
              onClick={handleFavorite}
              disabled={loading}
              title={favorited ? "Quitar de favoritos" : "Agregar a favoritos"}
              className="text-lg transition-transform hover:scale-110 disabled:opacity-40"
            >
              {favorited ? "❤️" : "🤍"}
            </button>
          )}
        </div>

        <h2 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 flex-1">
          {game.title}
        </h2>

        <div className="flex items-center gap-2">
          {game.original_price > 0 && (
            <span className="text-sm text-gray-400 line-through">${game.original_price.toFixed(2)}</span>
          )}
          <span className="text-sm font-bold text-emerald-600">GRATIS</span>
        </div>

        <div className="flex gap-2 mt-auto">
          <a
            href={game.claim_url}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
          >
            Reclamar →
          </a>

          {isLoggedIn && (
            <button
              onClick={handleClaim}
              disabled={loading}
              title={claimed ? "Marcar como no reclamado" : "Ya lo tengo"}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 border ${
                claimed
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {loading ? "..." : claimed ? "✓ Tengo" : "Ya lo tengo"}
            </button>
          )}
        </div>

      </div>
    </article>
  );
}