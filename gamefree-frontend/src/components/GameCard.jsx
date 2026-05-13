import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Clock } from "lucide-react";

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
  const [timeLeft, setTimeLeft] = useState("");

  const badgeStyle = STORE_STYLES[game.store_name] || "bg-[#30363d] text-white";

  useEffect(() => {
    if (!game.expiration_date) return;

    const calculateTimeLeft = () => {
      const end = new Date(game.expiration_date).getTime();
      const now = new Date().getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeLeft("Expirado");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${hours}h ${minutes}m`);
      }
    };

    calculateTimeLeft();
    // Update every minute to save resources, but keep it feeling live
    const intervalId = setInterval(calculateTimeLeft, 60000); 

    return () => clearInterval(intervalId);
  }, [game.expiration_date]);

  function handleClaimClick(e) {
    if (claimed || !isLoggedIn) return;

    setClaimed(true);

    if (onOptimisticClaim) {
      onOptimisticClaim(game);
    }
  }

  return (
    <a
      href={game.claim_url}
      target="_blank"
      rel="noreferrer"
      onClick={handleClaimClick}
      className={`block group relative flex flex-col h-full overflow-hidden rounded-xl bg-[#161b22] border border-[#30363d] transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50 hover:border-[#8b949e] cursor-pointer`}
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
          onClick={(e) => e.preventDefault()} // In case user clicks badge
          className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-semibold shadow-lg backdrop-blur-sm ${badgeStyle} cursor-default`}
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

        {/* Price & Timer */}
        <div className="flex flex-col gap-2">
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

          {timeLeft && timeLeft !== "Expirado" && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 bg-rose-500/10 w-fit px-2.5 py-1 rounded-full animate-pulse">
              <Clock className="w-3.5 h-3.5" />
              <span>Termina en: {timeLeft}</span>
            </div>
          )}
        </div>

      </div>
    </a>
  );
}