import { Link } from "react-router-dom";

export default function MejoresMayo() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 min-h-screen" style={{ background: "#0d1117" }}>
      <div className="mb-8">
        <Link to="/blog" className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium flex items-center gap-2 w-fit">
          ← Volver al Blog
        </Link>
      </div>

      {/* Header del artículo */}
      <div className="mb-10">
        <p className="text-xs text-[#8b949e] mb-3">13 de mayo, 2026 · 3 min de lectura</p>
        <h1 className="text-3xl font-bold text-white leading-snug mb-4">
          Los mejores juegos gratuitos de mayo 2026
        </h1>
        <p className="text-[#d4d4d8] text-base leading-relaxed">
          Este mes las tiendas de videojuegos se volvieron locas. Epic Games, Steam y GOG regalaron títulos que normalmente cuestan entre $10 y $30. Te contamos cuáles fueron los más destacados para que no te los pierdas.
        </p>
      </div>

      {/* Contenido */}
      <div className="space-y-8 text-[#d4d4d8] text-base leading-relaxed">

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">El mes de los indies y los clásicos</h2>
          <p>
            Generalmente mayo es un mes tranquilo antes de las grandes rebajas de verano, pero este año fue diferente. Varias plataformas decidieron abrir sus bóvedas y regalar verdaderas joyas ocultas y un par de juegos triple A.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">La gran sorpresa de Epic Games</h2>
          <p>
            EpicGames continuó su tradición de regalar títulos masivos. Este mes nos sorprendió con un RPG aclamado por la crítica que normalmente tiene un precio de $29.99. Si lo reclamaste a tiempo, felicidades, te has llevado cientos de horas de entretenimiento gratis.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">Las joyas ocultas de Steam y GOG</h2>
          <p>
            Mientras tanto, Steam ofreció un par de juegos de estrategia y gestión que pasaron desapercibidos para muchos, pero que tienen valoraciones de "Extremadamente Positivas". GOG, por su parte, nos deleitó con un clásico retro sin DRM, ideal para los nostálgicos.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">¿Por qué regalan estos juegos?</h2>
          <p>
            Muchas veces, las distribuidoras regalan el juego base para incentivar la compra de DLCs o para crear hype antes del lanzamiento de una secuela. Para los jugadores, es una oportunidad de oro. ¡Aprovecha siempre y añade a tu biblioteca!
          </p>
        </section>

        <div className="bg-[#161b22] border border-indigo-500/30 rounded-xl p-5 my-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
          <p className="text-indigo-300 text-sm font-medium">
            💡 Consejo: Asegúrate de revisar tu feed en GameFree cada un par de días para atrapar estas sorpresas que duran solo 48 horas.
          </p>
        </div>

      </div>

      {/* CTA al final */}
      <div className="mt-12 pt-8 border-t border-[#30363d]">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5"
        >
          Explorar el feed de juegos →
        </Link>
      </div>

    </div>
  );
}
