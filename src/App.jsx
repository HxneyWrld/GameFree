// App.jsx
// ─────────────────────────────────────────────────────────────
// Componente raíz: gestiona el ciclo de vida del fetch,
// los estados de la UI (loading, error, datos) y
// delega el renderizado visual a GameCard.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import GameCard from "./components/GameCard";

// URL de la API. En desarrollo apunta a localhost;
// en producción (Vercel + Railway/Render) se reemplaza
// por una variable de entorno: import.meta.env.VITE_API_URL
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export default function App() {
    // ── Estado ──────────────────────────────────────────────────
    const [games, setGames] = useState([]);   // Array de juegos de la API
    const [loading, setLoading] = useState(true);  // ¿Estamos esperando respuesta?
    const [error, setError] = useState(null);  // Mensaje de error si algo falla

    // ── Efecto de carga inicial ──────────────────────────────────
    // useEffect con [] como dependencias = se ejecuta UNA sola vez,
    // cuando el componente se monta en el DOM (equivalente a componentDidMount).
    useEffect(() => {
        // Definimos la función async adentro del efecto porque
        // useEffect no puede recibir una función async directamente.
        async function loadGames() {
            try {
                const response = await fetch(`${API_URL}/api/games/free`);

                // Si el servidor responde con un código de error, lo tratamos
                // como un error de aplicación (no solo de red).
                if (!response.ok) {
                    throw new Error(`Error del servidor: ${response.status}`);
                }

                const json = await response.json();

                // La API devuelve { success, count, data: [...] }
                // Extraemos solo el array data para el estado.
                setGames(json.data);
            } catch (err) {
                // Guardamos el mensaje de error para mostrarlo en la UI
                setError(err.message);
            } finally {
                // finally garantiza que loading se apague SIEMPRE,
                // tanto si el fetch tuvo éxito como si falló.
                setLoading(false);
            }
        }

        loadGames();
    }, []); // <- dependencias vacías = solo al montar

    // ── Render: estado de carga ──────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 text-gray-500">
                {/* Spinner animado con Tailwind */}
                <div className="w-10 h-10 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
                <p className="text-sm">Buscando juegos gratuitos...</p>
            </div>
        );
    }

    // ── Render: estado de error ──────────────────────────────────
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3 text-center p-8">
                <span className="text-4xl">⚠️</span>
                <h2 className="text-lg font-semibold text-gray-800">No pudimos cargar los juegos</h2>
                <p className="text-sm text-gray-500 max-w-sm">{error}</p>
                {/* Botón de reintento: recarga la página para volver a disparar el useEffect */}
                <button
                    onClick={() => window.location.reload()}
                    className="mt-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    // ── Render: estado vacío ─────────────────────────────────────
    if (games.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3 text-center p-8">
                <span className="text-4xl">😴</span>
                <h2 className="text-lg font-semibold text-gray-800">Sin promociones activas</h2>
                <p className="text-sm text-gray-500">El scraper actualizará en el próximo ciclo de 12 horas.</p>
            </div>
        );
    }

    // ── Render: lista de juegos ──────────────────────────────────
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 py-10">

                {/* Encabezado */}
                <header className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-lg">
                            🎮
                        </div>
                        <h1 className="text-2xl font-semibold text-gray-900">GameFree</h1>
                    </div>
                    <p className="text-sm text-gray-500">
                        Juegos de pago, gratis ahora mismo.
                    </p>
                    {/* Contador de juegos disponibles */}
                    <span className="inline-block mt-3 text-xs font-medium bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                        🎁 {games.length} {games.length === 1 ? "juego disponible" : "juegos disponibles"} hoy
                    </span>
                </header>

                {/* Grid de tarjetas */}
                <main>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 list-none p-0">
                        {games.map((game) => (
                            // Usamos el id de Supabase como key única y estable
                            <li key={game.id}>
                                <GameCard game={game} />
                            </li>
                        ))}
                    </ul>
                </main>

                {/* Footer */}
                <footer className="mt-12 text-center text-xs text-gray-400">
                    Datos actualizados cada 12 horas vía GitHub Actions · GameFree v1.0
                </footer>

            </div>
        </div>
    );
}