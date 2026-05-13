import { Link } from "react-router-dom";

export default function ComoNoPerderOfertas() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 min-h-screen" style={{ background: "#0d1117" }}>
      <div className="mb-8">
        <Link to="/blog" className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium flex items-center gap-2 w-fit">
          ← Volver al Blog
        </Link>
      </div>

      {/* Header del artículo */}
      <div className="mb-10">
        <p className="text-xs text-[#8b949e] mb-3">10 de mayo, 2026 · 4 min de lectura</p>
        <h1 className="text-3xl font-bold text-white leading-snug mb-4">
          Cómo no perderte nunca una oferta en Epic Games
        </h1>
        <p className="text-[#d4d4d8] text-base leading-relaxed">
          Epic Games regala al menos un juego cada semana desde 2018. 
          El problema es que las ofertas duran exactamente 7 días y si no las reclamas a tiempo, desaparecen para siempre de la tienda gratuita.
        </p>
      </div>

      {/* Contenido */}
      <div className="space-y-8 text-[#d4d4d8] text-base leading-relaxed">

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">El problema del FOMO gamer</h2>
          <p>
            Epic ha regalado títulos como GTA V, Civilization VI, Borderlands y decenas de juegos indie valorados entre $10 y $60. 
            Pero la mayoría de los jugadores se entera tarde, cuando la oferta ya expiró.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">La solución más simple</h2>
          <p>
            La forma más directa es revisar <strong>GameFree</strong> cada semana. El sistema actualiza automáticamente las ofertas cada 12 horas, 
            así que siempre verás el estado real de cada tienda sin tener que abrir múltiples launchers de juegos.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">¿Qué pasa si reclamas el juego pero no lo instalas?</h2>
          <p>
            Nada. Reclamar un juego en Epic solo lo agrega a tu biblioteca permanentemente. 
            No tienes que descargarlo ni jugarlo para que sea tuyo. Puedes instalarlo semanas o meses después cuando tengas tiempo o espacio en disco.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">El truco del jueves</h2>
          <p>
            Epic siempre rota sus juegos gratuitos los jueves a las 11:00 AM hora del este (ET). 
            Si conviertes ese horario a tu zona horaria y lo revisas ese día, nunca te pierdes el cambio de oferta.
          </p>
        </section>

        <div className="bg-[#161b22] border border-indigo-500/30 rounded-xl p-5 my-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
          <p className="text-indigo-300 text-sm font-medium">
            💡 Tip: En GameFree puedes ver exactamente cuánto tiempo le queda a cada oferta con la cuenta regresiva roja en cada tarjeta.
          </p>
        </div>

      </div>

      {/* CTA al final */}
      <div className="mt-12 pt-8 border-t border-[#30363d]">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5"
        >
          Ver juegos gratuitos ahora →
        </Link>
      </div>

    </div>
  );
}
