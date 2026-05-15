import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ConsejosSeguridad() {
  const { i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');

  const content = {
    es: {
      back: "← Volver al Blog",
      dateInfo: "12 de mayo, 2026 · 6 min de lectura",
      title: "Seguridad Online: Cómo evitar estafas de 'Juegos Gratis'",
      intro: "Internet está lleno de promesas de juegos gratis, pero no todas son legítimas. En este artículo te enseñamos a distinguir un regalo real de una trampa de phishing.",
      q1: "Desconfía de los sitios desconocidos",
      a1: "Si un sitio web que nunca has visto te pide que descargues un ejecutable (.exe) para obtener un juego de $60 gratis, ¡huye! Las tiendas legítimas (Epic, Steam, GOG) nunca te pedirán descargar archivos extraños fuera de sus propios clientes oficiales.",
      q2: "GameFree: Tu filtro de confianza",
      a2: "En GameFree solo indexamos tiendas oficiales y verificadas. Cuando ves un juego aquí, puedes estar seguro de que el enlace te llevará a la tienda oficial (como epicgames.com o store.steampowered.com). Nosotros hacemos el trabajo de verificación por ti.",
      q3: "El peligro del 'Cracked Content'",
      a3: "Mucha gente busca juegos gratis en sitios de piratería. Además de ser ilegal, estos archivos suelen contener malware, troyanos o mineros de criptomonedas que dañan tu PC. Es mucho mejor esperar a que el juego esté legalmente gratis o comprarlo con un 90% de descuento en nuestra sección de Ofertas.",
      q4: "Protege tu cuenta",
      a4: "Usa siempre la autenticación de dos factores (2FA) en tus cuentas de Steam y Epic. Así, incluso si alguien consigue tu contraseña, no podrá robar tus juegos.",
      tip: "💡 Consejo: Siempre verifica que el candado de seguridad aparezca en la barra de direcciones de tu navegador antes de iniciar sesión en cualquier tienda.",
      cta: "Explorar juegos verificados →"
    },
    en: {
      back: "← Back to Blog",
      dateInfo: "May 12, 2026 · 6 min read",
      title: "Online Safety: How to avoid 'Free Game' scams",
      intro: "The internet is full of promises of free games, but not all are legitimate. In this article we teach you to distinguish a real gift from a phishing trap.",
      q1: "Beware of unknown sites",
      a1: "If a website you've never seen asks you to download an executable (.exe) to get a $60 game for free, run! Legitimate stores (Epic, Steam, GOG) will never ask you to download strange files outside of their own official clients.",
      q2: "GameFree: Your trusted filter",
      a2: "At GameFree we only index official and verified stores. When you see a game here, you can be sure that the link will take you to the official store (like epicgames.com or store.steampowered.com). We do the verification work for you.",
      q3: "The danger of 'Cracked Content'",
      a3: "Many people look for free games on piracy sites. Besides being illegal, these files often contain malware, trojans, or cryptocurrency miners that damage your PC. It is much better to wait for the game to be legally free or buy it with a 90% discount in our Deals section.",
      q4: "Protect your account",
      a4: "Always use two-factor authentication (2FA) on your Steam and Epic accounts. This way, even if someone gets your password, they won't be able to steal your games.",
      tip: "💡 Tip: Always verify that the security padlock appears in your browser's address bar before logging into any store.",
      cta: "Explore verified games →"
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

        <div className="bg-[#161b22] border border-amber-500/30 rounded-xl p-5 my-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
          <p className="text-amber-300 text-sm font-medium">
            {t.tip}
          </p>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-[#30363d]">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5"
        >
          {t.cta}
        </Link>
      </div>
    </div>
  );
}
