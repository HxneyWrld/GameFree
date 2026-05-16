import { Check } from "lucide-react";
import AdBanner from "./AdBanner";
import SponsorCards from "./SponsorCards";
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
      <div className="flex-1">
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

        {/* Sponsor Cards integradas */}
        <div className="p-4 border-b border-[#27272a]/50">
          <SponsorCards />
        </div>
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
