import { Check } from "lucide-react";
import AdBanner from "./AdBanner";
import { useTranslation } from "react-i18next";

function CustomCheckbox({ checked, onChange, label, count }) {
  return (
    <label className="flex items-center gap-3 py-2 px-1 cursor-pointer group">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={(e) => {
          e.preventDefault();
          onChange();
        }}
        className={`
          relative flex items-center justify-center w-5 h-5 rounded-md border-2 transition-all duration-200
          ${checked 
            ? "bg-indigo-500 border-indigo-500" 
            : "bg-transparent border-[#3f3f46] group-hover:border-[#52525b]"
          }
        `}
      >
        <Check 
          className={`w-3.5 h-3.5 text-white transition-all duration-200 ${
            checked ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
          strokeWidth={3}
        />
      </button>
      <span className="flex-1 text-sm text-[#d4d4d8] group-hover:text-white transition-colors">
        {label}
      </span>
      {count !== undefined && (
        <span className="text-xs text-[#71717a] tabular-nums">{count}</span>
      )}
    </label>
  );
}

export default function FilterSidebar({ 
  storeOptions, 
  selectedStores, 
  onStoreToggle, 
  statusOptions,
  selectedStatus,
  onStatusToggle,
  onClearAll,
  sortBy,
  onSortChange,
  tab
}) {
  const { t, i18n } = useTranslation();
  const totalFilters = selectedStores.length + selectedStatus.length;

  return (
    <aside className="w-full bg-[#18181b] border border-[#27272a] rounded-xl flex flex-col sticky top-24">
      {/* Header */}
      <div className="p-4 border-b border-[#27272a]">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            {t('filters.title')}
          </h2>
          {totalFilters > 0 && (
            <button 
              onClick={onClearAll}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
            >
              {t('filters.clear')} ({totalFilters})
            </button>
          )}
        </div>
      </div>

      {/* Filters Content */}
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
        {/* Tiendas Section */}
        <section className="p-4 border-b border-[#27272a]/50">
          <h3 className="text-xs font-medium text-[#71717a] uppercase tracking-wider mb-3">
            {t('filters.stores')}
          </h3>
          <div className="space-y-0.5">
            {storeOptions.length === 0 && (
              <p className="text-xs text-[#52525b]">No hay tiendas disponibles</p>
            )}
            {storeOptions.map(option => (
              <CustomCheckbox
                key={option.id}
                checked={selectedStores.includes(option.id)}
                onChange={() => onStoreToggle(option.id)}
                label={option.label}
                count={option.count}
              />
            ))}
          </div>
        </section>

        {/* Estado Section */}
        <section className="p-4 border-b border-[#27272a]/50">
          <h3 className="text-xs font-medium text-[#71717a] uppercase tracking-wider mb-3">
            {t('filters.status')}
          </h3>
          <div className="space-y-0.5">
            {statusOptions.map(option => (
              <CustomCheckbox
                key={option.id}
                checked={selectedStatus.includes(option.id)}
                onChange={() => onStatusToggle(option.id)}
                label={option.label}
                count={option.count}
              />
            ))}
          </div>
        </section>

        {/* Ordenar Section */}
        <section className="p-4 border-b border-[#27272a]/50">
          <h3 className="text-xs font-medium text-[#71717a] uppercase tracking-wider mb-3">
            {i18n.language.startsWith('es') ? 'Ordenar por' : 'Sort by'}
          </h3>
          <select 
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full bg-[#27272a] text-sm text-white border border-[#3f3f46] rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="newest">{i18n.language.startsWith('es') ? "Agregados recientemente" : "Recently added"}</option>
            {tab === "deals" && (
              <>
                <option value="discount_desc">{i18n.language.startsWith('es') ? "Mayor descuento" : "Highest discount"}</option>
                <option value="price_asc">{i18n.language.startsWith('es') ? "Precio: Menor a mayor" : "Price: Low to high"}</option>
                <option value="price_desc">{i18n.language.startsWith('es') ? "Precio: Mayor a menor" : "Price: High to low"}</option>
              </>
            )}
            <option value="expiring_soon">{i18n.language.startsWith('es') ? "Expira más pronto" : "Expiring soon"}</option>
            <option value="expiring_late">{i18n.language.startsWith('es') ? "Expira más tarde" : "Expiring late"}</option>
          </select>
        </section>

        {/* NordVPN Sponsor Card */}
        <section className="p-4 border-b border-[#27272a]/50">
          <div className="bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] border border-indigo-500/30 rounded-xl p-4 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2">
              <span className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                {i18n.language.startsWith('es') ? 'Patrocinado' : 'Sponsored'}
              </span>
            </div>
            <h3 className="text-white font-bold text-sm mb-2 mt-4 pr-6">
              {i18n.language.startsWith('es') ? 'Protege tu conexión Gamer' : 'Protect your Gamer connection'}
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
          </div>
        </section>

        {/* NordPass Sponsor Card */}
        <section className="p-4 border-b border-[#27272a]/50">
          <div className="bg-gradient-to-br from-[#064e3b] to-[#022c22] border border-emerald-500/30 rounded-xl p-4 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2">
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                {i18n.language.startsWith('es') ? 'Patrocinado' : 'Sponsored'}
              </span>
            </div>
            <h3 className="text-white font-bold text-sm mb-2 mt-4 pr-6">
              {i18n.language.startsWith('es') ? 'Protege tus contraseñas' : 'Protect your passwords'}
            </h3>
            <p className="text-xs text-emerald-200 mb-4 leading-relaxed">
              {i18n.language.startsWith('es') 
                ? 'Guarda tus cuentas de Steam, Epic y GOG de forma 100% segura para evitar hackeos.' 
                : 'Save your Steam, Epic, and GOG accounts securely to prevent hacking.'}
            </p>
            <a 
              href="https://go.nordpass.io/aff_c?offer_id=488&aff_id=148041&url_id=9356" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-center bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-lg transition-colors"
            >
              {i18n.language.startsWith('es') ? 'Obtener NordPass' : 'Get NordPass'}
            </a>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#27272a] bg-[#18181b]">
        <p className="text-xs text-[#71717a] text-center">
          {totalFilters > 0 
            ? (i18n.language.startsWith('es') ? "Mostrando filtros activos" : "Showing active filters") 
            : (i18n.language.startsWith('es') ? "Mostrando todos los juegos" : "Showing all games")}
        </p>
      </div>

      {/* AdSense Unit */}
      <div className="px-4 pb-4">
        <AdBanner adSlot="6965792817" />
      </div>
    </aside>
  );
}
