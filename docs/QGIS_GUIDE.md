# Panduan Menggunakan QGIS untuk GeoRisk Indonesia

## 📋 Pendahuluan

Dokumen ini menjelaskan cara menggunakan QGIS untuk mengedit, membuat, dan mengekspor data geospasial untuk WebGIS GeoRisk Indonesia.

## 🔧 Prasyarat

- **QGIS** versi 3.x atau lebih baru (download di [qgis.org](https://qgis.org))
- Data shapefile atau GeoJSON yang akan diedit

---

## 📥 1. Mengimpor Data ke QGIS

### 1.1 Membuka File GeoJSON

1. Buka QGIS
2. Klik menu **Layer** → **Add Layer** → **Add Vector Layer**
3. Pilih **Source type**: File
4. Klik **Browse** dan pilih file GeoJSON dari folder `data/`:
   - `flood_zones.geojson`
   - `earthquake_zones.geojson`
   - `landslide_zones.geojson`
   - `evacuation_points.geojson`
5. Klik **Add**

### 1.2 Membuka Shapefile dari BNPB/InaRISK

1. Download shapefile dari:
   - [InaRISK BNPB](https://inarisk.bnpb.go.id)
   - [Geoportal BNPB](https://gis.bnpb.go.id)
   - [BIG/Tanahair](https://tanahair.indonesia.go.id)
2. Ekstrak file ZIP
3. Di QGIS, klik **Layer** → **Add Layer** → **Add Vector Layer**
4. Pilih file `.shp`
5. Klik **Add**

---

## 🎨 2. Styling Layer

### 2.1 Styling Zona Bencana (Polygon)

1. Klik kanan layer → **Properties**
2. Pilih tab **Symbology**
3. Pilih **Categorized**
4. Untuk kolom, pilih `type` atau `riskLevel`
5. Klik **Classify**
6. Atur warna sesuai standar:

| Jenis Bencana | Warna |
|---------------|-------|
| FLOOD (Banjir) | Biru (#3B82F6) |
| EARTHQUAKE (Gempa) | Merah (#EF4444) |
| LANDSLIDE (Longsor) | Orange (#F59E0B) |

| Tingkat Risiko | Warna Border |
|----------------|--------------|
| LOW | Hijau (#22C55E) |
| MEDIUM | Kuning (#EAB308) |
| HIGH | Orange (#F97316) |
| CRITICAL | Merah (#DC2626) |

---

## ✏️ 3. Mengedit Data

### 3.1 Menambah Zona Baru

1. Pilih layer yang ingin diedit
2. Klik **Toggle Editing** (ikon pensil)
3. Klik **Add Polygon Feature**
4. Gambar polygon dengan klik pada peta
5. Klik kanan untuk selesai
6. Isi atribut di form:
   - `name`: Nama zona
   - `type`: FLOOD / EARTHQUAKE / LANDSLIDE
   - `riskLevel`: LOW / MEDIUM / HIGH / CRITICAL
   - `description`: Deskripsi kondisi
   - `kecamatan`: Nama kecamatan
   - `population`: Estimasi populasi

### 3.2 Mengedit Zona Existing

1. Aktifkan Toggle Editing
2. Gunakan **Vertex Tool** untuk mengubah bentuk polygon
3. Klik **Identify Features** untuk edit atribut

### 3.3 Menyimpan Perubahan

1. Klik **Save Layer Edits**
2. Klik **Toggle Editing** untuk menonaktifkan mode edit

---

## 📤 4. Mengekspor ke GeoJSON

### 4.1 Export Layer

1. Klik kanan layer → **Export** → **Save Features As...**
2. Format: **GeoJSON**
3. File name: pilih lokasi penyimpanan
4. CRS: **EPSG:4326 - WGS 84**
5. Opsi:
   - ✅ Add saved file to map
6. Klik **OK**

### 4.2 Export dengan Field Tertentu

Jika hanya ingin menyertakan field tertentu:
1. Di dialog Export, buka **Select fields to export**
2. Centang hanya field yang diperlukan:
   - `name`
   - `type`
   - `riskLevel`
   - `description`
   - `area`
   - `population`
   - `kelurahan`
   - `kecamatan`
   - `mitigation`

---

## 🗺️ 5. Membuat Data Baru

### 5.1 Membuat Layer Baru

1. Menu **Layer** → **Create Layer** → **New GeoJSON Layer**
2. Isi:
   - File name: nama file output
   - Geometry type: **Polygon** (untuk zona) atau **Point** (untuk titik evakuasi)
   - CRS: **EPSG:4326**
3. Tambahkan field sesuai struktur:

| Field Name | Type | Description |
|------------|------|-------------|
| name | Text | Nama zona |
| type | Text | FLOOD/EARTHQUAKE/LANDSLIDE |
| riskLevel | Text | LOW/MEDIUM/HIGH/CRITICAL |
| description | Text | Deskripsi kondisi |
| area | Decimal | Luas dalam km² |
| population | Integer | Jumlah populasi |
| kelurahan | Text | Nama kelurahan |
| kecamatan | Text | Nama kecamatan |
| mitigation | Text | Saran mitigasi |

4. Klik **OK**

### 5.2 Digitasi dari Basemap

1. Tambahkan basemap: **Web** → **QuickMapServices** → **OSM** → **OSM Standard**
2. Zoom ke area Bandung (koordinat: -6.9175, 107.6191)
3. Toggle Editing pada layer baru
4. Gambar polygon berdasarkan referensi basemap

---

## 🔄 6. Integrasi dengan WebGIS

### 6.1 Update Data di Aplikasi

1. Export layer dari QGIS sebagai GeoJSON
2. Pindahkan file ke folder `project_webgis_opil/data/`
3. Nama file harus sesuai:
   - `flood_zones.geojson`
   - `earthquake_zones.geojson`
   - `landslide_zones.geojson`
   - `evacuation_points.geojson`
4. Jalankan ulang seed database:
   ```bash
   cd backend
   npm run prisma:seed
   ```

### 6.2 Validasi Data

Pastikan GeoJSON memiliki struktur:
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Nama Zona",
        "type": "FLOOD",
        "riskLevel": "HIGH",
        ...
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[lng, lat], ...]]
      }
    }
  ]
}
```

---

## 📚 Sumber Data Resmi

| Sumber | URL | Data |
|--------|-----|------|
| InaRISK BNPB | https://inarisk.bnpb.go.id | Peta risiko bencana |
| Geoportal BNPB | https://gis.bnpb.go.id | Layanan GIS bencana |
| BIG/Tanahair | https://tanahair.indonesia.go.id | Peta dasar RBI |
| Open Data Bandung | https://data.bandung.go.id | Data spasial Bandung |
| Geofabrik OSM | https://download.geofabrik.de | Data OpenStreetMap |

---

## ⚠️ Catatan Penting

1. Selalu gunakan sistem koordinat **WGS 84 (EPSG:4326)** untuk web mapping
2. Pastikan **geometry valid** sebelum export (gunakan **Vector** → **Geometry Tools** → **Fix geometries**)
3. Backup data sebelum melakukan edit besar
4. Koordinat format: **[longitude, latitude]** (bukan lat, lng)
