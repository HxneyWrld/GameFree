import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import GameCard from "./components/GameCard";
import AuthModal from "./components/AuthModal";
import Navbar from "./components/Navbar";

import HeroSection from "./components/HeroSection";
import FilterSidebar from "./components/FilterSidebar";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

function GameFeedApp() {
  const { user, token, isLoggedIn, logout } = useAuth();
  const [games,        setGames]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [showModal,    setShowModal]    = useState(false);
  const [authMode,     setAuthMode]     = useState("login");
  const [resetToken,   setResetToken]   = useState(null);
  const [tab,          setTab]          = useState("feed");
  const [claimedIds,   setClaimedIds]   = useState(new Set());
  const [favoritedIds, setFavoritedIds] = useState(new Set());

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("type=recovery")) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      if (accessToken) {
        setResetToken(accessToken);
        setAuthMode("reset");
        setShowModal(true);
        window.history.replaceState(null, "", window.location.pathname);
      }
    }
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const endpoints = {
      feed:      "/api/games/free",
      library:   "/api/user/library",
      favorites: "/api/user/favorites",
    };
    try {
      const res  = await fetch(`${API_URL}${endpoints[tab]}`, { headers });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      if (tab === "feed") {
        setGames(json.data);
      } else {
        setGames(json.data.map((entry) => ({
          ...entry.games,
          claimedAt:   entry.claimed_at,
          favoritedAt: entry.favorited_at,
        })));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadUserState() {
    if (!isLoggedIn) {
      setClaimedIds(new Set());
      setFavoritedIds(new Set());
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };
    const [claimedRes, favoritesRes] = await Promise.all([
      fetch(`${API_URL}/api/user/library`,   { headers }),
      fetch(`${API_URL}/api/user/favorites`, { headers }),
    ]);
    const claimed   = await claimedRes.json();
    const favorites = await favoritesRes.json();
    if (claimed.success)   setClaimedIds(new Set(claimed.data.map((e) => e.games.id)));
    if (favorites.success) setFavoritedIds(new Set(favorites.data.map((e) => e.games.id)));
  }

  useEffect(() => { loadData(); },      [token, tab]);
  useEffect(() => { loadUserState(); }, [isLoggedIn, token]);

  // Si cierra sesión estando en library/favorites, volver al feed
  useEffect(() => {
    if (!isLoggedIn && tab !== "feed") setTab("feed");
  }, [isLoggedIn]);

  function handleGameClaimed(gameId) {
    setGames((prev) => prev.filter((g) => g.id !== gameId));
  }

  const handleOpenAuth = () => {
    setAuthMode("login");
    setResetToken(null);
    setShowModal(true);
  };

  // ── Filters Logic ────────────────────────────────────────────────────────
  const [selectedStores, setSelectedStores] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);

  const storeCounts = games.reduce((acc, g) => {
    acc[g.store_name] = (acc[g.store_name] || 0) + 1;
    return acc;
  }, {});

  const storeOptions = Object.keys(storeCounts).map(store => ({
    id: store,
    label: store,
    count: storeCounts[store]
  })).sort((a, b) => b.count - a.count);

  const statusOptions = [
    { id: "active", label: "Activos", count: games.length }
  ];

  const handleStoreToggle = (storeId) => {
    setSelectedStores(prev => 
      prev.includes(storeId) ? prev.filter(id => id !== storeId) : [...prev, storeId]
    );
  };

  const handleStatusToggle = (statusId) => {
    setSelectedStatus(prev => 
      prev.includes(statusId) ? prev.filter(id => id !== statusId) : [...prev, statusId]
    );
  };

  const handleClearAll = () => {
    setSelectedStores([]);
    setSelectedStatus([]);
  };

  const filteredGames = games.filter(g => {
    if (selectedStores.length > 0 && !selectedStores.includes(g.store_name)) return false;
    return true;
  });

  return (
    <div className="min-h-screen" style={{ background: "#0d1117" }}>
      {showModal && (
        <AuthModal 
          onClose={() => setShowModal(false)} 
          initialMode={authMode} 
          resetToken={resetToken} 
        />
      )}

      {/* ── Navbar ─────────────────────────────────────────── */}
      <Navbar
        activeTab={tab}
        onTabChange={setTab}
        onOpenAuth={handleOpenAuth}
      />

      {tab === "feed" && (
        <HeroSection onExplore={() => document.getElementById('games-grid')?.scrollIntoView({ behavior: 'smooth' })} />
      )}

      {/* ── Contenido ──────────────────────────────────────── */}
      <main id="games-grid" className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0 hidden md:block">
          <FilterSidebar 
            storeOptions={storeOptions}
            selectedStores={selectedStores}
            onStoreToggle={handleStoreToggle}
            statusOptions={statusOptions}
            selectedStatus={selectedStatus}
            onStatusToggle={handleStatusToggle}
            onClearAll={handleClearAll}
          />
        </div>

        {/* Main Grid Area */}
        <div className="flex-1 min-w-0">
          {/* Contador */}
          {!loading && !error && filteredGames.length > 0 && (
            <div className="mb-6 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-indigo-900/30 text-indigo-300 border border-indigo-700/40 px-3 py-1 rounded-full">
                🎮 {filteredGames.length} {filteredGames.length === 1 ? "juego disponible" : "juegos disponibles"}
              </span>
              <div className="md:hidden">
                <button 
                  className="text-xs bg-[#27272a] text-white px-3 py-1.5 rounded-lg border border-[#3f3f46]"
                  onClick={() => alert("Los filtros móviles aún no están implementados.")}
                >
                  Filtros
                </button>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center gap-4 py-20 text-gray-500">
              <div className="w-10 h-10 border-4 border-gray-700 border-t-indigo-500 rounded-full animate-spin" />
              <p className="text-sm">Cargando juegos...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <span className="text-4xl">⚠️</span>
              <p className="text-sm text-gray-500">{error}</p>
              <button onClick={loadData} className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg">
                Reintentar
              </button>
            </div>
          )}

          {/* Vacío general */}
          {!loading && !error && games.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <span className="text-4xl">{tab === "feed" ? "😴" : "📭"}</span>
              <p className="text-gray-500 text-sm">
                {tab === "feed"      && "Sin promociones activas ahora mismo."}
                {tab === "library"   && "Todavía no marcaste ningún juego como reclamado."}
                {tab === "favorites" && "Todavía no tienes juegos favoritos."}
              </p>
            </div>
          )}

          {/* Vacío por filtros */}
          {!loading && !error && games.length > 0 && filteredGames.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <span className="text-4xl">🔍</span>
              <p className="text-gray-500 text-sm">
                No hay juegos que coincidan con los filtros.
              </p>
              <button onClick={handleClearAll} className="text-sm bg-[#27272a] text-white border border-[#3f3f46] px-4 py-2 rounded-lg hover:bg-[#3f3f46] transition-colors mt-2">
                Limpiar filtros
              </button>
            </div>
          )}

          {/* Grid de juegos */}
          {!loading && !error && filteredGames.length > 0 && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 list-none p-0">
              {filteredGames.map((game) => (
                <li key={game.id}>
                  <GameCard
                    game={game}
                    onClaimed={handleGameClaimed}
                    onUnclaimed={handleGameClaimed}
                    onUnfavorited={handleGameClaimed}
                    initialClaimed={claimedIds.has(game.id)}
                    initialFavorited={favoritedIds.has(game.id)}
                  />
                </li>
              ))}
            </ul>
          )}

          <footer className="mt-12 text-center text-xs text-gray-600">
            GameFree — Juegos de pago, gratis ahora mismo.
          </footer>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <GameFeedApp />
    </AuthProvider>
  );
}