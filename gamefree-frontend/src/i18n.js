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
            forgot: '¿Olvidaste tu contraseña?'
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
            forgot: 'Forgot password?'
          }
        }
      }
    }
  });

export default i18n;
