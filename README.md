# GameFree 🎮

GameFree es una plataforma web moderna diseñada para rastrear, centralizar y notificar a los usuarios sobre juegos de PC que se encuentran **100% gratis** por tiempo limitado en tiendas como Steam, Epic Games, GOG y más.

## 🚀 Características Principales

- **Feed en Tiempo Real:** Lista actualizada constantemente de los juegos gratis disponibles.
- **La Bóveda de Ahorros:** Un sistema gamificado donde los usuarios pueden llevar un registro de los juegos que han reclamado y ver en tiempo real cuántos dólares ($USD) han ahorrado en total usando la plataforma.
- **Filtros Inteligentes:** Sistema de barra lateral (con drawer responsivo para móviles) para filtrar juegos por tienda (Epic, Steam, GOG, etc.).
- **Autenticación Segura:** Registro e inicio de sesión seguro impulsado por Supabase, con validaciones estrictas de contraseñas y correos.
- **Monetización:** Integración segura de Google AdSense mediante componentes de React.

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React, Vite, Tailwind CSS v4, Lucide React (Iconos).
- **Backend:** Node.js, Express.
- **Base de Datos & Auth:** Supabase (PostgreSQL).
- **Extracción de Datos:** Scraping automatizado (`scraper.js`) adaptado a APIs de terceros (GamerPower).
- **Despliegue:** Render.

## 📂 Estructura del Proyecto

```text
GameFree/
├── gamefree-frontend/       # Aplicación React + Vite
│   ├── src/
│   │   ├── components/      # Componentes UI (GameCard, Navbar, FilterSidebar, AuthModal, AdBanner)
│   │   ├── context/         # AuthContext para estado global de usuario
│   │   ├── App.jsx          # Lógica principal y enrutamiento
│   │   └── index.css        # Tokens de diseño Tailwind v4 y animaciones personalizadas
├── scraper.js               # Script automatizado para buscar nuevas ofertas
├── server.js                # Backend Express API (Endpoints de Autenticación y Juegos)
└── package.json             # Dependencias del backend
```

## ⚙️ Instalación y Configuración Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/HxneyWrld/GameFree.git
   cd GameFree
   ```

2. **Configurar el Backend:**
   - Instalar dependencias: `npm install`
   - Crear un archivo `.env` en la raíz con las variables de Supabase:
     ```env
     SUPABASE_URL=tu_supabase_url
     SUPABASE_KEY=tu_supabase_anon_key
     ```
   - Iniciar el servidor: `node server.js`

3. **Configurar el Frontend:**
   - Navegar a la carpeta: `cd gamefree-frontend`
   - Instalar dependencias: `npm install`
   - Crear un archivo `.env` con la URL de la API local:
     ```env
     VITE_API_URL=http://localhost:3000
     ```
   - Ejecutar entorno de desarrollo: `npm run dev`

## 🤝 Contribución
Si deseas mejorar el proyecto, ¡los pull requests son bienvenidos! Asegúrate de seguir la estructura actual y mantener el diseño limpio.
