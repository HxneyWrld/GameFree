// Navbar.jsx — Barra de navegación superior
import { useState } from "react";

export default function Navbar() {
  const [activeNav, setActiveNav] = useState("inicio");

  return (
    <nav className="sticky top-0 z-50 bg-[#0d1117]/95 backdrop-blur border-b border-[#30363d]">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">

        {/* ── Logo ── */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-base">
            🎮
          </div>
          <span className="font-bold text-base">
            <span className="text-white">Game</span>
            <span className="text-blue-400">Free</span>
          </span>
          <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full -mt-3 -ml-1 tracking-wide">
            HOT
          </span>
        </div>

        {/* ── Nav links ── */}
        <div className="hidden sm:flex items-center gap-6">
          {[
            { id: "inicio", label: "Inicio" },
            { id: "ofertas", label: "Ofertas Activas" },
            { id: "biblioteca", label: "Mi Biblioteca" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveNav(id)}
              className={activeNav === id ? "nav-link-active" : "nav-link"}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Search ── */}
        <div className="flex-1 max-w-56">
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8b949e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full bg-[#161b22] border border-[#30363d] text-sm text-white placeholder-[#8b949e] rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* ── Spacer ── */}
        <div className="flex-1" />

        {/* ── Auth buttons ── */}
        <div className="flex items-center gap-2 shrink-0">
          <button className="btn-outline">Iniciar Sesión</button>
          <button className="btn-primary">Registrarse</button>
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white ml-1">
            U
          </div>
        </div>

      </div>
    </nav>
  );
}
