# 🌍 GeoRisk Indonesia

## Sistem Informasi Geografis Pemetaan Risiko Bencana Alam Kota Bandung

**GeoRisk Indonesia** adalah aplikasi WebGIS (Web Geographic Information System) untuk memantau dan memetakan zona rawan bencana alam di Kota Bandung. Sistem ini mencakup pemetaan zona rawan **banjir**, **gempa bumi**, dan **tanah longsor**.

![GeoRisk Dashboard](https://via.placeholder.com/800x400?text=GeoRisk+Dashboard)

---

## ✨ Fitur Utama

- 🗺️ **Peta Interaktif** - Visualisasi zona bencana dengan layer toggle
- 📊 **Dashboard Statistik** - Ringkasan data zona dan populasi terdampak
- 📱 **Monitoring Real-time** - Pantau laporan bencana dari masyarakat
- 📝 **Form Pelaporan** - Warga dapat melaporkan kejadian bencana
- 👤 **Panel Admin** - Kelola data zona, laporan, dan pengguna
- 🏥 **Titik Evakuasi** - Lokasi tempat aman saat bencana

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, React, TypeScript, Tailwind CSS |
| **Backend** | NestJS, Prisma ORM, JWT Authentication |
| **Database** | PostgreSQL + PostGIS |
| **Maps** | Leaflet, OpenStreetMap |
| **Charts** | Recharts |

---

## 📁 Struktur Project

```
project_webgis_opil/
├── frontend/           # Next.js Frontend
│   ├── src/
│   │   ├── app/        # Pages (Dashboard, Map, Monitoring, Report, Admin)
│   │   ├── components/ # React Components (Map, Layout, Dashboard)
│   │   └── lib/        # Utilities & API
│   └── package.json
│
├── backend/            # NestJS Backend
│   ├── src/
│   │   ├── auth/       # JWT Authentication
│   │   ├── disasters/  # Disaster zones API
│   │   ├── reports/    # User reports API
│   │   ├── evacuation/ # Evacuation points API
│   │   └── prisma/     # Database service
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts     # Database seeder
│   └── package.json
│
├── data/               # GeoJSON Data Files
│   ├── flood_zones.geojson
│   ├── earthquake_zones.geojson
│   ├── landslide_zones.geojson
│   ├── evacuation_points.geojson
│   └── bandung_boundary.geojson
│
└── docs/               # Documentation
    └── QGIS_GUIDE.md
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ dengan PostGIS
- QGIS (opsional, untuk edit data geospasial)

### 1. Setup Database

```bash
# Buat database
createdb georisk_bandung

# Aktifkan PostGIS
psql georisk_bandung -c "CREATE EXTENSION postgis;"
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env dan sesuaikan DATABASE_URL

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database
npm run prisma:seed

# Start development server
npm run start:dev
```

Backend berjalan di: `http://localhost:3001`

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp env.example .env.local
# Edit jika perlu

# Start development server
npm run dev
```

Frontend berjalan di: `http://localhost:3000`

---

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/disasters` | GET | List semua zona bencana |
| `/api/disasters/geojson` | GET | Data GeoJSON untuk peta |
| `/api/disasters/statistics` | GET | Statistik dashboard |
| `/api/reports` | GET/POST | Daftar/buat laporan bencana |
| `/api/evacuation` | GET | Titik evakuasi |
| `/api/auth/login` | POST | Login user |
| `/api/auth/register` | POST | Registrasi user |

---

## 🗺️ Data Bencana

Data zona bencana dalam project ini dibuat berdasarkan referensi:
- **InaRISK BNPB** - Portal risiko bencana nasional
- **Data geografis** - Karakteristik topografi Bandung
- **Histori bencana** - Kejadian banjir, longsor di wilayah tertentu

### Zona Banjir (6 area)
- Dayeuhkolot-Baleendah (DAS Citarum)
- Cibiru-Ujungberung
- Gedebage
- Dan lainnya

### Zona Gempa (5 area)
- Sesar Lembang (zona utama)
- Bandung Utara (amplifikasi)
- Bandung Tengah (cekungan)
- Dan lainnya

### Zona Longsor (6 area)
- Lembang (lereng Tangkuban Parahu)
- Dago Atas - Ciumbuleuit
- Punclut - Ciburial
- Dan lainnya

---

## 🔧 Penggunaan QGIS

Untuk mengedit data geospasial, lihat panduan lengkap di:
📖 [docs/QGIS_GUIDE.md](docs/QGIS_GUIDE.md)

---

## 🔐 Default Users

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@georisk.bandung.go.id | admin123 |
| User | user@example.com | user123 |

---

## 📜 License

MIT License - Project ini untuk keperluan akademik/pendidikan.

---

## 🤝 Contributing

Kontribusi sangat diterima! Silakan buat issue atau pull request.

---

## 📞 Contact

- **Developer**: [Your Name]
- **Institution**: [University Name]
- **Project**: Enrichment Project WebGIS Pemetaan Risiko Bencana
