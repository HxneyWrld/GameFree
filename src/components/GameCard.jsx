// GameCard.jsx
// ─────────────────────────────────────────────────────────────
// Componente presentacional: recibe un objeto `game` como prop
// y renderiza la tarjeta visual. No tiene lógica de red propia,
// esa responsabilidad es exclusiva de App.jsx (separación de capas).
// ─────────────────────────────────────────────────────────────

// Mapa de tiendas a clases de color Tailwind para los badges
const STORE_STYLES = {
  "Epic Games": "bg-green-100 text-green-800",
  "Steam":      "bg-blue-100  text-blue-800",
  "GOG":        "bg-purple-100 text-purple-800",
};

export default function GameCard({ game }) {
  const {
    title,
    thumbnail_url,
    store_name,
    claim_url,
    original_price,
    expiration_date,
  } = game;

  // Color del badge de tienda; si no está en el mapa, color neutro
  const badgeStyle = STORE_STYLES[store_name] ?? "bg-gray-100 text-gray-700";

  // Formateamos la fecha de expiración si existe
  const expiresLabel = expiration_date
    ? `Expira el ${new Date(expiration_date).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
      })}`
    : null;

  return (
    <article className="flex flex-col bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">

      {/* ── Imagen de portada ────────────────────────────────── */}
      {thumbnail_url ? (
        <img
          src={thumbnail_url}
          alt={`Portada de ${title}`}
          className="w-full h-40 object-cover"
          // Si la imagen falla, ocultamos el elemento roto
          onError={(e) => { e.target.style.display = "none"; }}
        />
      ) : (
        // Placeholder cuando no hay thumbnail disponible
        <div className="w-full h-40 bg-indigo-50 flex items-center justify-center">
          <span className="text-5xl">🎮</span>
        </div>
      )}

      {/* ── Cuerpo de la tarjeta ─────────────────────────────── */}
      <div className="flex flex-col gap-3 p-4 flex-1">

        {/* Badge de tienda */}
        <span className={`self-start text-xs font-medium px-2.5 py-1 rounded-full ${badgeStyle}`}>
          {store_name}
        </span>

        {/* Título */}
        <h2 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
          {title}
        </h2>

        {/* Precios: original tachado + GRATIS */}
        <div className="flex items-center gap-2">
          {original_price > 0 && (
            <span className="text-sm text-gray-400 line-through">
              ${original_price.toFixed(2)}
            </span>
          )}
          <span className="text-sm font-bold text-emerald-600">
            GRATIS
          </span>
        </div>

        {/* Fecha de expiración (si existe) */}
        {expiresLabel && (
          <p className="text-xs text-gray-400">
            ⏳ {expiresLabel}
          </p>
        )}

        {/* ── Botón de reclamo ─────────────────────────────────
            Abre en pestaña nueva para no perder la sesión en la app.
            rel="noreferrer" evita que el sitio destino acceda
            a window.opener (buena práctica de seguridad).        */}
        <a
          href={claim_url}
          target="_blank"
          rel="noreferrer"
          className="mt-auto flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-medium py-2.5 rounded-lg transition-all duration-150"
        >
          Reclamar ahora →
        </a>

      </div>
    </article>
  );
}