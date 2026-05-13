import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import GameCard from "./components/GameCard";
import AuthModal from "./components/AuthModal";
import Navbar from "./components/Navbar";

import HeroSection from "./components/HeroSection";
import FilterSidebar from "./components/FilterSidebar";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

function GameFeedApp() {
  const { user, token, isLoggedIn, login, logout } = useAuth();
  const [games,        setGames]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [showModal,    setShowModal]    = useState(false);
  const [authMode,     setAuthMode]     = useState("login");
  const [resetToken,   setResetToken]   = useState(null);
  const [tab,          setTab]          = useState("feed");
  const [claimedIds,   setClaimedIds]   = useState(new Set());
  
  // Custom Toast State
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    if (hash.includes("access_token")) {
      const params = new URLSearchParams(hash.substring(1));
      const type = params.get("type");
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (accessToken) {
        window.history.replaceState(null, "", window.location.pathname);
        if (type === "recovery") {
          setResetToken({ access_token: accessToken, refresh_token: refreshToken });
          setAuthMode("reset");
          setShowModal(true);
        } else if (type === "signup" || type === "magiclink") {
          try {
            const payload = JSON.parse(atob(accessToken.split('.')[1]));
            login({ id: payload.sub, email: payload.email }, accessToken);
          } catch (e) {
            console.error("No se pudo decodificar el token de inicio de sesión", e);
          }
        }
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
    };
    try {
      const res  = await fetch(`${API_URL}${endpoints[tab]}`, { headers });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      if (tab === "feed") {
        setGames(json.data);
      } else {
        setGames(
          json.data
            .filter((entry) => entry.games)
            .map((entry) => ({
              ...entry.games,
              claimedAt: entry.claimed_at,
            }))
        );
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
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };
    const res = await fetch(`${API_URL}/api/user/library`, { headers });
    const json = await res.json();
    if (json.success) setClaimedIds(new Set(json.data.map((e) => e.games.id)));
  }

  useEffect(() => { loadData(); },      [token, tab]);
  useEffect(() => { loadUserState(); }, [isLoggedIn, token]);

  useEffect(() => {
    if (!isLoggedIn && tab !== "feed") setTab("feed");
  }, [isLoggedIn]);

  const handleOpenAuth = () => {
    setAuthMode("login");
    setResetToken(null);
    setShowModal(true);
  };

  const handleOptimisticClaim = async (game) => {
    // Actualizamos localmente primero
    setClaimedIds(prev => new Set([...prev, game.id]));
    
    const priceToSave = game.original_price > 0 ? game.original_price.toFixed(2) : "0.00";
    setToastMessage(`¡Redirigiendo a la tienda! Sumamos $${priceToSave} a tu ahorro total.`);
    
    // Ocultar toast después de 4 segundos
    setTimeout(() => setToastMessage(null), 4000);

    // Hacemos la llamada al backend en segundo plano
    try {
      await fetch(`${API_URL}/api/games/${game.id}/claim`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Error al guardar en el historial:", error);
    }
  };

  // ── Filters Logic ────────────────────────────────────────────────────────
  const [selectedStores, setSelectedStores] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
    setSearchQuery("");
  };

  const filteredGames = games.filter(g => {
    if (tab === "feed" && claimedIds.has(g.id)) return false;
    if (selectedStores.length > 0 && !selectedStores.includes(g.store_name)) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      if (!g.title.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const totalSavings = games.reduce((acc, g) => acc + (g.original_price || 0), 0);

  return (
    <div className="min-h-screen" style={{ background: "#0d1117" }}>
      {showModal && (
        <AuthModal 
          onClose={() => setShowModal(false)} 
          initialMode={authMode} 
          resetToken={resetToken} 
        />
      )}

      {/* ── Custom Toast ─────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
          <div className="bg-emerald-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-emerald-400">
            <span className="font-semibold text-sm">{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="text-white hover:text-emerald-200 p-1">✕</button>
          </div>
        </div>
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
        
        {/* Sidebar Responsive Drawer */}
        <div className={`fixed inset-0 z-40 transition-opacity md:static md:z-auto ${isMobileFilterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto'}`}>
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm md:hidden" 
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className={`absolute left-0 top-0 bottom-0 w-[280px] max-w-[80vw] bg-[#0d1117] p-4 transform transition-transform md:static md:w-64 md:p-0 md:bg-transparent md:transform-none ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
            <div className="flex items-center justify-between mb-4 md:hidden">
              <span className="font-semibold text-white">Menú de Filtros</span>
              <button onClick={() => setIsMobileFilterOpen(false)} className="text-gray-400 hover:text-white text-xl px-2">✕</button>
            </div>
            
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
        </div>

        {/* Main Grid Area */}
        <div className="flex-1 min-w-0">
          
          {/* Banner de Ahorro para Mi Bóveda */}
          {tab === "library" && !loading && !error && (
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-purple-900/20 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Mi Bóveda de Ahorros</h2>
                <p className="text-indigo-200 text-sm">Historial de juegos que has reclamado gratis.</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-indigo-300 font-medium mb-1">Has ahorrado un total de</p>
                <p className="text-4xl font-black text-emerald-400 drop-shadow-md">
                  ${totalSavings.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {/* Barra de Búsqueda */}
          {!loading && !error && games.length > 0 && (
            <div className="mb-6 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-[#8b949e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder={tab === "feed" ? "Buscar juegos por nombre..." : "Buscar en tu bóveda..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#161b22] border border-[#30363d] text-white rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors placeholder-[#8b949e] shadow-sm"
              />
            </div>
          )}

          {/* Contador y botón filtro móvil */}
          {!loading && !error && filteredGames.length > 0 && (
            <div className="mb-6 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-indigo-900/30 text-indigo-300 border border-indigo-700/40 px-3 py-1 rounded-full">
                🎮 {filteredGames.length} {filteredGames.length === 1 ? "juego disponible" : "juegos disponibles"}
              </span>
              <div className="md:hidden">
                <button 
                  className="text-xs bg-[#27272a] text-white px-4 py-2 rounded-lg border border-[#3f3f46] flex items-center gap-2 hover:bg-[#3f3f46] transition-colors"
                  onClick={() => setIsMobileFilterOpen(true)}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
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
              <span className="text-4xl">{tab === "feed" ? "😴" : "💸"}</span>
              <p className="text-gray-500 text-sm">
                {tab === "feed"    && "Sin promociones activas ahora mismo."}
                {tab === "library" && "Tu bóveda está vacía. ¡Ve al feed y empieza a ahorrar!"}
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
                    onOptimisticClaim={handleOptimisticClaim}
                    initialClaimed={claimedIds.has(game.id)}
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