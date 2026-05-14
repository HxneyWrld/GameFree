import { Link } from "react-router-dom";
import { Gamepad2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function About() {
  const { i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');

  const content = {
    es: {
      back: "← Volver al inicio",
      title: "Acerca de GameFree",
      p1: "GameFree nació de una frustración simple: perder promociones de juegos por no revisar todas las tiendas a diario. Epic Games, Steam, GOG, itch.io y decenas de plataformas más regalan juegos constantemente, pero monitorearlas todas es imposible.",
      p2: "GameFree resuelve eso. Un sistema automatizado revisa todas las tiendas y consolida en un solo lugar todos los juegos que están al 100% de descuento en este preciso momento. Sin suscripciones, sin cuentas de pago, sin spam.",
      p3: "El proyecto está enfocado en brindar la mejor experiencia de usuario posible, gamificando el ahorro y permitiendo a los jugadores llevar un registro de todo el dinero que han dejado de gastar en entretenimiento.",
      p4: "Si tienes sugerencias, encontraste un bug o simplemente quieres saludar, escríbenos a",
      stats: [
        { number: "10+", label: "Tiendas monitoreadas" },
        { number: "24/7", label: "Actualización en vivo" },
        { number: "$0", label: "Costo para el usuario" },
      ]
    },
    en: {
      back: "← Back to home",
      title: "About GameFree",
      p1: "GameFree was born from a simple frustration: missing game promotions by not checking every store daily. Epic Games, Steam, GOG, itch.io, and dozens more platforms give away games constantly, but monitoring them all is impossible.",
      p2: "GameFree solves that. An automated system checks all stores and consolidates all games currently at 100% discount in one single place. No subscriptions, no paid accounts, no spam.",
      p3: "The project is focused on providing the best possible user experience, gamifying savings, and allowing players to keep track of all the money they've stopped spending on entertainment.",
      p4: "If you have suggestions, found a bug, or just want to say hi, write to us at",
      stats: [
        { number: "10+", label: "Monitored stores" },
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
