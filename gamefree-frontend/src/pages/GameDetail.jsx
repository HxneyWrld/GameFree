import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, ExternalLink, Gamepad2, Info, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function GameDetail() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation();

  // Expiration countdown logic
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    async function fetchGame() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/games/${id}`);
        const result = await res.json();
        if (result.success) {
          setGame(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Error al cargar los detalles del juego.");
      } finally {
        setLoading(false);
      }
    }
    fetchGame();
  }, [id]);

  useEffect(() => {
    if (!game || !game.expiration_date) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const expiration = new Date(game.expiration_date);
      const diff = expiration - now;

      if (diff <= 0) {
        setTimeLeft(t('game.expired'));
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);

      const timeStr = `${days > 0 ? `${days}d ` : ""}${hours}h ${minutes}m`;
      setTimeLeft(i18n.language.startsWith('es') ? `${timeStr} restantes` : `${timeStr} remaining`);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // update every minute
    return () => clearInterval(interval);
  }, [game]);

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-screen text-center px-4">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">{t('game.expired')}</h2>
        <p className="text-gray-400 mb-6">{error || t('game.expired')}</p>
        <Link to="/" className="px-6 py-3 bg-[#1f2937] text-white rounded-xl hover:bg-[#374151] transition-colors font-semibold">
          {t('nav.feed')}
        </Link>
      </div>
    );
  }

  // Choose the right language for description and instructions
  const isEn = i18n.language.startsWith('en');
  const description = isEn ? (game.description_en || game.description_es) : (game.description_es || game.description_en);
  const instructions = isEn ? (game.instructions_en || game.instructions_es) : (game.instructions_es || game.instructions_en);

  // Parse HTML tags out of description/instructions if GamerPower sends raw HTML
  // (Usually they send plain text with basic line breaks, but just in case)
  const formatText = (text) => {
    if (!text) return "No hay información disponible.";
    return text.split('\n').map((line, i) => (
      <p key={i} className="mb-2">{line}</p>
    ));
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen pb-12">
      {/* HEADER / BANNER */}
      <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
        {/* Blurred background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-xl opacity-30 scale-110"
          style={{ backgroundImage: `url(${game.thumbnail_url})` }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/80 to-transparent" />
        
        {/* Content Container */}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 flex flex-col md:flex-row gap-6 items-end">
            {/* Thumbnail */}
            <img 
              src={game.thumbnail_url} 
              alt={game.title} 
              className="w-48 md:w-64 rounded-xl shadow-2xl border border-white/10 z-10 hidden sm:block"
            />
            
            <div className="flex-1 z-10 w-full">
              <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4 bg-black/40 px-3 py-1.5 rounded-full text-sm backdrop-blur-md">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('game.back')}
              </Link>
              
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-white/10 text-white rounded-full text-xs font-semibold backdrop-blur-md border border-white/5">
                  {game.store_name}
                </span>
                {game.original_price > 0 && (
                  <span className="text-gray-400 line-through text-sm font-medium">
                    ${game.original_price}
                  </span>
                )}
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/30">
                  {t('game.free')}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                {game.title}
              </h1>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <a 
                  href={game.claim_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex justify-center items-center px-8 py-3.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-colors font-bold text-lg shadow-lg shadow-emerald-900/50"
                >
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  {t('game.claim')}
                </a>
                
                {game.expiration_date && (
                  <div className="inline-flex justify-center items-center px-6 py-3.5 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20 font-medium">
                    <Clock className="w-5 h-5 mr-2" />
                    {timeLeft}
                  </div>
                )}
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
              <Info className="w-5 h-5 mr-2 text-emerald-500" />
              {t('game.about')}
            </h2>
            <div className="text-gray-300 leading-relaxed space-y-4">
              {formatText(description)}
            </div>
          </section>

          <section className="bg-[#161b22] p-6 sm:p-8 rounded-2xl border border-white/5 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-emerald-500" />
              {t('game.instructions')}
            </h2>
            <div className="text-gray-300 leading-relaxed bg-[#0d1117] p-5 rounded-xl border border-white/5">
              {formatText(instructions)}
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
                <span className="font-medium text-white">{game.store_name}</span>
              </div>
              
              <div>
                <span className="block text-xs text-gray-500 mb-1">{t('game.price')}</span>
                <span className="font-medium text-white">
                  {game.original_price > 0 ? `$${game.original_price}` : "Free to Play"}
                </span>
              </div>
              
              {game.expiration_date && (
                <div>
                  <span className="block text-xs text-gray-500 mb-1">{t('game.expires')}</span>
                  <span className="font-medium text-rose-400">
                    {new Date(game.expiration_date).toLocaleString(i18n.language.startsWith('es') ? 'es-ES' : 'en-US', { 
                      dateStyle: 'long', 
                      timeStyle: 'short' 
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <a 
            href={game.claim_url} 
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
