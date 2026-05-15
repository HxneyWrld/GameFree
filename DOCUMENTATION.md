# 🎮 GameFree — Documentación Técnica (Arquitectura NestJS)

> **GameFree** es un ecosistema bilingüe bilingüe que centraliza ofertas de juegos gratuitos. Esta documentación detalla la arquitectura moderna basada en **NestJS** y **React 19**.

---

## 1. Arquitectura del Sistema
El sistema utiliza un diseño desacoplado para máxima escalabilidad:

1. **Backend (NestJS):** API robusta construida con TypeScript. Gestiona la lógica de negocio, integración con Supabase y seguridad.
2. **Frontend (React):** Interfaz de usuario bilingüe, reactiva y optimizada para la conversión.
3. **Persistencia (Supabase):** PostgreSQL gestionado, Auth JWT y políticas RLS.
4. **Ingesta (Scraper):** Script independiente que alimenta la base de datos con ofertas traducidas.

---

## 2. Backend — NestJS
Se ha migrado el backend de Express a **NestJS** para aprovechar su arquitectura modular y el uso de TypeScript.

- **Main.ts:** Configura CORS globalmente para permitir peticiones desde cualquier origen (esencial para el despliegue en Render/Vercel).
- **Módulos:** Organización lógica por dominios (Auth, Games, Users).
- **Seguridad:** Validación de tokens JWT mediante los servicios de Supabase.

---

## 3. Frontend — React + i18n
La interfaz está construida con **React 19** y **Tailwind CSS v4**.

### Estrategia de Internacionalización (i18n)
Utilizamos un enfoque híbrido para garantizar que el 100% de la app sea bilingüe:
- **UI Estática:** Diccionarios locales en `i18n.js` para botones, menús y formularios.
- **Contenido Dinámico:** El scraper traduce descripciones e instrucciones a `_es` y `_en`. El frontend renderiza la columna correspondiente según el idioma activo.
- **Páginas de Texto:** About, Privacy y Posts del Blog contienen ambas versiones y renderizan condicionalmente para evitar latencia.

---

## 4. Flujo de Datos y Gamificación
- **Bóveda de Ahorros:** Cuando un usuario reclama un juego, el sistema calcula el precio original y actualiza el contador de "Total Ahorrado".
- **Optimistic UI:** La interfaz responde instantáneamente a las acciones del usuario (marcar como reclamado/favorito) mientras la petición se procesa en segundo plano.

---

## 5. El Motor de Datos (`scraper.js`)
El scraper es el encargado de mantener la plataforma viva:
1. **Fetch:** Obtiene datos de GamerPower.
2. **Normalización:** Limpia los slugs de las tiendas y parsea los precios.
3. **Traducción:** Genera contenido bilingüe para cada entrada.
4. **Sincronización:** Realiza un `upsert` en Supabase para evitar duplicados y limpia los juegos expirados.

---

## 6. Despliegue (DevOps)
- **Frontend:** Desplegado en **Netlify/Vercel** con redirección de SPA configurada.
- **Backend:** Desplegado en **Render** (Plan Starter para evitar el arranque en frío).
- **Base de Datos:** Instancia gestionada en **Supabase**.

---
*Última actualización: Mayo 2026 — Migración a NestJS completada.*
