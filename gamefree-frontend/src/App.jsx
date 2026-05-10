import { useState, useEffect } from "react";
import corazonIcon from "./icons/corazon.png";
import bibliotecaIcon from "./icons/biblioteca.png";
import feedIcon from "./icons/feed.png";
import { AuthProvider, useAuth } from "./context/AuthContext";
import GameCard from "./components/GameCard";
import AuthModal from "./components/AuthModal";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

function GameFeedApp() {
  // 1. PRIMERO todos los useState
  const { user, token, isLoggedIn, logout } = useAuth();
  const [games,        setGames]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [showModal,    setShowModal]    = useState(false);
  const [tab,          setTab]          = useState("feed");
  const [claimedIds,   setClaimedIds]   = useState(new Set());
  const [favoritedIds, setFavoritedIds] = useState(new Set());

  // 2. SEGUNDO la función loadData
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

  // 3. TERCERO la función loadUserState
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
    if (claimed.success) {
      setClaimedIds(new Set(claimed.data.map((e) => e.games.id)));
    }
    if (favorites.success) {
      setFavoritedIds(new Set(favorites.data.map((e) => e.games.id)));
    }
  }

  // 4. CUARTO los useEffect (ya pueden llamar a las funciones de arriba)
  useEffect(() => {
    loadData();
  }, [token, tab]);

  useEffect(() => {
    loadUserState();
  }, [isLoggedIn, token]);

  // 5. handleGameClaimed
  function handleGameClaimed(gameId) {
    setGames((prev) => prev.filter((g) => g.id !== gameId));
  }

  // 6. El return con el JSX
  return (
    <div className="min-h-screen bg-gray-50">
      {showModal && <AuthModal onClose={() => setShowModal(false)} />}

      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* ── Header ──────────────────────────────────────────── */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white">🎮</div>
              <h1 className="text-2xl font-semibold text-gray-900">GameFree</h1>
            </div>
            <p className="text-sm text-gray-500">Juegos de pago, gratis ahora mismo.</p>
          </div>

          {/* Botón de sesión */}
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 hidden sm:block">
                {user.email.split("@")[0].charAt(0).toUpperCase() + user.email.split("@")[0].slice(1)}
              </span>
              <button
                onClick={logout}
                className="text-sm border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Salir
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Iniciar sesión
            </button>
          )}
        </header>

        {/* ── Tabs (solo si hay sesión) ────────────────────────── */}
        {isLoggedIn && (
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit mb-6">
            {[
              { key: "feed",      label: <><img src={feedIcon} alt="" className="inline w-4 h-4 mr-1 align-middle" />Feed</> },
              { key: "library",   label: <><img src={bibliotecaIcon} alt="" className="inline w-4 h-4 mr-1 align-middle" />Mi biblioteca</> },
              { key: "favorites", label: <><img src={corazonIcon} alt="" className="inline w-4 h-4 mr-1 align-middle" />Favoritos</> },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  tab === key
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* ── Contador ─────────────────────────────────────────── */}
        {!loading && !error && games.length > 0 && (
          <span className="inline-block mb-6 text-xs font-medium bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
            <img src={feedIcon} alt="" className="inline w-3.5 h-3.5 mr-1 align-middle" />
            {games.length} {games.length === 1 ? "juego disponible" : "juegos disponibles"}
          </span>
        )}

        {/* ── Estados ──────────────────────────────────────────── */}
        {loading && (
          <div className="flex flex-col items-center gap-4 py-20 text-gray-500">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-sm">Cargando juegos...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <span className="text-4xl">⚠️</span>
            <p className="text-sm text-gray-500">{error}</p>
            <button onClick={loadData} className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg">
              Reintentar
            </button>
          </div>
        )}

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

        {/* ── Grid de juegos ───────────────────────────────────── */}
        {!loading && !error && games.length > 0 && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 list-none p-0">
            {games.map((game) => (
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

        <footer className="mt-12 text-center text-xs text-gray-400">
          GameFree
        </footer>

      </div>
    </div>
  );
}

// Envolvemos todo en el AuthProvider para que el contexto
// esté disponible en cualquier componente de la app
export default function App() {
  return (
    <AuthProvider>
      <GameFeedApp />
    </AuthProvider>
  );
}