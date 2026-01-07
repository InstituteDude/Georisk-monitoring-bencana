# Panduan Instalasi Lengkap GeoRisk Indonesia
## Untuk Pemula dari Nol

Panduan ini menjelaskan cara menjalankan aplikasi GeoRisk **dari komputer kosong** hingga aplikasi berjalan sempurna.

---

## Daftar Isi

1. [Persyaratan Sistem](#-persyaratan-sistem)
2. [Langkah 1: Install Node.js](#langkah-1-install-nodejs)
3. [Langkah 2: Install PostgreSQL](#langkah-2-install-postgresql)
4. [Langkah 3: Setup Database](#langkah-3-setup-database)
5. [Langkah 4: Setup Backend](#langkah-4-setup-backend)
6. [Langkah 5: Setup Frontend](#langkah-5-setup-frontend)
7. [Langkah 6: Menjalankan Aplikasi](#langkah-6-menjalankan-aplikasi)
8. [Troubleshooting](#-troubleshooting)

---

## Persyaratan Sistem

| Komponen | Minimum | Rekomendasi |
|----------|---------|-------------|
| OS | Windows 10 / Ubuntu 20.04 / macOS 12 | Windows 11 / Ubuntu 22.04 |
| RAM | 4 GB | 8 GB+ |
| Disk Space | 5 GB | 10 GB+ |
| Internet | Diperlukan untuk instalasi | Stabil |

---

## Langkah 1: Install Node.js

Node.js adalah runtime untuk menjalankan JavaScript di komputer.

### Windows

1. Buka **https://nodejs.org**
2. Download versi **LTS** (Long Term Support) - pilih yang bertuliskan "Recommended"
3. Jalankan installer yang terdownload (`.msi` file)
4. Ikuti wizard instalasi (klik Next terus sampai selesai)
5. **Restart komputer** setelah instalasi selesai

### Verifikasi Instalasi

Buka **Command Prompt** (tekan `Win + R`, ketik `cmd`, Enter) dan jalankan:

```bash
node --version
npm --version
```

Jika muncul nomor versi (contoh: `v20.10.0`), instalasi berhasil!

**Jika error "node is not recognized"**: Restart komputer Anda dan coba lagi.

---

## Langkah 2: Install PostgreSQL

PostgreSQL adalah database yang digunakan aplikasi ini.

### Windows

1. Buka **https://www.postgresql.org/download/windows/**
2. Klik **Download the installer**
3. Pilih versi terbaru (misal 16.x)
4. Download dan jalankan installer

### Saat Instalasi

1. **Pilih komponen**: Centang semua (PostgreSQL Server, pgAdmin 4, Command Line Tools)
2. **Directory**: Biarkan default
3. **Password**: Masukkan password, **INGAT PASSWORD INI!** (contoh: `postgres123`)
4. **Port**: Biarkan default `5432`
5. **Locale**: Pilih sesuai bahasa Anda atau biarkan default
6. Klik Install dan tunggu selesai

### Verifikasi Instalasi

1. Buka aplikasi **pgAdmin 4** (cari di Start Menu)
2. Jika diminta password, masukkan password yang tadi dibuat
3. Jika berhasil masuk, PostgreSQL sudah terinstall!

---

## Langkah 3: Setup Database

### A. Buat Database Baru

1. Buka **pgAdmin 4**
2. Di panel kiri, klik kanan **Databases** → **Create** → **Database**
3. Masukkan nama: `georisk_bandung`
4. Klik **Save**

### B. Aktifkan PostGIS Extension

PostGIS memungkinkan database menyimpan data geografis.

1. Di pgAdmin, klik database `georisk_bandung`
2. Klik ikon **Query Tool** (gambar tabel dengan pensil)
3. Paste dan jalankan query ini:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

4. Tekan **F5** atau klik tombol ▶️ (Execute)
5. Jika muncul pesan sukses, PostGIS aktif!

**Jika PostGIS error**: Anda mungkin perlu download installer PostGIS terpisah dari https://postgis.net/install/ dan install sesuai versi PostgreSQL.

---

## Langkah 4: Setup Backend

### A. Buka Command Prompt di Folder Backend

1. Buka **File Explorer**
2. Navigasi ke folder `project_webgis_opil\backend`
3. Klik di address bar, ketik `cmd`, tekan Enter
4. Akan terbuka Command Prompt di folder backend

### B. Install Dependencies

```bash
npm install
```

Proses ini membutuhkan beberapa menit. Abaikan warning (kuning), hanya perhatikan error (merah).

### C. Setup Environment Variables

1. Di folder `backend`, cari file `.env.example`
2. **Copy** file tersebut dan rename menjadi `.env`
3. Buka file `.env` dengan Notepad
4. Edit `DATABASE_URL` sesuai password PostgreSQL Anda:

```env
DATABASE_URL="postgresql://postgres:PASSWORD_ANDA@localhost:5432/georisk_bandung?schema=public"
```

Contoh jika password = `postgres123`:
```env
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/georisk_bandung?schema=public"
```

5. Simpan file

### D. Setup Prisma (Database Schema)

Jalankan perintah berikut satu per satu:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

> Jika diminta konfirmasi, ketik `y` dan Enter.

### E. Isi Data Awal (Seed)

```bash
npm run prisma:seed
```

Ini akan mengisi database dengan data zona bencana Bandung.

---

## Langkah 5: Setup Frontend

### A. Buka Command Prompt di Folder Frontend

1. Buka folder `project_webgis_opil\frontend`
2. Klik address bar, ketik `cmd`, tekan Enter

### B. Install Dependencies

```bash
npm install
```

### C. Setup Environment Variables

1. Cari file `env.example`
2. Copy dan rename menjadi `.env.local`
3. Buka dengan Notepad, isinya sudah benar:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

4. Simpan file

---

## Langkah 6: Menjalankan Aplikasi

### A. Jalankan Backend (Terminal 1)

Buka Command Prompt di folder `backend`:

```bash
npm run start:dev
```

Tunggu sampai muncul pesan:
```
[Nest] LOG [NestApplication] Nest application successfully started
```

**JANGAN TUTUP terminal ini!** Biarkan berjalan.

### B. Jalankan Frontend (Terminal 2)

Buka Command Prompt **BARU** di folder `frontend`:

```bash
npm run dev
```

Tunggu sampai muncul pesan:
```
✓ Ready in XXXms
- Local: http://localhost:3000
```

### C. Buka Aplikasi

1. Buka browser (Chrome/Firefox/Edge)
2. Ketik di address bar: **http://localhost:3000**
3. Aplikasi GeoRisk akan terbuka! 🎉

---

Akun Default

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@georisk.bandung.go.id` | `admin123` |
| User | `user@example.com` | `user123` |

---

### Troubleshooting

Error: "npm is not recognized"
**Solusi**: Node.js belum terinstall dengan benar. Restart komputer dan coba lagi.

### Error: "ECONNREFUSED" atau "Connection refused"
**Solusi**: PostgreSQL tidak berjalan. Buka Services (Win+R → `services.msc`) dan pastikan `postgresql-x64-XX` berstatus Running.

### Error: "Database does not exist"
**Solusi**: Database belum dibuat. Ikuti kembali Langkah 3.

### Error: "Port 3000/3001 already in use"
**Solusi**: Ada aplikasi lain menggunakan port tersebut. Tutup aplikasi lain atau restart komputer.

### Error saat prisma migrate
**Solusi**: Cek DATABASE_URL di file `.env`. Pastikan password PostgreSQL benar.

### Halaman blank atau error CORS
**Solusi**: Pastikan backend berjalan di terminal 1. Cek apakah ada error merah di terminal.

---

## Struktur Folder Project

```
project_webgis_opil/
├── backend/           ← Server API (NestJS)
│   ├── src/           ← Source code
│   ├── prisma/        ← Database schema & seeder
│   └── .env           ← Konfigurasi (BUAT SENDIRI)
├── frontend/          ← Website (Next.js)
│   ├── src/           ← Source code
│   └── .env.local     ← Konfigurasi (BUAT SENDIRI)
├── data/              ← File GeoJSON zona bencana
└── docs/              ← Dokumentasi QGIS
```

---

## 🎯 Checklist Sukses

- [ ] Node.js terinstall (`node --version` menampilkan versi)
- [ ] PostgreSQL terinstall dan berjalan
- [ ] Database `georisk_bandung` sudah dibuat
- [ ] PostGIS extension aktif
- [ ] File `.env` di backend sudah dikonfigurasi
- [ ] File `.env.local` di frontend sudah ada
- [ ] Backend berjalan tanpa error di port 3001
- [ ] Frontend berjalan tanpa error di port 3000
- [ ] Bisa login dengan akun admin

---
