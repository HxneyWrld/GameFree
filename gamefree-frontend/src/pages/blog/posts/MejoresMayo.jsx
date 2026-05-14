import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function MejoresMayo() {
  const { i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');

  const content = {
    es: {
      back: "← Volver al Blog",
      dateInfo: "13 de mayo, 2026 · 3 min de lectura",
      title: "Los mejores juegos gratuitos de mayo 2026",
      intro: "Este mes las tiendas de videojuegos se volvieron locas. Epic Games, Steam y GOG regalaron títulos que normalmente cuestan entre $10 y $30. Te contamos cuáles fueron los más destacados para que no te los pierdas.",
      q1: "El mes de los indies y los clásicos",
      a1: "Generalmente mayo es un mes tranquilo antes de las grandes rebajas de verano, pero este año fue diferente. Varias plataformas decidieron abrir sus bóvedas y regalar verdaderas joyas ocultas y un par de juegos triple A.",
      q2: "La gran sorpresa de Epic Games",
      a2: "EpicGames continuó su tradición de regalar títulos masivos. Este mes nos sorprendió con un RPG aclamado por la crítica que normalmente tiene un precio de $29.99. Si lo reclamaste a tiempo, felicidades, te has llevado cientos de horas de entretenimiento gratis.",
      q3: "Las joyas ocultas de Steam y GOG",
      a3: "Mientras tanto, Steam ofreció un par de juegos de estrategia y gestión que pasaron desapercibidos para muchos, pero que tienen valoraciones de 'Extremadamente Positivas'. GOG, por su parte, nos deleitó con un clásico retro sin DRM, ideal para los nostálgicos.",
      q4: "¿Por qué regalan estos juegos?",
      a4: "Muchas veces, las distribuidoras regalan el juego base para incentivar la compra de DLCs o para crear hype antes del lanzamiento de una secuela. Para los jugadores, es una oportunidad de oro. ¡Aprovecha siempre y añade a tu biblioteca!",
      tip: "💡 Consejo: Asegúrate de revisar tu feed en GameFree cada un par de días para atrapar estas sorpresas que duran solo 48 horas.",
      cta: "Explorar el feed de juegos →"
    },
    en: {
      back: "← Back to Blog",
      dateInfo: "May 13, 2026 · 3 min read",
      title: "The Best Free Games of May 2026",
      intro: "This month the video game stores went crazy. Epic Games, Steam, and GOG gave away titles that normally cost between $10 and $30. We tell you which were the most outstanding so you don't miss them.",
      q1: "The Month of Indies and Classics",
      a1: "Generally May is a quiet month before the big summer sales, but this year was different. Several platforms decided to open their vaults and give away real hidden gems and a couple of triple-A games.",
      q2: "The Big Surprise from Epic Games",
      a2: "EpicGames continued its tradition of giving away massive titles. This month it surprised us with a critically acclaimed RPG that normally costs $29.99. If you claimed it in time, congratulations, you've taken home hundreds of hours of free entertainment.",
      q3: "The Hidden Gems of Steam and GOG",
      a3: "Meanwhile, Steam offered a couple of strategy and management games that went unnoticed by many, but have 'Extremely Positive' ratings. GOG, for its part, delighted us with a DRM-free retro classic, ideal for the nostalgic.",
      q4: "Why Do They Give These Games Away?",
      a4: "Often, publishers give away the base game to encourage DLC purchases or to create hype before a sequel's release. For players, it's a golden opportunity. Always take advantage and add to your library!",
      tip: "💡 Tip: Make sure to check your GameFree feed every couple of days to catch these surprises that last only 48 hours.",
      cta: "Explore the game feed →"
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
