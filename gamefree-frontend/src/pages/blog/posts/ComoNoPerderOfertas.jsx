import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ComoNoPerderOfertas() {
  const { i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');

  const content = {
    es: {
      back: "← Volver al Blog",
      dateInfo: "10 de mayo, 2026 · 4 min de lectura",
      title: "Cómo no perderte nunca una oferta en Epic Games",
      intro: "Epic Games regala al menos un juego cada semana desde 2018. El problema es que las ofertas duran exactamente 7 días y si no las reclamas a tiempo, desaparecen para siempre de la tienda gratuita.",
      q1: "El problema del FOMO gamer",
      a1: "Epic ha regalado títulos como GTA V, Civilization VI, Borderlands y decenas de juegos indie valorados entre $10 y $60. Pero la mayoría de los jugadores se entera tarde, cuando la oferta ya expiró.",
      q2: "La solución más simple",
      a2: "La forma más directa es revisar GameFree cada semana. El sistema actualiza automáticamente las ofertas cada 12 horas, así que siempre verás el estado real de cada tienda sin tener que abrir múltiples launchers de juegos.",
      q3: "¿Qué pasa si reclamas el juego pero no lo instalas?",
      a3: "Nada. Reclamar un juego en Epic solo lo agrega a tu biblioteca permanentemente. No tienes que descargarlo ni jugarlo para que sea tuyo. Puedes instalarlo semanas o meses después cuando tengas tiempo o espacio en disco.",
      q4: "El truco del jueves",
      a4: "Epic siempre rota sus juegos gratuitos los jueves a las 11:00 AM hora del este (ET). Si conviertes ese horario a tu zona horaria y lo revisas ese día, nunca te pierdes el cambio de oferta.",
      tip: "💡 Tip: En GameFree puedes ver exactamente cuánto tiempo le queda a cada oferta con la cuenta regresiva roja en cada tarjeta.",
      cta: "Ver juegos gratuitos ahora →"
    },
    en: {
      back: "← Back to Blog",
      dateInfo: "May 10, 2026 · 4 min read",
      title: "How to Never Miss a Deal on Epic Games",
      intro: "Epic Games has been giving away at least one game every week since 2018. The problem is that deals last exactly 7 days, and if you don't claim them in time, they disappear forever from the free store.",
      q1: "The Gamer FOMO Problem",
      a1: "Epic has given away titles like GTA V, Civilization VI, Borderlands, and dozens of indie games valued between $10 and $60. But most players find out too late, after the deal has already expired.",
      q2: "The Simplest Solution",
      a2: "The most direct way is to check GameFree every week. The system automatically updates deals every 12 hours, so you'll always see the real-time status of each store without opening multiple game launchers.",
      q3: "What if You Claim the Game but Don't Install It?",
      a3: "Nothing. Claiming a game on Epic just adds it permanently to your library. You don't have to download or play it for it to be yours. You can install it weeks or months later when you have time or disk space.",
      q4: "The Thursday Trick",
      a4: "Epic always rotates its free games on Thursdays at 11:00 AM Eastern Time (ET). If you convert that to your time zone and check it that day, you'll never miss a deal change.",
      tip: "💡 Tip: On GameFree you can see exactly how much time is left for each deal with the red countdown on each card.",
      cta: "See free games now →"
    }
  };

  const t = isEn ? content.en : content.es;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 min-h-screen" style={{ background: "#0d1117" }}>
      <div className="mb-8">
        <Link to="/blog" className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium flex items-center gap-2 w-fit">
          {t.back}
        </Link>
      </div>

      {/* Header del artículo */}
      <div className="mb-10">
        <p className="text-xs text-[#8b949e] mb-3">{t.dateInfo}</p>
        <h1 className="text-3xl font-bold text-white leading-snug mb-4">
          {t.title}
        </h1>
        <p className="text-[#d4d4d8] text-base leading-relaxed">
          {t.intro}
        </p>
      </div>

      {/* Contenido */}
      <div className="space-y-8 text-[#d4d4d8] text-base leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">{t.q1}</h2>
          <p>{t.a1}</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">{t.q2}</h2>
          <p>{t.a2}</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">{t.q3}</h2>
          <p>{t.a3}</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">{t.q4}</h2>
          <p>{t.a4}</p>
        </section>

        <div className="bg-[#161b22] border border-indigo-500/30 rounded-xl p-5 my-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
          <p className="text-indigo-300 text-sm font-medium">
            {t.tip}
          </p>
        </div>
      </div>

      {/* CTA al final */}
      <div className="mt-12 pt-8 border-t border-[#30363d]">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5"
        >
          {t.cta}
        </Link>
      </div>
    </div>
  );
}
