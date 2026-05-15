# 📚 GameFree — Documentación Detallada del Sistema

GameFree es un ecosistema completo para el seguimiento de contenido gamer gratuito y ofertas extremas. Esta documentación cubre cada aspecto técnico y funcional de la plataforma.

---

## 1. Arquitectura General
La aplicación sigue una arquitectura de **SPA (Single Page Application)** con un backend desacoplado y procesos de automatización independientes.

- **Frontend:** React 19 + Vite.
- **Backend:** Node.js / Express (migrando a NestJS) + Supabase SDK.
- **Base de Datos:** PostgreSQL (vía Supabase).
- **Automatización:** GitHub Actions + Node.js Scripts.

---

## 2. Funcionalidades Detalladas

### A. Feed de Juegos Gratis (100% OFF)
- **Origen:** Datos extraídos de la API de GamerPower.
- **Limpieza de Títulos:** Algoritmo de limpieza que elimina redundancias como "(Epic Games) Giveaway" para mostrar solo el nombre puro del juego.
- **Detalles:** Vista dedicada con descripción traducida, instrucciones de reclamo, cronómetro de expiración y banners visuales.

### B. Sección de Mega Ofertas (+80% OFF)
- **Origen:** Integración con la API de CheapShark.
- **Filtro de Calidad:** Solo se muestran juegos con descuentos superiores al 80%.
- **Vistas:** Página de detalles propia que incluye puntuación de Metacritic y comparativa de precios.

### C. La Bóveda (Vault)
- **Gamificación:** Cada vez que un usuario hace clic en "Reclamar", el juego se añade a su biblioteca personal.
- **Contador de Ahorro:** El sistema suma el `original_price` de cada juego reclamado para mostrar un total de ahorro acumulado en USD.
- **Estado Persistente:** Los juegos reclamados se marcan visualmente en el feed para evitar duplicados.

### D. Internacionalización (i18n)
- **Sistema:** `react-i18next`.
- **Traducción Automática:** El scraper traduce dinámicamente las descripciones del inglés al español usando la API de Google Translate durante la ingesta.
- **Soporte Completo:** Todo el contenido, desde botones hasta avisos legales, está disponible en ES/EN.

---

## 3. Componentes de la Interfaz (UI/UX)

- **Navbar Premium:** Acceso rápido a Gratis, Ofertas, Bóveda y Blog con iconos de Lucide.
- **Segmented Control Toggle:** Interruptor animado para cambiar entre el feed de "Gratis" y "Ofertas" sin recargar la página.
- **Hero Section:** Banner dinámico que persiste durante la navegación para mantener la identidad visual.
- **DealCard & GameCard:** Tarjetas optimizadas con badges de tienda, porcentajes de descuento y efectos de hover "glassmorphism".

---

## 4. Backend y API
Puntos de acceso principales:
- `GET /api/games/free`: Devuelve la lista de juegos gratuitos actuales.
- `GET /api/deals`: Devuelve ofertas filtradas por porcentaje de descuento.
- `GET /api/games/:id` / `GET /api/deals/:id`: Detalles extendidos de un ítem.
- `POST /api/games/:id/claim`: Registra un juego en la bóveda del usuario (Protegido por JWT).

---

## 5. Automatización (Scrapers)
Ubicados en la raíz del proyecto, se ejecutan mediante **GitHub Actions** cada 12 horas:

1. **`scraper.js`**:
   - Consulta GamerPower.
   - Traduce contenido.
   - Realiza `upsert` en la tabla `games`.
   - Limpia registros expirados.

2. **`deals-scraper.js`**:
   - Consulta CheapShark.
   - Filtra ofertas AAA y destacados.
   - Sincroniza la tabla `deals`.

---

## 6. Base de Datos (Esquema Supabase)

### Tabla `games`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| title | String | Nombre limpio del juego |
| original_price | Numeric | Precio de referencia |
| store_name | String | Tienda de origen |
| expiration_date | Timestamp | Fecha fin de oferta |

### Tabla `deals`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| discount_pct | Integer | Porcentaje (ej. 90) |
| sale_price | Numeric | Precio con oferta |
| metacritic | Integer | Puntuación crítica |

---

## 7. Seguridad y RLS
La base de datos utiliza **Row Level Security (RLS)**:
- **Lectura:** Pública para todas las ofertas.
- **Escritura:** Solo permitida para el `service_role` (scrapers) y usuarios autenticados para sus propios favoritos/bóveda.

---
*Documentación actualizada por Antigravity AI — Mayo 2026*
