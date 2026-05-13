import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 min-h-screen" style={{ background: "#0d1117" }}>
      <div className="mb-8">
        <Link to="/" className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium flex items-center gap-2 w-fit">
          ← Volver al inicio
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-white mb-2">Política de Privacidad</h1>
      <p className="text-sm text-[#8b949e] mb-8">Última actualización: mayo 2026</p>

      <div className="space-y-8 text-[#d4d4d8] text-sm leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">¿Qué información recopilamos?</h2>
          <p>Cuando creas una cuenta en GameFree recopilamos tu dirección de correo electrónico. No recopilamos nombres, números de teléfono ni información de pago. Tu privacidad es nuestra prioridad.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">¿Cómo usamos tu información?</h2>
          <p>Usamos tu correo exclusivamente para enviarte notificaciones de nuevas ofertas de juegos (si decides activarlas) y correos transaccionales relacionados con tu cuenta (confirmación de registro, recuperación de contraseña).</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">Cookies y publicidad</h2>
          <p>GameFree utiliza Google AdSense para mostrar anuncios. Google puede usar cookies para mostrar anuncios relevantes basados en tus visitas anteriores a este y otros sitios. Puedes desactivar la publicidad personalizada en la <a href="https://www.google.com/settings/ads" className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors" target="_blank" rel="noreferrer">Configuración de Anuncios de Google</a>.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">Terceros</h2>
          <p>Los datos de las promociones de juegos son obtenidos de GamerPower. La autenticación y la base de datos son gestionadas de manera segura por Supabase. Ninguno de estos servicios recibe tu información personal de nuestra parte sin tu consentimiento explícito.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">Tus derechos</h2>
          <p>Tienes control total sobre tus datos. Puedes solicitar la eliminación definitiva de tu cuenta y de toda tu información en cualquier momento escribiendo a <a href="mailto:contacto@gamefree.store" className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors">contacto@gamefree.store</a>.</p>
        </section>
      </div>
    </div>
  );
}
