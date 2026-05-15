# 🎮 GameFree — Documentación Técnica Completa

> **GameFree** es una ecosistema web bilingüe (ES/EN) que centraliza ofertas de juegos "premium" gratuitos. Utiliza una arquitectura desacoplada con sincronización automática de datos.

---

## 1. Visión General del Producto
GameFree resuelve la fragmentación de ofertas gratuitas. La plataforma no solo informa, sino que **gamifica el ahorro**:
- **Feed:** Ofertas activas con cuenta regresiva.
- **Bóveda:** Historial de juegos reclamados con contador de dólares ($) ahorrados.
- **Blog:** Contenido educativo bilingüe para maximizar las bibliotecas de los usuarios.

## 2. Stack Tecnológico Detallado

### Backend (Node.js + Express)
- **Express v5:** Manejo de rutas y middlewares.
- **CORS:** Configurado para permitir comunicación entre dominios (Netlify <-> Render).
- **Supabase JS:** Integración con la base de datos y validación de tokens JWT.

### Base de Datos (Supabase)
- **PostgreSQL:** Almacenamiento relacional.
- **Auth:** Sistema GoTrue para login, registro y recuperación de clave vía Email.
- **RLS (Row Level Security):** Políticas de seguridad que aseguran que un usuario solo pueda ver/editar su propia Bóveda.

### Frontend (React 19 + Tailwind v4)
- **i18next:** Internacionalización completa de la UI y contenidos dinámicos.
- **Optimistic UI:** Los juegos se marcan como "reclamados" instantáneamente en la interfaz antes de que el servidor confirme, mejorando la percepción de velocidad.
- **Vite:** Herramienta de construcción y HMR (Hot Module Replacement).

---

## 3. El Motor de Datos: `scraper.js`
Este script es el corazón de la plataforma. Realiza las siguientes tareas:
1. **Extracción:** Consulta la API de GamerPower buscando solo juegos completos para PC.
2. **Traducción Automática:** Utiliza un sistema de mapeo para generar versiones `_en` y `_es` de las descripciones e instrucciones.
3. **Normalización:** Limpia precios y fechas para asegurar que el feed sea consistente.
4. **Limpieza:** Elimina de la base de datos local los juegos que ya han expirado en las tiendas oficiales.

## 4. Internacionalización (i18n)
La app utiliza un enfoque híbrido para el cambio de idioma:
- **UI Estática:** Diccionario de llaves en `i18n.js` para botones, menús y errores.
- **Contenido Dinámico:** El scraper guarda versiones bilingües en la BD. El frontend decide qué columna mostrar (`description_es` o `description_en`) basándose en el estado de `i18n.language`.
- **Páginas de Texto:** Componentes como `About.jsx` o los posts del blog contienen ambas versiones y renderizan condicionalmente para máxima velocidad.

## 5. Autenticación y Recuperación
- **Seguridad:** El `AuthModal` valida la complejidad de la contraseña antes de enviarla.
- **Flujo de Recuperación:** 
  - El usuario solicita link → Supabase envía email → El link contiene un `#access_token`.
  - La app detecta el hash, abre el modal en modo `reset` y **limpia la URL** para proteger el token.

## 6. Despliegue y Mantenimiento
- **Frontend (Netlify):** Configurado con `netlify.toml` para manejar el routing de SPA (evita el error 404 al recargar).
- **Backend (Render):** Servidor Express que se mantiene "despierto" mediante el uso activo de la plataforma.
- **Base de Datos (Supabase):** Hosting gestionado con copias de seguridad automáticas.

## 7. Próximos Pasos (Roadmap)
- [ ] **Notificaciones Push:** Avisar al móvil/navegador cuando Epic Games libere el juego semanal.
- [ ] **Categorías:** Filtrar por género (RPG, Acción, etc.).
- [ ] **Social:** Permitir a los usuarios compartir su "Total Ahorrado" en Twitter/Discord.

---
*Última actualización: Mayo 2026*
