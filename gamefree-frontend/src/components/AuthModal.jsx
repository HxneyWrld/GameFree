import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { X, Mail, Lock, Gamepad2, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { supabase } from "../supabaseClient";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

function validateEmail(email, t) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return t('auth.errors.emailRequired');
  if (email.length > 255) return t('auth.errors.emailLong');
  if (!regex.test(email)) return t('auth.errors.emailInvalid');
  return null;
}

function validatePassword(password, mode, t) {
  if (!password) return t('auth.errors.passwordRequired');
  if (password.length > 64) return t('auth.errors.passwordLong');
  if (mode === "register" || mode === "reset") {
    if (password.length < 8) return t('auth.errors.passwordShort');
    if (!/(?=.*[a-z])/.test(password)) return t('auth.errors.passwordLower');
    if (!/(?=.*[A-Z])/.test(password)) return t('auth.errors.passwordUpper');
    if (!/(?=.*\d)/.test(password))    return t('auth.errors.passwordNumber');
  }
  return null;
}

export default function AuthModal({ onClose, initialMode = "login", resetToken = null }) {
  const { login } = useAuth();
  const { t, i18n } = useTranslation();
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
  const strengthLabel = [
    "", 
    i18n.language.startsWith('es') ? "Muy débil" : "Very weak", 
    i18n.language.startsWith('es') ? "Débil" : "Weak", 
    i18n.language.startsWith('es') ? "Regular" : "Fair", 
    i18n.language.startsWith('es') ? "Fuerte" : "Strong", 
    i18n.language.startsWith('es') ? "Muy fuerte" : "Very strong"
  ][strength];
  const strengthColor = ["", "bg-rose-500", "bg-orange-500", "bg-yellow-500", "bg-emerald-500", "bg-emerald-400"][strength];

  function handleBlur(field) {
    const newErrors = { ...fieldErrors };
    if (field === "email" && activeTab !== "reset") {
      newErrors.email = validateEmail(email, t);
    }
    if (field === "password" && activeTab !== "recover") {
      newErrors.password = validatePassword(password, activeTab, t);
    }
    if (field === "confirmPassword" && (activeTab === "register" || activeTab === "reset")) {
      newErrors.confirmPassword = password !== confirmPassword ? t('auth.errors.passwordsMismatch') : null;
    }
    setFieldErrors(newErrors);
  }

  function validateAll() {
    const newErrors = {};
    if (activeTab !== "reset") {
      newErrors.email = validateEmail(email, t);
    }
    if (activeTab !== "recover") {
      newErrors.password = validatePassword(password, activeTab, t);
    }
    if (activeTab === "register" || activeTab === "reset") {
      newErrors.confirmPassword = password !== confirmPassword ? t('auth.errors.passwordsMismatch') : null;
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
        setSuccess(i18n.language.startsWith('es') ? "¡Cuenta creada! Revisa tu email para confirmarla." : "Account created! Check your email to confirm it.");
      } else if (activeTab === "recover") {
        setSuccess(json.message);
      } else if (activeTab === "reset") {
        setSuccess(i18n.language.startsWith('es') ? "Contraseña actualizada correctamente. Ya puedes iniciar sesión." : "Password updated successfully. You can now log in.");
        setTimeout(() => handleTabChange("login"), 2000);
      } else {
        login(json.user, json.token);
        onClose();
      }
    } catch {
      setError(i18n.language.startsWith('es') ? "Error de conexión. ¿Está corriendo el servidor?" : "Connection error. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-4 bg-[#0d1117] border border-indigo-500/30 rounded-2xl shadow-[0_0_50px_-12px_rgba(99,102,241,0.3)] overflow-hidden"
      >
        {/* Glow Header */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-70"></div>

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
          <div className="flex border-b border-[#30363d] bg-[#161b22]">
            <button
              type="button"
              onClick={() => handleTabChange("login")}
              className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-bold transition-colors relative ${
                activeTab === "login"
                  ? "text-indigo-400"
                  : "text-[#8b949e] hover:text-[#d4d4d8]"
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              {t('auth.login')}
              {activeTab === "login" && (
                <motion.span layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
              )}
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("register")}
              className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-bold transition-colors relative ${
                activeTab === "register"
                  ? "text-indigo-400"
                  : "text-[#8b949e] hover:text-[#d4d4d8]"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              {t('auth.register')}
              {activeTab === "register" && (
                <motion.span layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
              )}
            </button>
          </div>
        ) : (
          <div className="flex border-b border-[#27272a]">
            <div className="flex-1 py-4 text-sm font-medium text-white text-center relative">
              {activeTab === "recover" 
                ? (i18n.language.startsWith('es') ? "Recuperar Contraseña" : "Recover Password") 
                : (i18n.language.startsWith('es') ? "Elegir Nueva Contraseña" : "Choose New Password")}
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Mensajes Globales */}
          {error && <p className="text-sm text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">{error}</p>}
          {success && <p className="text-sm text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-lg px-3 py-2">{success}</p>}

          {(activeTab === "login" || activeTab === "register") && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="space-y-4"
            >
              <button
                type="button"
                onClick={async () => {
                  await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                      redirectTo: window.location.origin,
                    }
                  });
                }}
                className="group relative flex w-full items-center justify-center gap-3 rounded-xl border border-[#30363d] bg-[#161b22] px-4 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-[#21262d] hover:border-[#8b949e] hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <svg className="h-5 w-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                {i18n.language.startsWith('es') ? "Continuar con Google" : "Continue with Google"}
              </button>
              
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-[#30363d]"></div>
                <span className="mx-4 flex-shrink-0 text-xs font-semibold uppercase tracking-wider text-[#8b949e]">
                  {i18n.language.startsWith('es') ? "o con tu correo" : "or with email"}
                </span>
                <div className="flex-grow border-t border-[#30363d]"></div>
              </div>
            </motion.div>
          )}

          {activeTab !== "reset" && (
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none text-[#d4d4d8]">
                {i18n.language.startsWith('es') ? "Correo electrónico" : "Email address"}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-[#8b949e]" />
                <input
                  id="email"
                  type="email"
                  placeholder="gamer@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={`flex h-10 w-full rounded-lg border bg-[#161b22] pl-10 pr-3 py-2 text-sm text-white placeholder:text-[#8b949e] focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.email ? "border-rose-500/50 focus:ring-rose-500/50" : "border-[#30363d] focus:ring-indigo-500/50 focus:border-indigo-500/50"
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-xs text-rose-500">{fieldErrors.email}</p>
              )}
            </div>
          )}

          {activeTab !== "recover" && (
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none text-[#d4d4d8]">
                {activeTab === "reset" 
                  ? (i18n.language.startsWith('es') ? "Nueva contraseña" : "New password") 
                  : (i18n.language.startsWith('es') ? "Contraseña" : "Password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-[#8b949e]" />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur("password")}
                  className={`flex h-10 w-full rounded-lg border bg-[#161b22] pl-10 pr-3 py-2 text-sm text-white placeholder:text-[#8b949e] focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.password ? "border-rose-500/50 focus:ring-rose-500/50" : "border-[#30363d] focus:ring-indigo-500/50 focus:border-indigo-500/50"
                  }`}
                />
              </div>
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
                {activeTab === "reset" 
                  ? (i18n.language.startsWith('es') ? "Confirmar nueva contraseña" : "Confirm new password") 
                  : (i18n.language.startsWith('es') ? "Confirmar contraseña" : "Confirm password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-[#8b949e]" />
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => handleBlur("confirmPassword")}
                  className={`flex h-10 w-full rounded-lg border bg-[#161b22] pl-10 pr-3 py-2 text-sm text-white placeholder:text-[#8b949e] focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.confirmPassword ? "border-rose-500/50 focus:ring-rose-500/50" : "border-[#30363d] focus:ring-indigo-500/50 focus:border-indigo-500/50"
                  }`}
                />
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-xs text-rose-500">{fieldErrors.confirmPassword}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full bg-indigo-600 text-white hover:bg-indigo-500 font-bold py-2.5 h-11 mt-4 shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)]"
          >
            {loading 
              ? (i18n.language.startsWith('es') ? "Cargando..." : "Loading...") 
              : activeTab === "login" 
                ? t('auth.login') 
                : activeTab === "register" 
                  ? t('auth.createAccount') 
                  : activeTab === "reset"
                    ? (i18n.language.startsWith('es') ? "Guardar nueva contraseña" : "Save new password")
                    : (i18n.language.startsWith('es') ? "Enviar instrucciones" : "Send instructions")}
          </button>

          {activeTab === "login" && (
            <p className="text-center text-sm text-[#71717a]">
              {i18n.language.startsWith('es') ? "¿Olvidaste tu contraseña?" : "Forgot your password?"}{" "}
              <button type="button" onClick={() => handleTabChange("recover")} className="text-white hover:underline">
                {i18n.language.startsWith('es') ? "Recupérala aquí" : "Recover it here"}
              </button>
            </p>
          )}

          {activeTab === "recover" && (
            <p className="text-center text-sm text-[#71717a]">
              {i18n.language.startsWith('es') ? "¿Recordaste tu contraseña?" : "Remembered your password?"}{" "}
              <button type="button" onClick={() => handleTabChange("login")} className="text-white hover:underline">
                {i18n.language.startsWith('es') ? "Inicia sesión" : "Log in"}
              </button>
            </p>
          )}
        </form>
      </motion.div>
    </div>
  );
}