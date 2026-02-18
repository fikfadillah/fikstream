# FikStream 🎬

Platform streaming gratis untuk Film, K-Drama, C-Drama, Anime, dan Serial TV — dibangun dengan React + Vite, dihosting di Netlify.

![FikStream](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite)
![Netlify](https://img.shields.io/badge/Hosted-Netlify-00C7B7?style=flat-square&logo=netlify)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## ✨ Fitur

- 🎭 **Multi-Kategori** — K-Drama, C-Drama, Anime, Short TV, Western TV, Indonesian Dub
- 🔍 **Smart Search** — Pencarian real-time dengan dropdown hasil instan
- 🏷️ **Genre Filter** — Klik genre pill untuk filter konten berdasarkan genre
- 🎬 **Detail Page** — Backdrop blur, genre pills, episode grid landscape, metadata lengkap
- ♾️ **Infinite Scroll** — Load konten otomatis saat scroll ke bawah
- 🔒 **API Proxy** — URL API asli tersembunyi via Netlify Functions (tidak terekspos ke browser)
- 📱 **Responsive** — Optimal di Desktop, Tablet, dan Mobile
- 🌙 **Cinema Dark Mode** — Tema gelap premium dengan aksen putih

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React 19, React Router DOM v7 |
| Build Tool | Vite 7 |
| Styling | Vanilla CSS + CSS Custom Properties |
| Icons | Lucide React |
| Hosting | Netlify |
| API Proxy | Netlify Functions (serverless) |

---

## 📁 Struktur Project

```
fik-stream/
├── netlify/
│   └── functions/
│       └── proxy.js          # Serverless proxy — menyembunyikan URL API asli
├── public/
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── MovieCard.jsx  # Card konten dengan play button overlay
│   │   │   ├── MovieCard.css
│   │   │   ├── Navbar.jsx     # Navigasi + search dropdown
│   │   │   ├── Navbar.css
│   │   │   └── Skeleton.jsx   # Loading skeleton
│   │   ├── home/
│   │   │   ├── HeroBanner.jsx # Hero slider dengan dua tombol CTA
│   │   │   └── HeroBanner.css
│   │   ├── layout/
│   │   │   ├── Layout.jsx
│   │   │   ├── Section.jsx    # Section wrapper dengan "View All"
│   │   │   └── Section.css
│   │   └── player/
│   │       └── VideoPlayer.jsx
│   ├── constants/
│   │   └── categories.js      # Definisi kategori terpusat
│   ├── hooks/
│   │   └── useInfiniteScroll.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Search.jsx
│   │   ├── Detail.jsx         # Halaman detail dengan backdrop blur + episode grid
│   │   ├── Detail.css
│   │   ├── Category.jsx       # Halaman per-kategori
│   │   ├── Categories.jsx     # Grid semua kategori
│   │   ├── Genre.jsx          # Filter konten berdasarkan genre
│   │   ├── Genre.css
│   │   └── Disclaimer.jsx
│   ├── services/
│   │   └── api.js             # API service layer
│   └── styles/
│       ├── variables.css      # CSS custom properties (color palette, spacing)
│       └── main.css           # Global styles & utilities
├── .env.example               # Template environment variables
├── netlify.toml               # Konfigurasi Netlify (build, redirect, headers)
├── vite.config.js             # Konfigurasi Vite + dev proxy
└── package.json
```

---

## 🚀 Setup Lokal

### 1. Clone Repository

```bash
git clone https://github.com/username/fik-stream.git
cd fik-stream
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

```bash
cp .env.example .env
```

Edit file `.env` dan isi nilai `API_BASE_URL`:

```env
API_BASE_URL=your_api_url_here
```

> ⚠️ **Jangan pernah commit file `.env` ke Git!** File ini sudah ada di `.gitignore`.

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173) di browser.

> **Catatan:** Dev server sudah dikonfigurasi dengan proxy otomatis — request ke `/api/proxy` akan diteruskan ke API asli tanpa perlu Netlify CLI.

### 5. Build untuk Production

```bash
npm run build
```

---

## 🌐 Deployment ke Netlify

### Cara 1: Deploy via Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### Cara 2: Deploy via GitHub (Recommended)

1. Push repository ke GitHub
2. Login ke [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
3. Pilih repository ini
4. Build settings sudah otomatis terbaca dari `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Tambahkan environment variable di **Site settings → Environment variables**:
   ```
   API_BASE_URL = your_api_url_here
   ```
6. Deploy!

---

## 🔒 Keamanan API

URL API asli **tidak pernah terekspos ke browser**. Arsitekturnya:

```
Browser → /api/proxy?action=trending
              ↓
    Netlify Function (proxy.js)
              ↓
    API Eksternal (URL tersimpan di env var)
```

- URL API asli hanya ada di environment variable Netlify (server-side)
- Netlify Function memvalidasi `action` parameter sebelum meneruskan request
- File `.env` dikecualikan dari Git via `.gitignore`

---

## 📄 Scripts

| Command | Deskripsi |
|---|---|
| `npm run dev` | Jalankan development server |
| `npm run build` | Build untuk production |
| `npm run preview` | Preview hasil build |
| `npm run lint` | Jalankan ESLint |

---

## 📝 License

© 2026 FikStream. All rights reserved.
