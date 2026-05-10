import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export default function AuthModal({ onClose }) {
  const { login } = useAuth();
  const [mode,     setMode]     = useState("login"); // "login" | "register"
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(null);

  async function handleSubmit() {
    setError(null);
    setLoading(true);

    const endpoint = mode === "login"
      ? "/api/auth/login"
      : "/api/auth/register";

    try {
      const res  = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();

      if (!json.success) {
        setError(json.message);
        return;
      }

      if (mode === "register") {
        setSuccess("¡Cuenta creada! Revisá tu email para confirmarla.");
        return;
      }

      // Login exitoso: guardamos sesión y cerramos el modal
      login(json.user, json.token);
      onClose();
    } catch {
      setError("Error de conexión. ¿Está corriendo el servidor?");
    } finally {
      setLoading(false);
    }
  }

  return (
    // Fondo oscuro del modal
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
        onClick={(e) => e.stopPropagation()} // evita cerrar al clickear adentro
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        {/* Mensajes */}
        {error   && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}
        {success && <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2 mb-4">{success}</p>}

        {/* Campos */}
        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Botón principal */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
        >
          {loading ? "Cargando..." : mode === "login" ? "Entrar" : "Registrarme"}
        </button>

        {/* Cambiar modo */}
        <p className="text-center text-sm text-gray-500 mt-4">
          {mode === "login" ? "¿No tenés cuenta?" : "¿Ya tenés cuenta?"}{" "}
          <button
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(null); }}
            className="text-indigo-600 hover:underline font-medium"
          >
            {mode === "login" ? "Registrate" : "Iniciá sesión"}
          </button>
        </p>
      </div>
    </div>
  );
}