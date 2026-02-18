# 🚀 Panduan Deployment FikStream ke Netlify

Berikut adalah panduan lengkap agar aplikasi FikStream kamu bisa online dan diakses siapa saja.

Aplikasi ini sudah dioptimasi untuk **Single Page Application (SPA)**, jadi routing tidak akan error saat di-refresh.

---

## ✅ Persiapan Wajib

1.  **Akun Netlify**: Daftar gratis di [netlify.com](https://www.netlify.com).
2.  **Akun GitHub (Opsional tapi Direkomendasikan)**: Untuk update otomatis.
3.  **File `_redirects`**: Saya sudah buatkan file ini di folder `public/`. Isinya `/* /index.html 200`. Ini **SANGAT PENTING** agar saat user refresh halaman `/category/k-drama`, tidak muncul error 404.

---

## 🛠️ Opsi 1: Deploy Otomatis via GitHub (Paling Mudah & Stabil)

Cara ini paling direkomendasikan. Setiap kamu *push* kode baru ke GitHub, website otomatis terupdate.

1.  **Push Kode ke GitHub**
    - Buat repository baru di GitHub.
    - Upload kode FikStream ini (kecuali folder `node_modules` dan `.env`).
    - *Tip:* Jika sudah ada `.gitignore`, folder sampah tidak akan ikut terupload.

2.  **Hubungkan ke Netlify**
    - Login ke Netlify.
    - Klik **"Add new site"** -> **"Import an existing project"**.
    - Pilih **GitHub**.
    - Cari repository **fikstream** kamu.

3.  **Konfigurasi Build (Penting!)**
    - **Base directory:** `(kosongkan)`
    - **Build command:** `npm run build`
    - **Publish directory:** `dist`

4.  **Deploy**
    - Klik **"Deploy site"**.
    - Tunggu ~1 menit hingga statusnya **Deployed**.
    - Website sudah online! 🎉

---

## 📂 Opsi 2: Deploy Manual (Drag & Drop)

Cocok jika kamu malas setup GitHub atau hanya ingin *test drive*.

1.  **Build Project di Laptop Kamu**
    - Buka terminal di folder project `fik-stream`.
    - Jalankan perintah:
      ```bash
      npm run build
      ```
    - Tunggu sampai selesai. Nanti akan muncul folder baru bernama **`dist`** di dalam folder project kamu.

2.  **Upload ke Netlify**
    - Login ke [Netlify Drop](https://app.netlify.com/drop).
    - **Tarik (Drag & Drop)** folder **`dist`** tadi ke area upload di browser.
    - Tunggu sebentar... dan website langsung online!

---

## ❓ Masalah Umum (Troubleshooting)

**Q: Pas buka halaman selain Home lalu di-refresh kok 404 Not Found?**
**A:** Pastikan file `public/_redirects` ada dan isinya benar. Jika kamu deploy manual, pastikan folder `dist` yang diupload berisi file `_redirects` tersebut (otomatis tercopy saat build).

**Q: Gambar tidak muncul?**
**A:** Pastikan file gambar ada di folder `src/assets` dan di-import dengan benar di file `.jsx`. Atau jika di folder `public`, aksesnya langsung `/nama-gambar.png`.
