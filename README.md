# 🎮 GameFree

GameFree es una plataforma web moderna y bilingüe diseñada para rastrear, centralizar y notificar a los usuarios sobre juegos de PC que se encuentran **100% gratis** por tiempo limitado en tiendas como Steam, Epic Games, GOG, itch.io y más.

---

## 🌍 Soporte Bilingüe Completo
La plataforma ofrece una experiencia nativa tanto en **Español** como en **Inglés**. El cambio de idioma afecta instantáneamente a:
- La interfaz de usuario (UI).
- Descripciones y títulos de los juegos.
- Instrucciones de reclamo.
- Posts del blog y páginas informativas.

---

## 🌟 Características Principales

- **🔥 Feed en Tiempo Real:** Lista actualizada constantemente de los juegos gratis disponibles.
- **💎 La Bóveda de Ahorros:** Sistema gamificado donde los usuarios registran sus juegos reclamados y ven en tiempo real su ahorro total acumulado en $USD.
- **🔍 Filtros y Búsqueda:** Filtrado por tienda (Epic, Steam, GOG, etc.) con búsqueda instantánea.
- **🔐 Autenticación Segura:** Gestión de usuarios, favoritos y biblioteca personal mediante Supabase.
- **📱 Diseño Responsive Premium:** Interfaz oscura (dark mode) optimizada con Tailwind CSS v4 para una experiencia fluida en cualquier dispositivo.
- **📰 Blog Bilingüe:** Guías y noticias sobre ofertas de juegos.

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
├── scraper.js               # Motor de datos y traducción
└── package.json             # Configuración del espacio de trabajo
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
