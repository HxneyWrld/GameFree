# Documentación Técnica - GameFree

Este documento describe la arquitectura, las decisiones técnicas y el flujo de la aplicación GameFree. Está pensado para futuras referencias en el mantenimiento y escalabilidad del proyecto.

---

## 1. Arquitectura General

GameFree opera bajo una arquitectura cliente-servidor clásica dividida en tres pilares:
1. **Frontend (Cliente):** Aplicación de una sola página (SPA) en React manejada por Vite.
2. **Backend (API REST):** Servidor monolítico ligero construido en Node.js y Express.
3. **Persistencia y Auth:** Supabase (PostgreSQL + GoTrue) utilizado como Backend-as-a-Service para la base de datos y la autenticación.

---

## 2. Decisiones de Producto y Gamificación

En la última iteración del proyecto, se rediseñó la experiencia del usuario (UX) para proveer valor inmediato a través de **Gamificación**:
- **Eliminación de "Favoritos":** Debido a que los juegos son promociones efímeras, un sistema de favoritos carecía de utilidad práctica a largo plazo.
- **La Bóveda de Ahorros:** "Mi Biblioteca" se transformó en "Mi Bóveda". Cuando un usuario hace clic en "Reclamar", usamos **Actualización Optimista (Optimistic UI)** para agregar el juego inmediatamente a su historial. El sistema luego calcula el `original_price` de cada juego reclamado y muestra en una cabecera el ahorro total en dólares. Esto fomenta el registro y el regreso constante de los usuarios (engagement).

---

## 3. Autenticación y Seguridad

La autenticación es delegada a **Supabase Auth** y cuenta con protecciones duales (Front/Back):
- **Frontend (`AuthModal.jsx`):** Evalúa fuerza de contraseñas (uso de minúsculas, mayúsculas, números, caracteres especiales y longitud mínima de 8). Evalúa validez del email mediante regex en tiempo real. 
- **Backend (`server.js`):** El endpoint `/api/auth/register` re-valida estos datos para evitar inyecciones e intercepta los errores específicos de Supabase (ej. `User already registered`) para devolver al cliente mensajes en español claro, evitando caídas de la API.
- **Manejo de Tokens URL (`App.jsx`):** Al recuperar la contraseña o confirmar un registro mediante Email (Magic Link), Supabase envía los tokens (`access_token` y `refresh_token`) a través de fragmentos de URL (`#`). React captura estos tokens, inicia la sesión decodificando el JWT base64 localmente, e **inmediatamente limpia el historial del navegador (`window.history.replaceState`)** para evitar que los tokens confidenciales permanezcan visibles en la barra de direcciones.

---

## 4. Frontend & Diseño (Tailwind v4)

Se utilizan tokens de diseño personalizados definidos en `index.css` a través de utilidades CSS puras compatibles con Tailwind v4. 
- **Componentes Modulares:** La UI está fragmentada en `Navbar`, `GameCard`, `HeroSection`, `FilterSidebar` y `AuthModal`.
- **Responsive Design:** La aplicación implementa diseños de rejilla asimétrica en Desktop y **Drawers / Modales móviles** activados por botones en pantallas pequeñas. Todo el texto ha sido auditado para estar en **español neutro**.
- **Animaciones Custom:** Uso extensivo de micro-interacciones (ej. `animate-bounce-in` para los Toasts flotantes al reclamar un juego) para elevar el sentido de fluidez (60fps).

---

## 5. Monetización (Google AdSense)

El proyecto está preparado para la monetización pasiva a través de Google AdSense.
- **Script Base:** Incrustado en el `<head>` de `index.html`.
- **Anuncios Modulares (`AdBanner.jsx`):** Un componente de React encapsula las llamadas a `adsbygoogle.push({})` dentro de un `useEffect` vacío `[]`. Esto es indispensable en React para asegurar que el AdSense script se dispare solo una vez cuando el componente se monta en el DOM, previniendo advertencias o bloqueos en consola.
- Se ha situado estratégicamente debajo del `FilterSidebar` ya que provee excelente retención visual al ser una columna fija (sticky).

---

## 6. Sincronización Backend - Base de Datos

- **Supabase Tablas Principales:**
  - `games`: Almacena meta-información (thumbnail, titulo, enlace, `original_price`, tienda).
  - `user_games`: Tabla pivote (relacional) que vincula `user_id` de `auth.users` con el `game_id` para almacenar el estado de "reclamado" en la Bóveda del usuario.

## 7. Próximos Pasos (Roadmap)
- Integración de notificaciones automáticas vía email (Notificar a los usuarios de "Su Bóveda" cuando un juego nuevo esté gratis).
- Escalabilidad del scraper (`scraper.js`) para capturar precios en distintas monedas y evitar desincronización de tiempos de finalización.
