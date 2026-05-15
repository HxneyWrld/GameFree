import { useState } from "react";
import { Gamepad2, Flame, Wallet, Menu, X, LogIn, LogOut, Languages } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const navLinks = [
  { key: "feed",      labelKey: "nav.free", icon: Gamepad2 },
  { key: "deals",     labelKey: "nav.deals", icon: Flame },
  { key: "library",   labelKey: "nav.vault", icon: Wallet },
];

export default function Navbar({ activeTab, onTabChange, onOpenAuth }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('es') ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };

  const handleNavClick = (key) => {
    onTabChange(key);
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      {/* Línea de brillo superior */}
      <div className="navbar-glow-line" />

      <div className="navbar-inner">
        {/* Logo */}
        <button className="navbar-logo" onClick={() => handleNavClick("feed")}>
          <div className="navbar-logo-icon">
            <Gamepad2 size={20} color="white" />
          </div>
          <span className="navbar-logo-text">
            <span className="navbar-logo-game">Game</span>
            <span className="navbar-logo-free">Free</span>
          </span>
        </button>

        {/* Nav desktop */}
        <div className="navbar-links">
          {navLinks.map(({ key, labelKey, icon: Icon }) => {
            if (!isLoggedIn && key === "library") return null;
            return (
              <button
                key={key}
                onClick={() => handleNavClick(key)}
                className={`navbar-link ${activeTab === key ? "navbar-link--active" : ""}`}
              >
                <Icon size={16} className="navbar-link-icon" />
                <span>{t(labelKey)}</span>
                <span className="navbar-link-underline" />
              </button>
            );
          })}
        </div>

        {/* Auth desktop */}
        <div className="navbar-auth">
          {/* Selector de Idioma */}
          <button className="navbar-btn-lang" onClick={toggleLanguage} title={i18n.language.startsWith('es') ? "Switch to English" : "Cambiar a Español"}>
            <Languages size={18} />
            <span>{i18n.language.startsWith('es') ? 'EN' : 'ES'}</span>
          </button>

          {isLoggedIn ? (
            <>
              <span className="navbar-username">
                {user?.email?.split("@")[0]}
              </span>
              <button className="navbar-btn-outline" onClick={logout}>
                <LogOut size={15} />
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <button className="navbar-btn-primary" onClick={onOpenAuth}>
              <span className="navbar-btn-shimmer" />
              <span className="navbar-btn-content">
                <LogIn size={16} />
                {t('nav.login')}
              </span>
            </button>
          )}
        </div>

        {/* Botón hamburguesa mobile */}
        <button
          className="navbar-hamburger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          <Menu
            size={20}
            className={`navbar-hamburger-icon ${isMenuOpen ? "navbar-hamburger-icon--hidden" : ""}`}
          />
          <X
            size={20}
            className={`navbar-hamburger-icon ${!isMenuOpen ? "navbar-hamburger-icon--hidden" : ""}`}
          />
        </button>
      </div>

      {/* Menú mobile */}
      <div className={`navbar-mobile-menu ${isMenuOpen ? "navbar-mobile-menu--open" : ""}`}>
        <div className="navbar-mobile-links">
          {navLinks.map(({ key, labelKey, icon: Icon }, index) => {
            if (!isLoggedIn && key === "library") return null;
            return (
              <button
                key={key}
                onClick={() => handleNavClick(key)}
                className={`navbar-mobile-link ${activeTab === key ? "navbar-mobile-link--active" : ""}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Icon size={18} className="navbar-link-icon" />
                <span>{t(labelKey)}</span>
              </button>
            );
          })}

          <div className="navbar-mobile-auth">
            <button className="navbar-mobile-link" onClick={toggleLanguage}>
              <Languages size={18} className="navbar-link-icon" />
              <span>{i18n.language.startsWith('es') ? 'Switch to English' : 'Cambiar a Español'}</span>
            </button>

            {isLoggedIn ? (
              <button
                className="navbar-btn-outline navbar-btn--full"
                onClick={() => { logout(); setIsMenuOpen(false); }}
              >
                <LogOut size={15} />
                {t('nav.logout')} ({user?.email?.split("@")[0]})
              </button>
            ) : (
              <button
                className="navbar-btn-primary navbar-btn--full"
                onClick={() => { onOpenAuth(); setIsMenuOpen(false); }}
              >
                <LogIn size={15} />
                {t('auth.login')} / {t('auth.register')}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
