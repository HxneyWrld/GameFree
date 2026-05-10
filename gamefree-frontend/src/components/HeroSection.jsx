// HeroSection.jsx — Banner principal oscuro con headline
export default function HeroSection({ gameCount }) {
  return (
    <section className="bg-gradient-to-b from-[#0d1117] to-[#161b22] border-b border-[#30363d] py-12 px-4 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-3">
          Tu <span className="font-extrabold">panel centralizado</span> para videojuegos de pago
          <br />
          <span className="text-amber-400 font-extrabold">GRATIS</span>{" "}
          <span className="text-white">por tiempo limitado</span>
        </h1>
        <p className="text-[#8b949e] text-sm sm:text-base mt-3">
          Consolidando ofertas de Epic Games Store, Steam, GOG, Prime Gaming y más
        </p>
        {gameCount > 0 && (
          <div className="mt-5 inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium px-4 py-2 rounded-full">
            🎁 {gameCount} {gameCount === 1 ? "juego disponible" : "juegos disponibles"} hoy
          </div>
        )}
      </div>
    </section>
  );
}
