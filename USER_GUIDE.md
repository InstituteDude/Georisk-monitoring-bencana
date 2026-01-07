# Panduan Pengguna Sistem Informasi Geografis Risiko Bencana (GeoRisk)

Selamat datang di GeoRisk, platform pemetaan risiko bencana interaktif untuk Kota Bandung. Panduan ini akan membantu Anda memahami dan menggunakan fitur-fitur canggih yang tersedia.

## ✨ Keunggulan Fitur

1. **Peta Interaktif Real-time**: Jelajahi zona rawan bencana (Banjir, Gempa, Longsor) dengan data visual yang akurat.
2. **Identifikasi Cerdas**: Klik di mana saja pada peta untuk mengetahui risiko bencana di titik tersebut secara instan (terkoneksi langsung ke database analisis).
3. **Pelaporan Masyarakat**: Partisipasi aktif warga dalam melaporkan kejadian bencana dengan geo-tagging otomatis.
4. **Navigasi Evakuasi**: Temukan jalur dan titik evakuasi terdekat saat keadaan darurat.
5. **Dashboard Statistik**: Pantau ringkasan data kejadian dan risiko melalui grafik yang mudah dipahami.

---

## 📖 Panduan Penggunaan (Masyarakat Umum)

### 1. Menjelajahi Peta

* **Zoom & Pan**: Gunakan mouse atau dua jari untuk memperbesar/memperkecil dan menggeser peta.
* **Layer Bencana**: Gunakan panel di kiri atas untuk menyaring jenis bencana (misal: hanya tampilkan "Banjir").
* **Identifikasi Zona**: Klik pada area berwarna untuk melihat detail zona (Nama Wilayah, Level Risiko, Populasi Terdampak).
* **Cek Lokasi Saya**: Klik tombol GPS (pojok kanan bawah) untuk melihat risiko di posisi Anda saat ini.

### 2. Melakukan Pelaporan

1. Pastikan Anda sudah **Login** (Daftar akun jika belum punya).
2. Buka menu **Lapor**.
3. Isi formulir laporan (Judul, Deskripsi, Upload Foto).
4. Lokasi akan mendeteksi posisi Anda otomatis, atau Anda bisa memilih titik manual di peta.
5. Klik **Kirim Laporan**. Laporan Anda akan diverifikasi oleh admin.

### 3. Mengelola Profil

1. Klik foto profil di pojok kanan atas.
2. Pilih **Profil Saya** untuk melihat data diri.
3. Pilih **Pengaturan** untuk mengubah Password demi keamanan akun Anda.

---

## 🛡️ Panduan Administrator (Admin)

### 1. Mengelola Data Bencana

1. Masuk ke **Dashboard Admin**.
2. Pilih menu **Manajemen Data**.
3. Anda dapat **Menambah**, **Mengedit**, atau **Menghapus** zona bencana.
4. Setiap perubahan akan langsung terupdate di peta publik secara real-time.

### 2. Verifikasi Laporan

1. Buka menu **Laporan Masuk**.
2. Tinjau laporan dari warga (Foto & Deskripsi).
3. Ubah status menjadi **Verifikasi** (Valid), **Dalam Penanganan**, atau **Selesai**.
4. Laporan yang diverifikasi akan muncul sebagai titik indikator di peta umum.

---

## 🚀 Cara Menjalankan Aplikasi (Teknis)

Jika Anda adalah tim teknis yang ingin menjalankan sistem ini:

### Prasyarat

* Node.js (v18+)
* PostgreSQL (dengan ekstensi PostGIS)

### Langkah-langkah

1. **Backend**:
   ```bash
   cd backend
   npm install
   npx prisma migrate deploy  # Setup database
   npm run start:prod         # Jalankan server
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run build              # Build untuk production
   npm start                  # Jalankan web server
   ```

---

## ⚠️ Checklist Keamanan & Produksi (Penting!)

Sebelum digunakan secara massal, pastikan hal berikut:

1. **Ganti Password Admin**: Jangan gunakan password default.
2. **Environment Variables**: Pastikan file `.env` di production menggunakan secret key yang kuat (jangan pakai "secret123").
3. **Backup Database**: Aktifkan backup berkala untuk database PostgreSQL.
4. **Rate Limiting**: (Rekomendasi) Pasang pembatasan request di server untuk mencegah serangan DDoS.

---

*Dibuat oleh Tim Pengembang GeoRisk*
