import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'es',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      es: {
        translation: {
          nav: {
            feed: 'Feed de Ofertas',
            vault: 'Mi Bóveda',
            login: 'Iniciar Sesión',
            logout: 'Salir',
            about: 'Acerca de',
            privacy: 'Privacidad',
            blog: 'Blog'
          },
          hero: {
            title: 'Juegos Premium, Costo Cero.',
            subtitle: 'No vuelvas a perderte un regalo de Epic, Steam o GOG. Tu biblioteca crece, tu billetera descansa.'
          },
          filters: {
            title: 'Filtros',
            stores: 'Tiendas',
            status: 'Estado',
            active: 'Activos',
            search: 'Buscar juegos por nombre...',
            clear: 'Limpiar'
          },
          game: {
            free: 'GRATIS',
            ends: 'Termina en',
            expired: 'Expirado',
            claim: 'Reclamar Ahora',
            about: 'Acerca de este juego',
            instructions: 'Instrucciones',
            details: 'Detalles de la Oferta',
            platform: 'Plataforma / Tienda',
            price: 'Precio Habitual',
            expires: 'Expira el',
            official: 'Ir a la tienda oficial'
          },
          auth: {
            welcome: 'Bienvenido a GameFree',
            subtitle: 'Crea tu cuenta para guardar juegos y recibir alertas.',
            email: 'Correo electrónico',
            pass: 'Contraseña',
            register: 'Registrarse',
            login: 'Entrar',
            createAccount: 'Crear Cuenta',
            forgot: '¿Olvidaste tu contraseña?',
            errors: {
              emailRequired: 'El correo es obligatorio.',
              emailLong: 'El correo es demasiado largo.',
              emailInvalid: 'El formato del correo no es válido.',
              passwordRequired: 'La contraseña es obligatoria.',
              passwordLong: 'Máximo 64 caracteres.',
              passwordShort: 'Mínimo 8 caracteres.',
              passwordLower: 'Debe tener al menos una minúscula.',
              passwordUpper: 'Debe tener al menos una mayúscula.',
              passwordNumber: 'Debe tener al menos un número.',
              passwordsMismatch: 'Las contraseñas no coinciden.'
            }
          }
        }
      },
      en: {
        translation: {
          nav: {
            feed: 'Deals Feed',
            vault: 'My Vault',
            login: 'Login',
            logout: 'Logout',
            about: 'About',
            privacy: 'Privacy',
            blog: 'Blog'
          },
          hero: {
            title: 'Premium Games, Zero Cost.',
            subtitle: 'Never miss a giveaway from Epic, Steam, or GOG. Your library grows, your wallet rests.'
          },
          filters: {
            title: 'Filters',
            stores: 'Stores',
            status: 'Status',
            active: 'Active',
            search: 'Search games by name...',
            clear: 'Clear'
          },
          game: {
            free: 'FREE',
            ends: 'Ends in',
            expired: 'Expired',
            claim: 'Claim Now',
            about: 'About this game',
            instructions: 'Instructions',
            details: 'Offer Details',
            platform: 'Platform / Store',
            price: 'Regular Price',
            expires: 'Expires on',
            official: 'Go to official store'
          },
          auth: {
            welcome: 'Welcome to GameFree',
            subtitle: 'Create your account to save games and get alerts.',
            email: 'Email address',
            pass: 'Password',
            register: 'Sign Up',
            login: 'Sign In',
            createAccount: 'Create Account',
            forgot: 'Forgot password?',
            errors: {
              emailRequired: 'Email is required.',
              emailLong: 'Email is too long.',
              emailInvalid: 'Invalid email format.',
              passwordRequired: 'Password is required.',
              passwordLong: 'Maximum 64 characters.',
              passwordShort: 'Minimum 8 characters.',
              passwordLower: 'Must have at least one lowercase letter.',
              passwordUpper: 'Must have at least one uppercase letter.',
              passwordNumber: 'Must have at least one number.',
              passwordsMismatch: 'Passwords do not match.'
            }
          }
        }
      }
    }
  });

export default i18n;
