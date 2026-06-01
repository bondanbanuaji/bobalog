# 🧋 Bobalog — Local Development Setup

Panduan ini akan membantu kamu menjalankan project Bobalog di environment lokal.

## 1. Persiapan Tools
Pastikan di komputer kamu sudah terinstall:
- **Node.js** (Minimal v18, disarankan v20+)
- **npm** atau **pnpm** (Project ini menggunakan npm by default)
- **Git**

## 2. Clone Repository & Install Dependency
```bash
git clone https://github.com/username/bobalog.git
cd bobalog

# Install semua package
npm install
```

## 3. Setup Environment Variables
Agar aplikasi berjalan sempurna dengan database dan auth, kamu perlu membuat file `.env.local`.

1. Copy file `.env.example` menjadi `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Isi credential API keys yang dibutuhkan di `.env.local`. Karena saat ini kita masih menggunakan **mock data** (data dummy dari `lib/mock-data.ts`), aplikasi *masih bisa jalan* walaupun env keys belum diisi secara penuh. Tapi untuk full functionality (nanti), pastikan kamu mengisi:
   - **Clerk:** Untuk autentikasi user.
   - **Supabase (PostgreSQL):** Untuk database produk & wishlist.
   - **Upstash (Redis):** Untuk rate-limiting dan cache produk.
   - **Cloudinary:** Untuk menyimpan gambar thumbnail.

## 4. Menjalankan Aplikasi
Jalankan development server:
```bash
npm run dev
```
Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000).

---

## 🚀 Deployment ke Vercel

Bobalog menggunakan **Next.js 15 (App Router)** dan sudah 100% siap untuk di-deploy ke Vercel tanpa perlu konfigurasi khusus. 

### Langkah Deploy:
1. Push kodingan ini ke repository GitHub.
2. Login ke dashboard [Vercel](https://vercel.com/).
3. Klik **Add New... > Project**.
4. Import repository GitHub Bobalog kamu.
5. Vercel akan otomatis mendeteksi framework sebagai **Next.js**.
6. Di menu **Environment Variables** Vercel, *copas* semua key yang ada di `.env.local` kamu ke Vercel.
7. Klik **Deploy** dan tunggu proses build selesai (sekitar 1-2 menit).
8. Selesai! Web kamu live. 🎉
