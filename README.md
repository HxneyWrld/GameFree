# 🎮 GameFree

GameFree es una plataforma web moderna y bilingüe diseñada para rastrear, centralizar y notificar a los usuarios sobre juegos de PC que se encuentran **100% gratis** por tiempo limitado en tiendas como Steam, Epic Games, GOG, itch.io y más.

---

## 🌟 Características Principales

- **🌍 Soporte Bilingüe Completo:** Cambio de idioma (Español/Inglés) en tiempo real para toda la interfaz, incluyendo detalles de juegos y posts del blog.
- **🔥 Feed en Tiempo Real:** Lista actualizada constantemente de los juegos gratis disponibles.
- **💎 La Bóveda de Ahorros:** Un sistema gamificado donde los usuarios registran sus juegos reclamados y ven en tiempo real cuántos dólares ($USD) han ahorrado en total.
- **🔍 Filtros Inteligentes:** Sistema de barra lateral para filtrar juegos por tienda (Epic, Steam, GOG, etc.) con búsqueda instantánea.
- **🔐 Autenticación Robusta:** Registro, inicio de sesión y recuperación de contraseña seguro impulsado por Supabase.
- **📱 Diseño Responsive Premium:** Interfaz oscura (dark mode) optimizada para móviles, tablets y desktop con animaciones fluidas.
- **📰 Blog Integrado:** Guías y consejos sobre ofertas, totalmente bilingüe.

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19 + Vite:** SPA rápida y moderna.
- **Tailwind CSS v4:** Estilizado de última generación con tokens personalizados.
- **react-i18next:** Gestión profesional de internacionalización.
- **Lucide React:** Iconografía vectorial elegante.

### Backend & Datos
- **Node.js + Express:** API REST para gestión de usuarios y lógica de negocio.
- **Supabase (PostgreSQL):** Base de datos relacional y autenticación JWT nativa.
- **Scraper Automatizado:** Script en Node.js que normaliza y traduce datos de la API de GamerPower.

---

## 📂 Estructura del Proyecto

```text
GameFree/
├── gamefree-frontend/       # Aplicación React + Vite
│   ├── src/
│   │   ├── components/      # UI: Navbar, GameCard, AuthModal, Hero...
│   │   ├── pages/           # About, Privacy y Blog (Bilingües)
│   │   ├── context/         # AuthContext (Estado global)
│   │   ├── i18n.js          # Configuración de idiomas (ES/EN)
│   │   └── index.css        # Diseño Tailwind v4 y Animaciones
├── scraper.js               # Cerebro de datos: Actualiza ofertas y traduce
├── server.js                # Servidor Express API
└── package.json             # Dependencias del sistema
```

---

## ⚙️ Configuración Local

1. **Clonación:**
   ```bash
   git clone https://github.com/HxneyWrld/GameFree.git
   cd GameFree
   ```

2. **Instalación:**
   ```bash
   npm install && cd gamefree-frontend && npm install
   ```

3. **Variables de Entorno:**
   Crea un archivo `.env` en la raíz con tus credenciales de Supabase:
   ```env
   SUPABASE_URL=tu_url
   SUPABASE_KEY=tu_anon_key
   VITE_API_URL=http://localhost:3000
   ```

4. **Ejecución:**
   - Backend: `node server.js`
   - Scraper (Opcional): `node scraper.js`
   - Frontend: `cd gamefree-frontend && npm run dev`

---

## 🤝 Créditos
Desarrollado con pasión para la comunidad gamer. Si te gusta el proyecto, ¡apóyanos con una ⭐ en GitHub!
