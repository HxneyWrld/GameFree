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

export default function GameCard({ game, onOptimisticClaim, initialClaimed = false }) {
  const { token, isLoggedIn, login } = useAuth();
  const [claimed, setClaimed] = useState(initialClaimed);

  const badgeStyle = STORE_STYLES[game.store_name] || "bg-[#30363d] text-white";

  function handleClaimClick(e) {
    // Si ya está reclamado, no hacemos nada extra más que el link por defecto
    if (claimed || !isLoggedIn) return;

    // Marcamos localmente como reclamado
    setClaimed(true);

    // Llamamos al padre para mostrar el Toast y actualizar el ahorro total
    if (onOptimisticClaim) {
      onOptimisticClaim(game);
    }
  }

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-xl bg-[#161b22] border border-[#30363d] transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50 hover:border-[#8b949e]`}
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
        <div className="flex items-center pt-2 mt-auto">
          <a
            href={game.claim_url}
            target="_blank"
            rel="noreferrer"
            onClick={handleClaimClick}
            className={`flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold py-2.5 rounded-lg transition-colors text-center ${
              claimed 
                ? "bg-[#21262d] border border-[#30363d] text-emerald-400 hover:bg-[#30363d]" 
                : "bg-indigo-600 hover:bg-indigo-500 text-white"
            }`}
          >
            {claimed ? "En tu Bóveda ✓" : "Obtener y guardar →"}
          </a>
        </div>
      </div>
    </div>
  );
}