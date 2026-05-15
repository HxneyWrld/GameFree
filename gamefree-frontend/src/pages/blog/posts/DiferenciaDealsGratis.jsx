import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function DiferenciaDealsGratis() {
  const { i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');

  const content = {
    es: {
      back: "← Volver al Blog",
      dateInfo: "15 de mayo, 2026 · 5 min de lectura",
      title: "Juegos Gratis vs. Mega Ofertas: ¿Cuál elegir?",
      intro: "En GameFree hemos separado nuestra plataforma en dos grandes secciones. Si te preguntas cuál es la diferencia real y por qué deberías prestar atención a ambas, este artículo es para ti.",
      q1: "El encanto de lo 100% gratuito",
      a1: "Los juegos gratuitos (100% OFF) son la joya de la corona. Son regalos permanentes de tiendas como Epic Games o GOG. Una vez que los reclamas, son tuyos para siempre sin pagar un solo centavo. La única 'desventaja' es que suelen ser títulos específicos elegidos por la tienda.",
      q2: "El poder de las Mega Ofertas (+80%)",
      a2: "Las Mega Ofertas son juegos que, aunque no son gratis, tienen descuentos tan masivos (del 80% al 95%) que su precio es insignificante comparado con su valor. Aquí es donde encontrarás juegos Triple A como 'Batman: Arkham Knight' o 'The Witcher 3' por menos de lo que cuesta un café.",
      q3: "¿Por qué GameFree separó ambas secciones?",
      a3: "Queremos que tu experiencia sea transparente. Lo gratis es gratis, y las ofertas son para quienes buscan calidad premium a precios ridículos. Al separarlos, puedes decidir si hoy quieres gastar un par de dólares en un juegazo o simplemente expandir tu biblioteca a coste cero.",
      q4: "Nuestra recomendación Senior",
      a4: "Reclama SIEMPRE todo lo gratuito, incluso si no planeas jugarlo hoy. Para las ofertas, usa nuestra puntuación de Metacritic integrada en las tarjetas para decidir si la inversión de $2 USD vale realmente la pena.",
      tip: "💡 Consejo: Activa las notificaciones de tu navegador para que te avisemos cuando una oferta del 90% aparezca en el feed.",
      cta: "Ver las Mega Ofertas ahora →"
    },
    en: {
      back: "← Back to Blog",
      dateInfo: "May 15, 2026 · 5 min read",
      title: "Free Games vs. Mega Deals: Which one to choose?",
      intro: "At GameFree we have separated our platform into two large sections. If you wonder what the real difference is and why you should pay attention to both, this article is for you.",
      q1: "The Charm of 100% Free",
      a1: "Free games (100% OFF) are the jewel in the crown. They are permanent gifts from stores like Epic Games or GOG. Once you claim them, they are yours forever without paying a single cent. The only 'disadvantage' is that they tend to be specific titles chosen by the store.",
      q2: "The Power of Mega Deals (+80%)",
      a2: "Mega Deals are games that, although not free, have such massive discounts (from 80% to 95%) that their price is insignificant compared to their value. This is where you'll find Triple-A games like 'Batman: Arkham Knight' or 'The Witcher 3' for less than the cost of a coffee.",
      q3: "Why did GameFree separate both sections?",
      a3: "We want your experience to be transparent. Free is free, and deals are for those looking for premium quality at ridiculous prices. By separating them, you can decide if today you want to spend a couple of dollars on a great game or simply expand your library at zero cost.",
      q4: "Our Senior Recommendation",
      a4: "ALWAYS claim everything free, even if you don't plan to play it today. For deals, use our integrated Metacritic score on the cards to decide if the $2 USD investment is really worth it.",
      tip: "💡 Tip: Turn on your browser notifications so we can alert you when a 90% deal appears in the feed.",
      cta: "See Mega Deals now →"
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

      <div className="mb-10">
        <p className="text-xs text-[#8b949e] mb-3">{t.dateInfo}</p>
        <h1 className="text-3xl font-bold text-white leading-snug mb-4">
          {t.title}
        </h1>
        <p className="text-[#d4d4d8] text-base leading-relaxed">
          {t.intro}
        </p>
      </div>

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

        <div className="bg-[#161b22] border border-rose-500/30 rounded-xl p-5 my-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
          <p className="text-rose-300 text-sm font-medium">
            {t.tip}
          </p>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-[#30363d]">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5"
        >
          {t.cta}
        </Link>
      </div>
    </div>
  );
}
