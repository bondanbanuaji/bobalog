# 🔑 Panduan Mendapatkan API Keys untuk Bobalog

Project **Bobalog** membutuhkan beberapa third-party services agar bisa berjalan secara *full stack*. Berikut adalah panduan lengkap cara mendapatkan semua environment variables yang dibutuhkan untuk file `.env.local` kamu.

---

## 1. Clerk (Autentikasi User)

Bobalog menggunakan Clerk untuk sistem login, sign up, dan session management.

1. Buka [clerk.com](https://clerk.com/) dan buat akun/login.
2. Klik **"Add Application"**.
3. Beri nama aplikasi (misal: "Bobalog").
4. Pilih metode autentikasi yang diinginkan (sangat disarankan memilih **Email address** dan **Google** sesuai dengan desain UI Bobalog).
5. Klik **Create Application**.
6. Di dashboard aplikasi Clerk kamu, masuk ke menu **API Keys**.
7. Copy bagian **Publishable Key** dan **Secret Key** khusus untuk environment *Development*.
8. Paste ke `.env.local`:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```



## 2. Supabase (Database PostgreSQL)

Bobalog menggunakan Prisma ORM yang dicolok ke database Supabase (PostgreSQL).

1. Buka [supabase.com](https://supabase.com/) dan buat akun/login.
2. Klik **"New Project"**.
3. Pilih organisasi kamu, isi *Name* dengan "Bobalog DB", dan buat *Database Password* yang kuat. Pilih region terdekat (misalnya Singapore).
4. Klik **Create New Project** (tunggu beberapa menit sampai setup selesai).
5. Masuk ke dashboard project, klik menu **Project Settings** (ikon gerigi di kiri bawah), lalu pilih **Database**.
6. Scroll ke bagian **Connection String** -> pilih tab **URI**.
7. Supabase menggunakan fitur *Connection Pooling* secara default sekarang (port 6543) dan direct connection (port 5432).
8. Copy Transaction URI (port 6543) untuk `DATABASE_URL` dan Session/Direct URI (port 5432) untuk `DIRECT_URL`. Jangan lupa ganti tag `[YOUR-PASSWORD]` dengan password yang kamu buat di langkah ke-3.
9. Paste ke `.env.local`:
   ```env
   DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
   ```

*(Setelah mendapat key, kamu bisa menjalankan `npx prisma db push` untuk membuat tabel-tabel database Bobalog).*

---

## 3. Upstash Redis (Cache & Rate Limiting)

Redis digunakan untuk me-rate limit public API collection dan menyimpan sementara request scraping agar tidak *spamming*.

1. Buka [upstash.com](https://upstash.com/) dan buat akun/login.
2. Masuk ke console dan klik **Create Database** pada bagian Redis.
3. Beri nama (misal: "bobalog-cache"), pilih region terdekat (Singapore), dan klik **Create**.
4. Di halaman detail database tersebut, scroll sedikit ke bagian **REST API**.
5. Copy **UPSTASH_REDIS_REST_URL** dan **UPSTASH_REDIS_REST_TOKEN**.
6. Paste ke `.env.local`:
   ```env
   UPSTASH_REDIS_REST_URL=https://...
   UPSTASH_REDIS_REST_TOKEN=...
   ```

---

## 4. Cloudinary (Image Storage)

Kita butuh Cloudinary untuk menampung gambar *thumbnail* produk dari Shopee karena hotlinking image dari shopee kadang akan terblokir oleh CORS/expire.

1. Buka [cloudinary.com](https://cloudinary.com/) dan daftar akun gratis.
2. Masuk ke dashboard Cloudinary, dan lihat pada bagian **Product Environment Credentials** di halaman utama (atau di menu Settings -> API Keys).
3. Kamu akan melihat *Cloud Name*, *API Key*, dan *API Secret*.
4. Paste ke `.env.local`:
   ```env
   CLOUDINARY_CLOUD_NAME=nama_cloud_kamu
   CLOUDINARY_API_KEY=1234567890
   CLOUDINARY_API_SECRET=abc123xyz_...
   ```

### Selesai! 🎉
Kalau semua kunci sudah lengkap di `.env.local`, aplikasi Bobalog kamu siap beroperasi dengan kapasitas produksi 100%!
