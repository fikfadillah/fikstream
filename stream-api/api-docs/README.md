# FIK STREAM - API Documentation

Dokumentasi API resmi untuk **FIK STREAM** — dibangun dengan [Astro](https://astro.build/) dan [Redoc](https://redocly.com/redoc/).

---

## 🚀 Cara Menjalankan Secara Lokal

### Prasyarat
- [Node.js](https://nodejs.org/) versi **18.17.1** atau lebih baru
- npm versi **9.6.5** atau lebih baru

### Langkah-langkah

```bash
# 1. Clone repository
git clone https://github.com/<username>/<repo-name>.git
cd <repo-name>/api-docs

# 2. Install dependencies
npm install

# 3. Jalankan dev server
npm run dev
```

Buka browser di **http://localhost:4321**

---

## 📁 Struktur Proyek

```
api-docs/
├── public/
│   └── openapi.yaml        # Spesifikasi OpenAPI 3.0
├── src/
│   ├── components/
│   │   └── Redoc.astro     # Komponen Redoc renderer
│   ├── layouts/
│   │   └── Layout.astro    # Layout HTML utama
│   ├── pages/
│   │   └── index.astro     # Halaman utama
│   └── styles/
│       └── custom.css      # Custom CSS
├── astro.config.mjs        # Konfigurasi Astro
├── netlify.toml            # Konfigurasi deploy Netlify
├── package.json
└── tsconfig.json
```

---

## 🐙 Push ke GitHub

### Jika belum ada repository

1. Buat repository baru di [github.com/new](https://github.com/new)
   - Nama: `fik-stream-api-docs` (atau sesuai keinginan)
   - Visibility: Public atau Private
   - **Jangan** centang "Initialize with README"

2. Di terminal, jalankan dari folder `api-docs/`:

```bash
git init
git add .
git commit -m "feat: initial FIK STREAM API documentation"
git branch -M main
git remote add origin https://github.com/<username>/<repo-name>.git
git push -u origin main
```

### Jika sudah ada repository

```bash
git add .
git commit -m "docs: update API documentation"
git push
```

---

## 🌐 Deploy ke Netlify

### Cara 1: Via Netlify UI (Direkomendasikan)

1. Login ke [app.netlify.com](https://app.netlify.com)
2. Klik **"Add new site"** → **"Import an existing project"**
3. Pilih **GitHub** → authorize → pilih repository kamu
4. Isi konfigurasi build:

   | Setting | Value |
   |---------|-------|
   | **Base directory** | `api-docs` |
   | **Build command** | `npm run build` |
   | **Publish directory** | `api-docs/dist` |

5. Klik **"Deploy site"**
6. Tunggu beberapa menit hingga deploy selesai ✅

> **Catatan:** Setelah mendapat URL Netlify (misal `https://fik-stream-api-docs.netlify.app`), update nilai `site` di `astro.config.mjs` dengan URL tersebut, lalu push ulang.

### Cara 2: Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build project
npm run build

# Deploy (preview)
netlify deploy --dir=dist

# Deploy ke production
netlify deploy --dir=dist --prod
```

---

## ⚙️ Konfigurasi

### Mengubah Spesifikasi API

Edit file `public/openapi.yaml` untuk memperbarui:
- Endpoint baru
- Parameter
- Response schema
- Deskripsi

Perubahan akan langsung terlihat di dev server (hot reload).

### Mengubah Tema Warna

Edit bagian `theme` di `src/components/Redoc.astro`:

```javascript
theme: {
  colors: {
    primary: { main: '#4f46e5' },  // Warna utama (Indigo)
    // ...
  },
  sidebar: {
    backgroundColor: '#f8fafc',   // Background sidebar
  },
  rightPanel: {
    backgroundColor: '#1e293b',   // Background panel kanan (dark)
  },
}
```

---

## 📦 Scripts

| Command | Deskripsi |
|---------|-----------|
| `npm run dev` | Jalankan dev server di localhost:4321 |
| `npm run build` | Build untuk production (output ke `dist/`) |
| `npm run preview` | Preview hasil build secara lokal |

---

## 🔄 Update Otomatis (Continuous Deployment)

Setelah terhubung ke Netlify via GitHub, setiap kali kamu `git push` ke branch `main`, Netlify akan otomatis **rebuild dan redeploy** situs dokumentasi.

---

## 📝 Lisensi

Proyek ini milik **FIK STREAM**. Seluruh hak cipta dilindungi.
