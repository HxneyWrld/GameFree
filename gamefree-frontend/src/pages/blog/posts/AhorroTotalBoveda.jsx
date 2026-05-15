import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AhorroTotalBoveda() {
  const { i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');

  const content = {
    es: {
      back: "← Volver al Blog",
      dateInfo: "14 de mayo, 2026 · 4 min de lectura",
      title: "La Bóveda de Ahorros: ¿Cuánto dinero has ahorrado realmente?",
      intro: "¿Alguna vez te has detenido a pensar cuánto valdría tu biblioteca de juegos si hubieras pagado por cada uno de ellos? En GameFree, nuestra 'Bóveda' hace el trabajo sucio por ti.",
      q1: "¿Qué es la Bóveda de Ahorros?",
      a1: "Es una de las funciones favoritas de nuestra comunidad. No es solo una lista de juegos que has reclamado; es un contador en tiempo real de tu éxito financiero como gamer. Cada vez que marcas un juego como 'Reclamado', sumamos su precio original a tu contador personal.",
      q2: "Ver tu progreso en dólares",
      a2: "Imagina que reclamas un juego de $60 hoy y uno de $20 mañana. Tu Bóveda mostrará inmediatamente un ahorro de $80 USD. Ver ese número crecer genera una satisfacción increíble y te ayuda a ver el valor real de los regalos que las tiendas ofrecen.",
      q3: "No es solo por el número",
      a3: "La Bóveda también sirve para organizar tu biblioteca. A veces reclamamos tantos juegos gratis que olvidamos qué tenemos y en qué tienda (Epic, Steam, GOG). Al tenerlos todos en tu Bóveda de GameFree, tienes un inventario centralizado.",
      q4: "Próximas funciones",
      a4: "Estamos trabajando para que puedas compartir tu ahorro total con tus amigos en redes sociales. ¿Quién será el que más dinero haya ahorrado en la comunidad?",
      tip: "💡 Consejo: Inicia sesión siempre antes de reclamar para que el sistema pueda vincular el ahorro a tu perfil de forma permanente.",
      cta: "Ir a mi Bóveda →"
    },
    en: {
      back: "← Back to Blog",
      dateInfo: "May 14, 2026 · 4 min read",
      title: "The Savings Vault: How much money have you actually saved?",
      intro: "Have you ever stopped to think how much your game library would be worth if you had paid for each of them? At GameFree, our 'Vault' does the dirty work for you.",
      q1: "What is the Savings Vault?",
      a1: "It's one of our community's favorite features. It's not just a list of games you've claimed; it's a real-time counter of your financial success as a gamer. Every time you mark a game as 'Claimed', we add its original price to your personal counter.",
      q2: "See your progress in dollars",
      a2: "Imagine you claim a $60 game today and a $20 game tomorrow. Your Vault will immediately show a savings of $80 USD. Seeing that number grow generates incredible satisfaction and helps you see the real value of the gifts that stores offer.",
      q3: "It's not just about the number",
      a3: "The Vault also serves to organize your library. Sometimes we claim so many free games that we forget what we have and in which store (Epic, Steam, GOG). By having them all in your GameFree Vault, you have a centralized inventory.",
      q4: "Upcoming features",
      a4: "We are working so you can share your total savings with your friends on social media. Who will be the one who has saved the most money in the community?",
      tip: "💡 Tip: Always log in before claiming so the system can link the savings to your profile permanently.",
      cta: "Go to my Vault →"
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

        <div className="bg-[#161b22] border border-emerald-500/30 rounded-xl p-5 my-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          <p className="text-emerald-300 text-sm font-medium">
            {t.tip}
          </p>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-[#30363d]">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5"
        >
          {t.cta}
        </Link>
      </div>
    </div>
  );
}
