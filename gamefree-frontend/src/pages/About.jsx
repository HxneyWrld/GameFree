import { Link } from "react-router-dom";
import { Gamepad2 } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 min-h-screen" style={{ background: "#0d1117" }}>
      <div className="mb-8">
        <Link to="/" className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium flex items-center gap-2 w-fit">
          ← Volver al inicio
        </Link>
      </div>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-2xl" style={{ background: 'linear-gradient(135deg, var(--neon-purple), var(--neon-green))' }}>
          <Gamepad2 size={24} color="white" />
        </div>
        <h1 className="text-3xl font-bold text-white">Acerca de GameFree</h1>
      </div>

      <div className="space-y-6 text-[#d4d4d8] text-sm leading-relaxed">
        <p>
          <strong className="text-white">GameFree</strong> nació de una frustración simple: perder promociones de juegos por no revisar todas las tiendas a diario. Epic Games, Steam, GOG, itch.io y decenas de plataformas más regalan juegos constantemente, pero monitorearlas todas es imposible.
        </p>

        <p>
          GameFree resuelve eso. Un sistema automatizado revisa todas las tiendas y consolida en un solo lugar todos los juegos que están al 100% de descuento en este preciso momento. Sin suscripciones, sin cuentas de pago, sin spam.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-10">
          {[
            { number: "10+", label: "Tiendas monitoreadas" },
            { number: "24/7", label: "Actualización en vivo" },
            { number: "$0", label: "Costo para el usuario" },
          ].map(({ number, label }) => (
            <div key={label} className="text-center bg-[#161b22] border border-[#30363d] rounded-xl p-6 transition-transform hover:-translate-y-1">
              <p className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">{number}</p>
              <p className="text-xs text-[#8b949e] font-medium uppercase tracking-wider mt-2">{label}</p>
            </div>
          ))}
        </div>

        <p>
          El proyecto está enfocado en brindar la mejor experiencia de usuario posible, gamificando el ahorro y permitiendo a los jugadores llevar un registro de todo el dinero que han dejado de gastar en entretenimiento.
        </p>

        <p className="pt-4 border-t border-[#30363d]">
          Si tienes sugerencias, encontraste un bug o simplemente quieres saludar, escríbenos a{" "}
          <a href="mailto:contacto@gamefree.store" className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors font-medium">
            contacto@gamefree.store
          </a>.
        </p>
      </div>
    </div>
  );
}
