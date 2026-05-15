import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Tag, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function DealDetail() {
  const { id } = useParams();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    async function fetchDeal() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/deals/${id}`);
        const result = await res.json();
        if (result.success) {
          setDeal(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Error al cargar los detalles de la oferta.");
      } finally {
        setLoading(false);
      }
    }
    fetchDeal();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-screen text-center px-4">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Oferta no encontrada</h2>
        <p className="text-gray-400 mb-6">{error || "No se pudo cargar la oferta."}</p>
        <Link to="/" className="px-6 py-3 bg-[#1f2937] text-white rounded-xl hover:bg-[#374151] transition-colors font-semibold">
          {t('nav.feed')}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen pb-12">
      {/* HEADER / BANNER */}
      <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
        {/* Blurred background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-xl opacity-30 scale-110"
          style={{ backgroundImage: `url(${deal.thumbnail_url})` }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/80 to-transparent" />
        
        {/* Content Container */}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 flex flex-col md:flex-row gap-6 items-end">
            {/* Thumbnail */}
            <img 
              src={deal.thumbnail_url} 
              alt={deal.title} 
              className="w-48 md:w-64 rounded-xl shadow-2xl border border-white/10 z-10 hidden sm:block"
            />
            
            <div className="flex-1 z-10 w-full">
              <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4 bg-black/40 px-3 py-1.5 rounded-full text-sm backdrop-blur-md">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('game.back')}
              </Link>
              
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-white/10 text-white rounded-full text-xs font-semibold backdrop-blur-md border border-white/5">
                  {deal.store_name}
                </span>
                {deal.original_price > 0 && (
                  <span className="text-gray-400 line-through text-sm font-medium">
                    ${deal.original_price.toFixed(2)}
                  </span>
                )}
                <span className="px-3 py-1 bg-rose-600/20 text-rose-400 rounded-full text-xs font-black border border-rose-500/30">
                  -{deal.discount_pct}%
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                {deal.title}
              </h1>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <a 
                  href={deal.claim_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex justify-center items-center px-8 py-3.5 bg-rose-600 text-white rounded-xl hover:bg-rose-500 transition-colors font-bold text-lg shadow-lg shadow-rose-900/50"
                >
                  <Tag className="w-5 h-5 mr-2" />
                  Ver Oferta a ${deal.sale_price.toFixed(2)}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILS CONTENT */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-[#161b22] p-6 sm:p-8 rounded-2xl border border-white/5 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-rose-500" />
              Acerca de esta oferta
            </h2>
            <div className="text-gray-300 leading-relaxed bg-[#0d1117] p-5 rounded-xl border border-white/5">
              <p>Esta es una oferta destacada encontrada en <strong>{deal.store_name}</strong>. El juego tiene un descuento masivo del <strong>{deal.discount_pct}%</strong>.</p>
              <p className="mt-4">Precio original: ${deal.original_price.toFixed(2)}</p>
              <p>Precio actual: <strong>${deal.sale_price.toFixed(2)}</strong></p>
              <p className="mt-4 text-sm text-gray-500">Haz clic en el botón superior para ir directamente a la tienda y aprovechar el descuento antes de que termine.</p>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#161b22] p-6 rounded-2xl border border-white/5 shadow-xl">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">{t('game.details')}</h3>
            
            <div className="space-y-4">
              <div>
                <span className="block text-xs text-gray-500 mb-1">{t('game.platform')}</span>
                <span className="font-medium text-white">{deal.store_name}</span>
              </div>
              
              <div>
                <span className="block text-xs text-gray-500 mb-1">{t('game.price')}</span>
                <span className="font-medium text-white line-through text-gray-500 mr-2">
                  ${deal.original_price.toFixed(2)}
                </span>
                <span className="font-black text-rose-400 text-xl">
                  ${deal.sale_price.toFixed(2)}
                </span>
              </div>
              
              {deal.metacritic && (
                <div>
                  <span className="block text-xs text-gray-500 mb-1">Metacritic Score</span>
                  <span className="px-2 py-1 bg-[#21262d] text-emerald-400 rounded-md border border-[#30363d] font-bold">
                    {deal.metacritic}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <a 
            href={deal.claim_url} 
            target="_blank" 
            rel="noreferrer"
            className="w-full flex items-center justify-center p-4 bg-[#1f2937] hover:bg-[#374151] rounded-xl text-white font-medium transition-colors border border-white/5"
          >
            {t('game.official')}
            <ExternalLink className="w-4 h-4 ml-2 text-gray-400" />
          </a>
        </div>

      </div>
    </div>
  );
}
