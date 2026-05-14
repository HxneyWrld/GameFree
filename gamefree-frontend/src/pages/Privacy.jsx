import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Privacy() {
  const { i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');

  const content = {
    es: {
      back: "← Volver al inicio",
      title: "Política de Privacidad",
      update: "Última actualización: mayo 2026",
      q1: "¿Qué información recopilamos?",
      a1: "Cuando creas una cuenta en GameFree recopilamos tu dirección de correo electrónico. No recopilamos nombres, números de teléfono ni información de pago. Tu privacidad es nuestra prioridad.",
      q2: "¿Cómo usamos tu información?",
      a2: "Usamos tu correo exclusivamente para enviarte notificaciones de nuevas ofertas de juegos (si decides activarlas) y correos transaccionales relacionados con tu cuenta (confirmación de registro, recuperación de contraseña).",
      q3: "Cookies y publicidad",
      a3: "GameFree utiliza Google AdSense para mostrar anuncios. Google puede usar cookies para mostrar anuncios relevantes basados en tus visitas anteriores a este y otros sitios.",
      q4: "Terceros",
      a4: "Los datos de las promociones de juegos son obtenidos de GamerPower. La autenticación y la base de datos son gestionadas de manera segura por Supabase. Ninguno de estos servicios recibe tu información personal de nuestra parte sin tu consentimiento explícito.",
      q5: "Tus derechos",
      a5: "Tienes control total sobre tus datos. Puedes solicitar la eliminación definitiva de tu cuenta y de toda tu información en cualquier momento escribiendo a"
    },
    en: {
      back: "← Back to home",
      title: "Privacy Policy",
      update: "Last updated: May 2026",
      q1: "What information do we collect?",
      a1: "When you create an account on GameFree, we collect your email address. We do not collect names, phone numbers, or payment information. Your privacy is our priority.",
      q2: "How do we use your information?",
      a2: "We use your email exclusively to send you notifications of new game deals (if you choose to enable them) and transactional emails related to your account (registration confirmation, password recovery).",
      q3: "Cookies and advertising",
      a3: "GameFree uses Google AdSense to display ads. Google may use cookies to serve relevant ads based on your previous visits to this and other sites.",
      q4: "Third parties",
      a4: "Game deal data is obtained from GamerPower. Authentication and database management are securely handled by Supabase. None of these services receive your personal information from us without your explicit consent.",
      q5: "Your rights",
      a5: "You have full control over your data. You can request the permanent deletion of your account and all your information at any time by writing to"
    }
  };

  const t = isEn ? content.en : content.es;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 min-h-screen" style={{ background: "#0d1117" }}>
      <div className="mb-8">
        <Link to="/" className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium flex items-center gap-2 w-fit">
          {t.back}
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-white mb-2">{t.title}</h1>
      <p className="text-sm text-[#8b949e] mb-8">{t.update}</p>

      <div className="space-y-8 text-[#d4d4d8] text-sm leading-relaxed">
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

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">{t.q5}</h2>
          <p>{t.a5}{" "}
            <a href="mailto:contacto@gamefree.store" className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors">
              contacto@gamefree.store
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
