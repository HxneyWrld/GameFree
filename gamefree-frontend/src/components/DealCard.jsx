import { ExternalLink, Tag } from "lucide-react";
import { useTranslation } from "react-i18next";

const STORE_STYLES = {
  "Epic Games": "bg-emerald-500 text-white",
  "Steam": "bg-blue-900 text-white",
  "GOG": "bg-purple-600 text-white",
  "Humble Bundle": "bg-rose-600 text-white",
  "GamersGate": "bg-orange-500 text-white",
  "WinGameStore": "bg-sky-500 text-white",
};

export default function DealCard({ game }) {
  const { t } = useTranslation();
  const badgeStyle = STORE_STYLES[game.store_name] || "bg-[#30363d] text-white";

  return (
    <a
      href={game.claim_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group relative flex flex-col h-full overflow-hidden rounded-xl bg-[#161b22] border border-[#30363d] transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50 hover:border-rose-500/50 cursor-pointer"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-[#0d1117]">
        {game.thumbnail_url ? (
          <img
            src={game.thumbnail_url}
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Tag className="w-12 h-12 text-gray-600" />
          </div>
        )}
        
        <span
          className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-semibold shadow-lg backdrop-blur-sm ${badgeStyle} cursor-default`}
        >
          {game.store_name}
        </span>

        {/* Discount Badge */}
        <span
          className="absolute top-3 right-3 px-3 py-1 rounded-md text-sm font-black shadow-lg backdrop-blur-sm bg-rose-600 text-white border border-rose-500/50"
        >
          -{game.discount_pct}%
        </span>

        <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] via-transparent to-transparent opacity-80" />
      </div>

      <div className="flex flex-col gap-4 p-4 flex-1">
        <h3 className="text-lg font-bold text-white line-clamp-2 leading-tight flex-1">
          {game.title}
        </h3>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#8b949e] line-through">
              ${game.original_price?.toFixed(2)}
            </span>
            <span className="text-xl font-black text-rose-400 drop-shadow-sm">
              ${game.sale_price?.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-indigo-400 mt-2">
            <span className="flex items-center gap-1.5 hover:text-indigo-300 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
              {t('game.official')}
            </span>
            {game.metacritic && (
              <span className="px-2 py-1 bg-[#21262d] text-[#e6edf3] rounded-md border border-[#30363d] font-semibold">
                Metacritic: <span className="text-emerald-400">{game.metacritic}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}
