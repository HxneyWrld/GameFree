import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function SponsorCards({ className = "" }) {
  const { i18n } = useTranslation();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* NordVPN Sponsor Card */}
      <section className="border border-[#27272a]/50 bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] rounded-xl p-4 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 z-10">
          <span className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
            {i18n.language.startsWith('es') ? 'Patrocinado' : 'Sponsored'}
          </span>
        </div>
        
        {/* Logo/Image area */}
        <div className="mb-3 flex items-center justify-between">
          <img 
            src="https://s1.nordcdn.com/nordvpn/media/1.229.0/images/global/logos/logo-horizontal-white.svg" 
            alt="NordVPN" 
            className="h-6 w-auto"
          />
        </div>

        <h3 className="text-white font-bold text-sm mb-2 pr-6">
          {i18n.language.startsWith('es') ? 'Juega sin restricciones ni lag' : 'Play without restrictions or lag'}
        </h3>
        <ul className="text-xs text-indigo-200 space-y-1.5 mb-4">
          <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-indigo-400" /> {i18n.language.startsWith('es') ? 'Mejores precios por región' : 'Better regional pricing'}</li>
          <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-indigo-400" /> {i18n.language.startsWith('es') ? 'Menos lag en partidas' : 'Less lag in games'}</li>
          <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-indigo-400" /> {i18n.language.startsWith('es') ? 'Acceso a juegos restringidos' : 'Access restricted games'}</li>
        </ul>
        <a 
          href="https://go.nordvpn.net/aff_c?offer_id=15&aff_id=148041&url_id=902" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block text-center bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 rounded-lg transition-colors"
        >
          {i18n.language.startsWith('es') ? 'Obtener NordVPN' : 'Get NordVPN'}
        </a>
      </section>

      {/* NordPass Sponsor Card */}
      <section className="border border-[#27272a]/50 bg-gradient-to-br from-[#064e3b] to-[#022c22] rounded-xl p-4 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 z-10">
          <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
            {i18n.language.startsWith('es') ? 'Patrocinado' : 'Sponsored'}
          </span>
        </div>
        
        {/* Logo/Image area */}
        <div className="mb-3 flex items-center justify-between">
          <img 
            src="https://s1.nordcdn.com/nordpass/media/1.127.0/images/global/logos/nordpass-logo-white.svg" 
            alt="NordPass" 
            className="h-6 w-auto"
          />
        </div>

        <h3 className="text-white font-bold text-sm mb-2 pr-6">
          {i18n.language.startsWith('es') ? 'Protege tus cuentas de juegos' : 'Protect your game accounts'}
        </h3>
        <p className="text-xs text-emerald-200 mb-4 leading-relaxed">
          {i18n.language.startsWith('es') 
            ? 'Guarda tus contraseñas de Steam, Epic y GOG de forma 100% segura para evitar hackeos.' 
            : 'Save your Steam, Epic, and GOG passwords securely to prevent hacking.'}
        </p>
        <a 
          href="https://go.nordpass.io/aff_c?offer_id=488&aff_id=148041&url_id=9356" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block text-center bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-lg transition-colors"
        >
          {i18n.language.startsWith('es') ? 'Obtener NordPass' : 'Get NordPass'}
        </a>
      </section>
    </div>
  );
}
