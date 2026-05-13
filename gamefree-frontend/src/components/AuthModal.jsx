import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { X } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "El correo es obligatorio.";
  if (email.length > 255) return "El correo es demasiado largo.";
  if (!regex.test(email)) return "El formato del correo no es válido.";
  return null;
}

function validatePassword(password, mode) {
  if (!password) return "La contraseña es obligatoria.";
  if (password.length > 64) return "Máximo 64 caracteres.";
  if (mode === "register" || mode === "reset") {
    if (password.length < 8) return "Mínimo 8 caracteres.";
    if (!/(?=.*[a-z])/.test(password)) return "Debe tener al menos una minúscula.";
    if (!/(?=.*[A-Z])/.test(password)) return "Debe tener al menos una mayúscula.";
    if (!/(?=.*\d)/.test(password))    return "Debe tener al menos un número.";
  }
  return null;
}

export default function AuthModal({ onClose, initialMode = "login", resetToken = null }) {
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState(initialMode); // "login" | "register" | "recover" | "reset"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // States for errors, success and loading
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFieldErrors({});
    setError(null);
    setSuccess(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    resetForm();
  };

  function getPasswordStrength(pwd) {
    let score = 0;
    if (pwd.length >= 8)            score++;
    if (/[a-z]/.test(pwd))          score++;
    if (/[A-Z]/.test(pwd))          score++;
    if (/\d/.test(pwd))             score++;
    if (/[^a-zA-Z0-9]/.test(pwd))  score++;
    return score;
  }

  const strength = getPasswordStrength(password);
  const strengthLabel = ["", "Muy débil", "Débil", "Regular", "Fuerte", "Muy fuerte"][strength];
  const strengthColor = ["", "bg-rose-500", "bg-orange-500", "bg-yellow-500", "bg-emerald-500", "bg-emerald-400"][strength];

  function handleBlur(field) {
    const newErrors = { ...fieldErrors };
    if (field === "email" && activeTab !== "reset") {
      newErrors.email = validateEmail(email);
    }
    if (field === "password" && activeTab !== "recover") {
      newErrors.password = validatePassword(password, activeTab);
    }
    if (field === "confirmPassword" && (activeTab === "register" || activeTab === "reset")) {
      newErrors.confirmPassword = password !== confirmPassword ? "Las contraseñas no coinciden." : null;
    }
    setFieldErrors(newErrors);
  }

  function validateAll() {
    const newErrors = {};
    if (activeTab !== "reset") {
      newErrors.email = validateEmail(email);
    }
    if (activeTab !== "recover") {
      newErrors.password = validatePassword(password, activeTab);
    }
    if (activeTab === "register" || activeTab === "reset") {
      newErrors.confirmPassword = password !== confirmPassword ? "Las contraseñas no coinciden." : null;
    }
    setFieldErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!validateAll()) return;

    setLoading(true);

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
        setSuccess("¡Cuenta creada! Revisa tu email para confirmarla.");
      } else if (activeTab === "recover") {
        setSuccess(json.message);
      } else if (activeTab === "reset") {
        setSuccess("Contraseña actualizada correctamente. Ya puedes iniciar sesión.");
        setTimeout(() => handleTabChange("login"), 2000);
      } else {
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
              type="button"
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
              type="button"
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
          {/* Mensajes Globales */}
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
                onBlur={() => handleBlur("email")}
                className={`flex h-10 w-full rounded-md border bg-[#27272a] px-3 py-2 text-sm text-white placeholder:text-[#71717a] focus:outline-none focus:ring-2 transition-colors ${
                  fieldErrors.email ? "border-rose-500/50 focus:ring-rose-500/50" : "border-[#3f3f46] focus:ring-[#52525b] focus:border-transparent"
                }`}
              />
              {fieldErrors.email && (
                <p className="text-xs text-rose-500">{fieldErrors.email}</p>
              )}
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
                onBlur={() => handleBlur("password")}
                className={`flex h-10 w-full rounded-md border bg-[#27272a] px-3 py-2 text-sm text-white placeholder:text-[#71717a] focus:outline-none focus:ring-2 transition-colors ${
                  fieldErrors.password ? "border-rose-500/50 focus:ring-rose-500/50" : "border-[#3f3f46] focus:ring-[#52525b] focus:border-transparent"
                }`}
              />
              {fieldErrors.password && (
                <p className="text-xs text-rose-500">{fieldErrors.password}</p>
              )}
              
              {(activeTab === "register" || activeTab === "reset") && password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i <= strength ? strengthColor : "bg-[#3f3f46]"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-[#a1a1aa]">{strengthLabel}</p>
                </div>
              )}
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
                onBlur={() => handleBlur("confirmPassword")}
                className={`flex h-10 w-full rounded-md border bg-[#27272a] px-3 py-2 text-sm text-white placeholder:text-[#71717a] focus:outline-none focus:ring-2 transition-colors ${
                  fieldErrors.confirmPassword ? "border-rose-500/50 focus:ring-rose-500/50" : "border-[#3f3f46] focus:ring-[#52525b] focus:border-transparent"
                }`}
              />
              {fieldErrors.confirmPassword && (
                <p className="text-xs text-rose-500">{fieldErrors.confirmPassword}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full bg-white text-zinc-900 hover:bg-zinc-200 font-medium py-2.5 h-10 mt-2"
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
                Inicia sesión
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}