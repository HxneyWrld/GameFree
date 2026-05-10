// FilterSidebar.jsx — Sidebar derecho con filtros de tienda, género y filtro inteligente
import { useState } from "react";

const STORES = ["Epic", "Steam", "GOG", "Humble", "Prime Gaming"];
const GENRES = ["Acción", "Aventura", "RPG", "Estrategia", "Indie"];

export default function FilterSidebar({ onFilterChange }) {
  const [selectedStores, setSelectedStores] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [smartFilter, setSmartFilter] = useState(true);

  function toggleStore(store) {
    setSelectedStores((prev) =>
      prev.includes(store) ? prev.filter((s) => s !== store) : [...prev, store]
    );
  }

  function toggleGenre(genre) {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  }

  return (
    <aside className="w-52 shrink-0 hidden lg:flex flex-col gap-4">

      {/* ── Filtra por Tienda ── */}
      <div className="card-dark p-4">
        <p className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-3">
          Filtra por
        </p>
        <div className="flex flex-col gap-2">
          {STORES.map((store) => (
            <label key={store} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedStores.includes(store)}
                onChange={() => toggleStore(store)}
                className="w-3.5 h-3.5 rounded border-[#30363d] bg-[#21262d] accent-blue-500 cursor-pointer"
              />
              <span className="text-sm text-[#c9d1d9] group-hover:text-white transition-colors">
                {store}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* ── Género ── */}
      <div className="card-dark p-4">
        <p className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-3">
          Género
        </p>
        <div className="flex flex-col gap-2">
          {GENRES.map((genre) => (
            <label key={genre} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedGenres.includes(genre)}
                onChange={() => toggleGenre(genre)}
                className="w-3.5 h-3.5 rounded border-[#30363d] bg-[#21262d] accent-blue-500 cursor-pointer"
              />
              <span className="text-sm text-[#c9d1d9] group-hover:text-white transition-colors">
                {genre}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* ── Filtro Inteligente ── */}
      <div className="card-dark p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-white mb-1">Filtro Inteligente</p>
            <p className="text-xs text-[#8b949e] leading-snug">
              Oculta juegos permanentes Free-to-Play
            </p>
          </div>
          {/* Toggle switch */}
          <button
            onClick={() => setSmartFilter((v) => !v)}
            className={`relative shrink-0 mt-0.5 w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none ${
              smartFilter ? "bg-blue-500" : "bg-[#30363d]"
            }`}
            aria-label="Activar filtro inteligente"
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                smartFilter ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

    </aside>
  );
}
