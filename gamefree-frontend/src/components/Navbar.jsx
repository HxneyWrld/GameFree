import { useState } from "react";
import { Gamepad2, Flame, Library, Heart, Menu, X, LogIn, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { key: "feed",      label: "Feed de Ofertas", icon: Flame },
  { key: "library",   label: "Mi Biblioteca",   icon: Library },
  { key: "favorites", label: "Favoritos",        icon: Heart },
];

export default function Navbar({ activeTab, onTabChange, onOpenAuth }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();

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
          {navLinks.map(({ key, label, icon: Icon }) => {
            if (!isLoggedIn && key !== "feed") return null;
            return (
              <button
                key={key}
                onClick={() => handleNavClick(key)}
                className={`navbar-link ${activeTab === key ? "navbar-link--active" : ""}`}
              >
                <Icon size={16} className="navbar-link-icon" />
                <span>{label}</span>
                <span className="navbar-link-underline" />
              </button>
            );
          })}
        </div>

        {/* Auth desktop */}
        <div className="navbar-auth">
          {isLoggedIn ? (
            <>
              <span className="navbar-username">
                {user?.email?.split("@")[0]}
              </span>
              <button className="navbar-btn-outline" onClick={logout}>
                <LogOut size={15} />
                Salir
              </button>
            </>
          ) : (
            <button className="navbar-btn-primary" onClick={onOpenAuth}>
              <span className="navbar-btn-shimmer" />
              <span className="navbar-btn-content">
                <LogIn size={16} />
                Iniciar Sesión
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
          {navLinks.map(({ key, label, icon: Icon }, index) => {
            if (!isLoggedIn && key !== "feed") return null;
            return (
              <button
                key={key}
                onClick={() => handleNavClick(key)}
                className={`navbar-mobile-link ${activeTab === key ? "navbar-mobile-link--active" : ""}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Icon size={18} className="navbar-link-icon" />
                <span>{label}</span>
              </button>
            );
          })}

          <div className="navbar-mobile-auth">
            {isLoggedIn ? (
              <button
                className="navbar-btn-outline navbar-btn--full"
                onClick={() => { logout(); setIsMenuOpen(false); }}
              >
                <LogOut size={15} />
                Salir ({user?.email?.split("@")[0]})
              </button>
            ) : (
              <button
                className="navbar-btn-primary navbar-btn--full"
                onClick={() => { onOpenAuth(); setIsMenuOpen(false); }}
              >
                <LogIn size={15} />
                Iniciar Sesión / Registrarse
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
