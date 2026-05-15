import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const posts = [
  {
    slug:    "mejores-juegos-gratis-mayo-2026",
    title:   "Los mejores juegos gratuitos de mayo 2026",
    date:    "13 de mayo, 2026",
    excerpt: "Este mes Epic, Steam y GOG regalaron títulos que normalmente cuestan entre $10 y $30. Te contamos cuáles fueron los más destacados.",
    minutes: 3,
  },
  {
    slug:    "como-no-perderte-ofertas-epic",
    title:   "Cómo no perderte nunca una oferta en Epic Games",
    date:    "10 de mayo, 2026",
    excerpt: "Epic Games regala al menos un juego cada semana, pero las ofertas duran solo 7 días. Te explicamos la mejor estrategia para no perder ninguna.",
    minutes: 4,
  },
];

export default function BlogIndex() {
  const { i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');

  const posts = [
    {
      slug:    "diferencia-deals-gratis",
      title:   isEn ? "Free Games vs. Mega Deals: Which to choose?" : "Juegos Gratis vs. Mega Ofertas: ¿Cuál elegir?",
      date:    isEn ? "May 15, 2026" : "15 de mayo, 2026",
      excerpt: isEn ? "We explain the difference between our two main sections and how to get the most out of each." : "Te explicamos la diferencia entre nuestras dos secciones principales y cómo sacar el máximo provecho a cada una.",
      minutes: 5,
    },
    {
      slug:    "ahorro-total-boveda",
      title:   isEn ? "The Savings Vault: How much money have you saved?" : "La Bóveda de Ahorros: ¿Cuánto dinero has ahorrado?",
      date:    isEn ? "May 14, 2026" : "14 de mayo, 2026",
      excerpt: isEn ? "Discover how our vault system works and why seeing your savings in USD is so satisfying." : "Descubre cómo funciona nuestro sistema de bóveda y por qué ver tus ahorros en USD es tan satisfactorio.",
      minutes: 4,
    },
    {
      slug:    "mejores-juegos-gratis-mayo-2026",
      title:   isEn ? "The best free games of May 2026" : "Los mejores juegos gratuitos de mayo 2026",
      date:    isEn ? "May 13, 2026" : "13 de mayo, 2026",
      excerpt: isEn ? "This month Epic, Steam, and GOG gave away titles that normally cost between $10 and $30. We tell you which were the most outstanding." : "Este mes Epic, Steam y GOG regalaron títulos que normalmente cuestan entre $10 y $30. Te contamos cuáles fueron los más destacados.",
      minutes: 3,
    },
    {
      slug:    "seguridad-evitar-estafas",
      title:   isEn ? "Online Safety: How to avoid 'Free Game' scams" : "Seguridad Online: Cómo evitar estafas de 'Juegos Gratis'",
      date:    isEn ? "May 12, 2026" : "12 de mayo, 2026",
      excerpt: isEn ? "Not all 'free' is legitimate. Learn to distinguish a real gift from a phishing trap." : "No todo lo 'gratis' es legítimo. Aprende a distinguir un regalo real de una trampa de phishing.",
      minutes: 6,
    },
    {
      slug:    "como-no-perderte-ofertas-epic",
      title:   isEn ? "How to never miss a deal on Epic Games" : "Cómo no perderte nunca una oferta en Epic Games",
      date:    isEn ? "May 10, 2026" : "10 de mayo, 2026",
      excerpt: isEn ? "Epic Games gives away at least one game every week, but the deals last only 7 days. We explain the best strategy to not miss any." : "Epic Games regala al menos un juego cada semana, pero las ofertas duran solo 7 días. Te explicamos la mejor estrategia para no perder ninguna.",
      minutes: 4,
    },
  ];

  const labels = {
    es: { back: "← Volver al inicio", title: "Blog", subtitle: "Guías, listas y consejos sobre juegos gratuitos.", read: "min de lectura" },
    en: { back: "← Back to home", title: "Blog", subtitle: "Guides, lists and tips about free games.", read: "min read" }
  };

  const t = isEn ? labels.en : labels.es;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 min-h-screen" style={{ background: "#0d1117" }}>
      <div className="mb-8">
        <Link to="/" className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium flex items-center gap-2 w-fit">
          {t.back}
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-white mb-2">{t.title}</h1>
      <p className="text-[#8b949e] text-sm mb-10">
        {t.subtitle}
      </p>

      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="group block bg-[#161b22] border border-[#30363d] rounded-xl p-6 hover:border-[#8b949e] transition-colors"
          >
            <p className="text-xs text-[#8b949e] mb-3">
              {post.date} · {post.minutes} {t.read}
            </p>
            <h2 className="text-xl font-semibold text-white group-hover:text-indigo-400 transition-colors mb-2">
              {post.title}
            </h2>
            <p className="text-sm text-[#d4d4d8] leading-relaxed">
              {post.excerpt}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
