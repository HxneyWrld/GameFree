import { Gamepad2, Flame, Zap } from "lucide-react";

export default function HeroSection({ onExplore }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0d1117]">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139, 92, 246, 0.12) 0%, transparent 50%)",
        }}
      />

      {/* Floating gaming icons - decorative */}
      <div className="absolute top-24 left-[5%] md:left-[15%] animate-pulse opacity-10 md:opacity-20">
        <Gamepad2 className="h-12 w-12 md:h-16 md:w-16 text-indigo-500" />
      </div>
      <div
        className="absolute bottom-40 right-[10%] md:right-[20%] animate-pulse opacity-10 md:opacity-20"
        style={{ animationDelay: "1s" }}
      >
        <Flame className="h-10 w-10 md:h-12 md:w-12 text-indigo-500" />
      </div>
      <div
        className="absolute top-1/3 right-[5%] md:right-[10%] animate-pulse opacity-10 md:opacity-20"
        style={{ animationDelay: "0.5s" }}
      >
        <Zap className="h-8 w-8 md:h-10 md:w-10 text-indigo-500" />
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 text-center mt-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-400 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
          </span>
          Ofertas actualizadas en tiempo real
        </div>

        {/* Main title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6">
          <span className="block text-balance">No pagues</span>
          <span className="block text-indigo-500">por jugar.</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-400 mb-10 leading-relaxed text-pretty">
          Rastreamos juegos al{" "}
          <span className="text-indigo-400 font-semibold">100% de descuento</span>{" "}
          en Steam, Epic Games y GOG. Encuentra los mejores títulos gratis antes
          de que se agoten.
        </p>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onExplore}
            className="group relative overflow-hidden bg-indigo-600 text-white hover:bg-indigo-500 text-lg px-8 py-4 rounded-xl font-semibold shadow-lg shadow-indigo-600/25 transition-all hover:shadow-xl hover:shadow-indigo-600/40 hover:scale-105 cursor-pointer"
          >
            <span className="relative z-10 flex items-center gap-2">
              Ver ofertas de hoy
              <svg
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </button>
        </div>

        {/* Platform logos */}
        <div className="mt-16 flex flex-col items-center gap-4">
          <span className="text-sm text-gray-500 uppercase tracking-widest font-semibold">
            Monitoreamos
          </span>
          <div className="flex items-center gap-8">
            {/* Steam */}
            <div className="flex items-center gap-2 text-gray-600 hover:text-white transition-colors">
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z" />
              </svg>
              <span className="text-sm font-medium">Steam</span>
            </div>

            {/* Epic Games */}
            <div className="flex items-center gap-2 text-gray-600 hover:text-white transition-colors">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.537 0C2.165 0 1.66.506 1.66 1.879V18.44a4.262 4.262 0 00.04.656c.086.467.271.91.687 1.173.434.27.96.39 1.66.39h.138c.696 0 1.223-.12 1.657-.39.416-.263.601-.706.687-1.173.035-.236.04-.453.04-.656V1.88c0-1.374-.505-1.88-1.877-1.88H3.537zm9.839 0c-1.372 0-1.878.506-1.878 1.879v16.56c0 1.374.506 1.88 1.878 1.88h1.378c1.373 0 1.878-.506 1.878-1.88V1.88c0-1.374-.505-1.88-1.878-1.88h-1.378zm6.309 0c-1.372 0-1.878.506-1.878 1.879v4.378c0 .395.033.717.116.976.147.453.443.747.916.933.25.098.517.157.831.186a9.92 9.92 0 001.055.035H24V6.32h-2.27c-.552 0-.875-.323-.875-.875V1.88c0-1.374-.506-1.88-1.878-1.88h-1.17zM3.537 17.715c-1.371 0-1.877.506-1.877 1.879v2.527c0 1.373.506 1.879 1.877 1.879h1.378c1.372 0 1.877-.506 1.877-1.88v-2.526c0-1.373-.505-1.879-1.877-1.879H3.537zm9.839 0c-1.371 0-1.878.506-1.878 1.879v2.527c0 1.373.507 1.879 1.878 1.879h1.378c1.373 0 1.878-.506 1.878-1.88v-2.526c0-1.373-.505-1.879-1.878-1.879h-1.378z" />
              </svg>
              <span className="text-sm font-medium">Epic</span>
            </div>

            {/* GOG */}
            <div className="flex items-center gap-2 text-gray-600 hover:text-white transition-colors">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.182c5.423 0 9.818 4.395 9.818 9.818S17.423 21.818 12 21.818 2.182 17.423 2.182 12 6.577 2.182 12 2.182zm0 1.963A7.855 7.855 0 004.145 12 7.855 7.855 0 0012 19.855 7.855 7.855 0 0019.855 12 7.855 7.855 0 0012 4.145zm0 1.964A5.891 5.891 0 0117.891 12 5.891 5.891 0 0112 17.891 5.891 5.891 0 016.109 12 5.891 5.891 0 0112 6.109zm0 1.963A3.928 3.928 0 008.072 12 3.928 3.928 0 0012 15.928 3.928 3.928 0 0015.928 12 3.928 3.928 0 0012 8.072z" />
              </svg>
              <span className="text-sm font-medium">GOG</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0d1117] to-transparent" />
    </section>
  );
}
