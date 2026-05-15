# 🎮 GameFree

GameFree es una plataforma web moderna y bilingüe diseñada para rastrear, centralizar y notificar a los usuarios sobre juegos de PC gratuitos y ofertas masivas. Nuestra misión es que nunca vuelvas a pagar el precio completo por un juego premium.

---

## 🌍 Soporte Bilingüe Completo
La plataforma ofrece una experiencia nativa tanto en **Español** como en **Inglés**. El cambio de idioma afecta instantáneamente a:
- La interfaz de usuario (UI).
- Descripciones y títulos de los juegos.
- Instrucciones de reclamo.
- Posts del blog y páginas informativas.

---

## 🌟 Características Principales

- **🎁 Juegos 100% Gratis:** Feed dedicado a regalos permanentes y temporales (Epic, Steam, GOG, etc.).
- **🔥 Mega Ofertas (+80%):** Nueva sección que rastrea descuentos masivos (80-95%) para juegos AAA y destacados.
- **💎 La Bóveda de Ahorros:** Sistema gamificado donde registras tus juegos reclamados y ves tu ahorro total acumulado.
- **🎛️ Segmented Control Premium:** Navegación fluida entre Gratis y Ofertas mediante un toggle animado moderno.
- **🔍 Filtros Avanzados:** Búsqueda y filtrado por tienda, estado y nombre.
- **🔐 Autenticación Segura:** Gestión de perfiles y biblioteca personal mediante Supabase.
- **📱 Diseño Responsive Profesional:** Interfaz oscura (dark mode) con iconografía de Lucide-react y animaciones fluidas.
- **📰 Blog Bilingüe:** Guías para no perderse ninguna oferta.

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19 + Vite:** SPA de alto rendimiento.
- **Tailwind CSS v4:** Estilizado moderno con tokens personalizados.
- **react-i18next:** Gestión de internacionalización.
- **Lucide React:** Iconografía vectorial.

### Backend (Migrado a NestJS)
- **NestJS:** Framework de Node.js progresivo para aplicaciones eficientes y escalables.
- **TypeScript:** Tipado fuerte para un desarrollo robusto.
- **Supabase (PostgreSQL):** Persistencia de datos y autenticación JWT.

### Datos & Automatización
- **Scraper Automatizado:** Script en Node.js que extrae, normaliza y traduce datos de la API de GamerPower.

---

## 📂 Estructura del Proyecto

```text
GameFree/
├── gamefree-frontend/       # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/      # UI: Navbar, GameCard, AuthModal...
│   │   ├── pages/           # Vistas principales y Blog (Bilingües)
│   │   ├── i18n.js          # Diccionarios ES/EN
│   │   └── context/         # Estado global (Auth)
├── gamefree-backend/        # Backend (NestJS + TypeScript)
│   ├── src/                 # Lógica de la API y módulos
├── scraper.js               # Scraper principal (GamerPower - Gratis)
├── deals-scraper.js         # Nuevo scraper de ofertas (CheapShark - Deals)
├── server.js                # Punto de entrada del servidor
└── package.json             # Configuración del proyecto
```

---

## ⚙️ Configuración Local

1. **Clonación:**
   ```bash
   git clone https://github.com/HxneyWrld/GameFree.git
   cd GameFree
   ```

2. **Instalación:**
   - Backend: `cd gamefree-backend && npm install`
   - Frontend: `cd gamefree-frontend && npm install`

3. **Variables de Entorno:**
   Configura tus credenciales de Supabase en los archivos `.env` respectivos.

4. **Ejecución:**
   - Backend: `cd gamefree-backend && npm run start:dev`
   - Frontend: `cd gamefree-frontend && npm run dev`

---

## 🤝 Créditos
Desarrollado para la comunidad gamer que busca maximizar su biblioteca sin gastar un centavo. 🚀
