"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const prisma = new client_1.PrismaClient();
function loadGeoJSON(filename) {
    const filePath = path.join(__dirname, '../../data', filename);
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
}
async function main() {
    console.log('🌱 Starting seed...\n');
    await prisma.report.deleteMany();
    await prisma.evacuationPoint.deleteMany();
    await prisma.disasterZone.deleteMany();
    await prisma.weatherAlert.deleteMany();
    await prisma.user.deleteMany();
    console.log('✓ Cleared existing data\n');
    console.log('👤 Creating users...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);
    const admin = await prisma.user.create({
        data: {
            email: 'admin@georisk.bandung.go.id',
            password: adminPassword,
            name: 'Administrator GeoRisk',
            phone: '081234567890',
            role: client_1.Role.ADMIN,
        },
    });
    const user = await prisma.user.create({
        data: {
            email: 'user@example.com',
            password: userPassword,
            name: 'Pengguna Demo',
            phone: '089876543210',
            role: client_1.Role.USER,
        },
    });
    console.log(`  ✓ Created admin: ${admin.email}`);
    console.log(`  ✓ Created user: ${user.email}\n`);
    console.log('🗺️ Importing disaster zones from GeoJSON...');
    const floodData = loadGeoJSON('flood_zones.geojson');
    for (const feature of floodData.features) {
        await prisma.disasterZone.create({
            data: {
                name: feature.properties.name,
                type: client_1.DisasterType.FLOOD,
                riskLevel: feature.properties.riskLevel,
                description: feature.properties.description,
                geometry: feature.geometry,
                centroid: {
                    type: 'Point',
                    coordinates: calculateCentroid(feature.geometry.coordinates[0]),
                },
                area: feature.properties.area,
                population: feature.properties.population,
                kelurahan: feature.properties.kelurahan,
                kecamatan: feature.properties.kecamatan,
                mitigation: feature.properties.mitigation,
            },
        });
    }
    console.log(`  ✓ Imported ${floodData.features.length} flood zones`);
    const earthquakeData = loadGeoJSON('earthquake_zones.geojson');
    for (const feature of earthquakeData.features) {
        await prisma.disasterZone.create({
            data: {
                name: feature.properties.name,
                type: client_1.DisasterType.EARTHQUAKE,
                riskLevel: feature.properties.riskLevel,
                description: feature.properties.description,
                geometry: feature.geometry,
                centroid: {
                    type: 'Point',
                    coordinates: calculateCentroid(feature.geometry.coordinates[0]),
                },
                area: feature.properties.area,
                population: feature.properties.population,
                kelurahan: feature.properties.kelurahan,
                kecamatan: feature.properties.kecamatan,
                mitigation: feature.properties.mitigation,
            },
        });
    }
    console.log(`  ✓ Imported ${earthquakeData.features.length} earthquake zones`);
    const landslideData = loadGeoJSON('landslide_zones.geojson');
    for (const feature of landslideData.features) {
        await prisma.disasterZone.create({
            data: {
                name: feature.properties.name,
                type: client_1.DisasterType.LANDSLIDE,
                riskLevel: feature.properties.riskLevel,
                description: feature.properties.description,
                geometry: feature.geometry,
                centroid: {
                    type: 'Point',
                    coordinates: calculateCentroid(feature.geometry.coordinates[0]),
                },
                area: feature.properties.area,
                population: feature.properties.population,
                kelurahan: feature.properties.kelurahan,
                kecamatan: feature.properties.kecamatan,
                mitigation: feature.properties.mitigation,
            },
        });
    }
    console.log(`  ✓ Imported ${landslideData.features.length} landslide zones\n`);
    console.log('🏥 Importing evacuation points...');
    const evacuationData = loadGeoJSON('evacuation_points.geojson');
    for (const feature of evacuationData.features) {
        await prisma.evacuationPoint.create({
            data: {
                name: feature.properties.name,
                address: feature.properties.address,
                latitude: feature.geometry.coordinates[1],
                longitude: feature.geometry.coordinates[0],
                capacity: feature.properties.capacity,
                facilities: feature.properties.facilities,
                phone: feature.properties.phone,
            },
        });
    }
    console.log(`  ✓ Imported ${evacuationData.features.length} evacuation points\n`);
    console.log('📝 Creating sample reports...');
    const sampleReports = [
        {
            title: 'Genangan Air di Jl. Soekarno Hatta',
            description: 'Terdapat genangan air setinggi 30cm di depan Mall Metro Indah akibat hujan lebat semalam.',
            type: client_1.DisasterType.FLOOD,
            latitude: -6.9356,
            longitude: 107.5912,
            address: 'Jl. Soekarno Hatta, depan MIM',
            severity: 2,
            userId: user.id,
        },
        {
            title: 'Retakan Tanah di Dago Atas',
            description: 'Ditemukan retakan tanah sepanjang 5 meter di area perumahan. Warga khawatir longsor.',
            type: client_1.DisasterType.LANDSLIDE,
            latitude: -6.8623,
            longitude: 107.6134,
            address: 'Jl. Dago Atas, dekat Universitas',
            severity: 4,
            userId: user.id,
        },
        {
            title: 'Banjir di Underpass Cibiru',
            description: 'Underpass Cibiru terendam banjir setinggi 50cm. Kendaraan roda dua tidak bisa melintas.',
            type: client_1.DisasterType.FLOOD,
            latitude: -6.9267,
            longitude: 107.7189,
            address: 'Underpass Cibiru',
            severity: 3,
            userId: admin.id,
        },
    ];
    for (const report of sampleReports) {
        await prisma.report.create({ data: report });
    }
    console.log(`  ✓ Created ${sampleReports.length} sample reports\n`);
    console.log('⚠️ Creating sample weather alerts...');
    await prisma.weatherAlert.create({
        data: {
            title: 'Peringatan Hujan Lebat',
            description: 'BMKG memperkirakan hujan lebat disertai petir dan angin kencang di wilayah Bandung Raya untuk 3 hari ke depan.',
            type: client_1.DisasterType.FLOOD,
            severity: 3,
            startTime: new Date(),
            endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            affectedAreas: ['Dayeuhkolot', 'Baleendah', 'Gedebage', 'Cibiru'],
            source: 'BMKG',
            isActive: true,
        },
    });
    console.log('  ✓ Created 1 weather alert\n');
    const counts = {
        users: await prisma.user.count(),
        disasterZones: await prisma.disasterZone.count(),
        evacuationPoints: await prisma.evacuationPoint.count(),
        reports: await prisma.report.count(),
        weatherAlerts: await prisma.weatherAlert.count(),
    };
    console.log('📊 Seed Summary:');
    console.log(`   Users: ${counts.users}`);
    console.log(`   Disaster Zones: ${counts.disasterZones}`);
    console.log(`   Evacuation Points: ${counts.evacuationPoints}`);
    console.log(`   Reports: ${counts.reports}`);
    console.log(`   Weather Alerts: ${counts.weatherAlerts}`);
    console.log('\n✅ Seed completed successfully!');
}
function calculateCentroid(coordinates) {
    let sumX = 0;
    let sumY = 0;
    const n = coordinates.length;
    for (const coord of coordinates) {
        sumX += coord[0];
        sumY += coord[1];
    }
    return [sumX / n, sumY / n];
}
main()
    .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map