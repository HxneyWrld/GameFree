import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { X } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export default function AuthModal({ onClose, initialMode = "login", resetToken = null }) {
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState(initialMode); // "login" | "register" | "recover" | "reset"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError(null);
    setSuccess(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if ((activeTab === "register" || activeTab === "reset") && password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    let endpoint;
    let bodyData;
    let headers = { "Content-Type": "application/json" };

    if (activeTab === "login") {
      endpoint = "/api/auth/login";
      bodyData = { email, password };
    } else if (activeTab === "register") {
      endpoint = "/api/auth/register";
      bodyData = { email, password };
    } else if (activeTab === "recover") {
      endpoint = "/api/auth/recover";
      bodyData = { email };
    } else if (activeTab === "reset") {
      endpoint = "/api/auth/reset-password";
      bodyData = { 
        password,
        access_token: resetToken?.access_token,
        refresh_token: resetToken?.refresh_token
      };
    }

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers,
        body: JSON.stringify(bodyData),
      });
      const json = await res.json();

      if (!json.success) {
        setError(json.message);
        return;
      }

      if (activeTab === "register") {
        setSuccess("¡Cuenta creada! Revisá tu email para confirmarla.");
      } else if (activeTab === "recover") {
        setSuccess(json.message);
      } else if (activeTab === "reset") {
        setSuccess("Contraseña actualizada correctamente. Ya podés iniciar sesión.");
        setTimeout(() => handleTabChange("login"), 2000);
      } else {
        // Login exitoso: guardamos sesión y cerramos el modal
        login(json.user, json.token);
        onClose();
      }
    } catch {
      setError("Error de conexión. ¿Está corriendo el servidor?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-[#18181b] border border-[#27272a] rounded-2xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#a1a1aa] hover:text-white hover:bg-[#27272a] transition-colors z-50"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Tabs */}
        {activeTab === "login" || activeTab === "register" ? (
          <div className="flex border-b border-[#27272a]">
            <button
              onClick={() => handleTabChange("login")}
              className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
                activeTab === "login"
                  ? "text-white"
                  : "text-[#a1a1aa] hover:text-[#d4d4d8]"
              }`}
            >
              Iniciar Sesión
              {activeTab === "login" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
              )}
            </button>
            <button
              onClick={() => handleTabChange("register")}
              className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
                activeTab === "register"
                  ? "text-white"
                  : "text-[#a1a1aa] hover:text-[#d4d4d8]"
              }`}
            >
              Registrarse
              {activeTab === "register" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
              )}
            </button>
          </div>
        ) : (
          <div className="flex border-b border-[#27272a]">
            <div className="flex-1 py-4 text-sm font-medium text-white text-center relative">
              {activeTab === "recover" ? "Recuperar Contraseña" : "Elegir Nueva Contraseña"}
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Mensajes */}
          {error && <p className="text-sm text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">{error}</p>}
          {success && <p className="text-sm text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-lg px-3 py-2">{success}</p>}

          {activeTab !== "reset" && (
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none text-[#d4d4d8]">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-[#3f3f46] bg-[#27272a] px-3 py-2 text-sm text-white placeholder:text-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#52525b] focus:border-transparent"
              />
            </div>
          )}

          {activeTab !== "recover" && (
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none text-[#d4d4d8]">
                {activeTab === "reset" ? "Nueva contraseña" : "Contraseña"}
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-[#3f3f46] bg-[#27272a] px-3 py-2 text-sm text-white placeholder:text-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#52525b] focus:border-transparent"
              />
            </div>
          )}

          {(activeTab === "register" || activeTab === "reset") && (
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium leading-none text-[#d4d4d8]">
                {activeTab === "reset" ? "Confirmar nueva contraseña" : "Confirmar contraseña"}
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-[#3f3f46] bg-[#27272a] px-3 py-2 text-sm text-white placeholder:text-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#52525b] focus:border-transparent"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full bg-white text-zinc-900 hover:bg-zinc-200 font-medium py-2.5 h-10"
          >
            {loading 
              ? "Cargando..." 
              : activeTab === "login" 
                ? "Iniciar Sesión" 
                : activeTab === "register" 
                  ? "Crear Cuenta" 
                  : activeTab === "reset"
                    ? "Guardar nueva contraseña"
                    : "Enviar instrucciones"}
          </button>

          {activeTab === "login" && (
            <p className="text-center text-sm text-[#71717a]">
              ¿Olvidaste tu contraseña?{" "}
              <button type="button" onClick={() => handleTabChange("recover")} className="text-white hover:underline">
                Recupérala aquí
              </button>
            </p>
          )}

          {activeTab === "recover" && (
            <p className="text-center text-sm text-[#71717a]">
              ¿Recordaste tu contraseña?{" "}
              <button type="button" onClick={() => handleTabChange("login")} className="text-white hover:underline">
                Iniciá sesión
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}