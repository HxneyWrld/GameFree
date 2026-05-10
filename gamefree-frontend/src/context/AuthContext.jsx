// AuthContext.jsx
// Provee el estado de sesión a toda la app sin prop drilling.
// Cualquier componente puede llamar useAuth() para saber
// si hay un usuario logueado y obtener su token.

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(null);
  const [token, setToken] = useState(null);

  // Al montar, revisamos si hay sesión guardada en localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("gf_token");
    const savedUser  = localStorage.getItem("gf_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem("gf_token", accessToken);
    localStorage.setItem("gf_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("gf_token");
    localStorage.removeItem("gf_user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado: import { useAuth } from "../context/AuthContext"
export function useAuth() {
  return useContext(AuthContext);
}
