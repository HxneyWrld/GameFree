import { Link } from "react-router-dom";

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
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 min-h-screen" style={{ background: "#0d1117" }}>
      <div className="mb-8">
        <Link to="/" className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium flex items-center gap-2 w-fit">
          ← Volver al inicio
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-white mb-2">Blog</h1>
      <p className="text-[#8b949e] text-sm mb-10">
        Guías, listas y consejos sobre juegos gratuitos.
      </p>

      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="group block bg-[#161b22] border border-[#30363d] rounded-xl p-6 hover:border-[#8b949e] transition-colors"
          >
            <p className="text-xs text-[#8b949e] mb-3">
              {post.date} · {post.minutes} min de lectura
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
