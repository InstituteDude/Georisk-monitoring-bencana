"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DisastersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisastersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DisastersService = class DisastersService {
    static { DisastersService_1 = this; }
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filter) {
        const { type, riskLevel, kecamatan, search, page = 1, limit = 50 } = filter;
        const skip = (page - 1) * limit;
        const where = {};
        if (type)
            where.type = type;
        if (riskLevel)
            where.riskLevel = riskLevel;
        if (kecamatan)
            where.kecamatan = { contains: kecamatan, mode: 'insensitive' };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { kecamatan: { contains: search, mode: 'insensitive' } },
                { kelurahan: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [data, total] = await Promise.all([
            this.prisma.disasterZone.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.disasterZone.count({ where }),
        ]);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const zone = await this.prisma.disasterZone.findUnique({ where: { id } });
        if (!zone)
            throw new common_1.NotFoundException(`Disaster zone with ID ${id} not found`);
        return zone;
    }
    async findByType(type) {
        return this.prisma.disasterZone.findMany({
            where: { type },
            orderBy: { riskLevel: 'desc' },
        });
    }
    async create(dto) {
        return this.prisma.disasterZone.create({ data: dto });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.disasterZone.update({
            where: { id },
            data: { ...dto, lastUpdated: new Date() },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.disasterZone.delete({ where: { id } });
    }
    async getAsGeoJSON(type, bbox) {
        const where = type ? { type } : {};
        const zones = await this.prisma.disasterZone.findMany({
            where,
            select: {
                id: true,
                name: true,
                type: true,
                riskLevel: true,
                description: true,
                geometry: true,
                centroid: true,
                area: true,
                population: true,
                kelurahan: true,
                kecamatan: true,
                mitigation: true,
            },
        });
        const filtered = bbox
            ? zones.filter((zone) => {
                const c = zone.centroid;
                if (!c?.coordinates)
                    return true;
                const [lng, lat] = c.coordinates;
                return lat >= bbox.minLat && lat <= bbox.maxLat && lng >= bbox.minLng && lng <= bbox.maxLng;
            })
            : zones;
        return {
            type: 'FeatureCollection',
            features: filtered.map((zone) => ({
                type: 'Feature',
                id: zone.id,
                properties: {
                    name: zone.name,
                    type: zone.type,
                    riskLevel: zone.riskLevel,
                    description: zone.description,
                    area: zone.area ? Math.round(zone.area * 100) / 100 : null,
                    population: zone.population,
                    kelurahan: zone.kelurahan,
                    kecamatan: zone.kecamatan,
                    mitigation: zone.mitigation,
                },
                geometry: zone.geometry,
            })),
        };
    }
    async identify(lat, lng) {
        const zones = await this.prisma.$queryRaw `
      SELECT id, name, type, "riskLevel"::text, description, area, population, kelurahan, kecamatan, mitigation
      FROM disaster_zones
      WHERE ST_Contains(
        geometry::geometry,
        ST_SetSRID(ST_MakePoint(${parseFloat(lng.toString())}, ${parseFloat(lat.toString())}), 4326)
      )
      LIMIT 1;
    `;
        return zones.length ? zones[0] : null;
    }
    async getStatistics() {
        const [totalZones, byType, byRiskLevel, totalPopulation] = await Promise.all([
            this.prisma.disasterZone.count(),
            this.prisma.disasterZone.groupBy({ by: ['type'], _count: { type: true } }),
            this.prisma.disasterZone.groupBy({ by: ['riskLevel'], _count: { riskLevel: true } }),
            this.prisma.disasterZone.aggregate({ _sum: { population: true } }),
        ]);
        return {
            totalZones,
            byType: byType.reduce((acc, item) => {
                acc[item.type] = item._count.type;
                return acc;
            }, {}),
            byRiskLevel: byRiskLevel.reduce((acc, item) => {
                acc[item.riskLevel] = item._count.riskLevel;
                return acc;
            }, {}),
            totalAffectedPopulation: totalPopulation._sum.population || 0,
        };
    }
    static SIMPLIFY_TOLERANCE = 0.005;
    static COORD_PRECISION = 4;
    static MIN_RING_AREA = 0.0001;
    pointSegDist(px, py, x1, y1, x2, y2) {
        const dx = x2 - x1, dy = y2 - y1;
        const len2 = dx * dx + dy * dy;
        if (len2 === 0)
            return Math.hypot(px - x1, py - y1);
        const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / len2));
        return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
    }
    dpSimplify(coords, tol) {
        if (coords.length <= 2)
            return coords;
        const [x1, y1] = coords[0];
        const [x2, y2] = coords[coords.length - 1];
        let maxDist = 0, maxIdx = 1;
        for (let i = 1; i < coords.length - 1; i++) {
            const d = this.pointSegDist(coords[i][0], coords[i][1], x1, y1, x2, y2);
            if (d > maxDist) {
                maxDist = d;
                maxIdx = i;
            }
        }
        if (maxDist > tol) {
            const left = this.dpSimplify(coords.slice(0, maxIdx + 1), tol);
            const right = this.dpSimplify(coords.slice(maxIdx), tol);
            return [...left.slice(0, -1), ...right];
        }
        return [coords[0], coords[coords.length - 1]];
    }
    simplifyRing(ring) {
        const p = 10 ** DisastersService_1.COORD_PRECISION;
        let prev = null;
        const rounded = [];
        for (const [x, y] of ring) {
            const rx = Math.round(x * p) / p;
            const ry = Math.round(y * p) / p;
            if (!prev || rx !== prev[0] || ry !== prev[1]) {
                rounded.push([rx, ry]);
                prev = [rx, ry];
            }
        }
        if (rounded.length < 4)
            return rounded;
        const simplified = this.dpSimplify(rounded, DisastersService_1.SIMPLIFY_TOLERANCE);
        if (simplified.length < 4)
            return rounded;
        const f = simplified[0], l = simplified[simplified.length - 1];
        if (f[0] !== l[0] || f[1] !== l[1])
            simplified.push([f[0], f[1]]);
        return simplified;
    }
    ringArea(ring) {
        let area = 0;
        for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
            area += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
        }
        return Math.abs(area) / 2;
    }
    simplifyGeometry(geometry) {
        if (!geometry?.type || !geometry?.coordinates)
            return geometry;
        if (geometry.type === 'Polygon') {
            return { ...geometry, coordinates: geometry.coordinates.map((ring) => this.simplifyRing(ring)) };
        }
        if (geometry.type === 'MultiPolygon') {
            const coords = geometry.coordinates
                .filter((poly) => poly[0] && this.ringArea(poly[0]) >= DisastersService_1.MIN_RING_AREA)
                .map((poly) => poly.map((ring) => this.simplifyRing(ring)));
            return { ...geometry, coordinates: coords.length ? coords : geometry.coordinates.slice(0, 1) };
        }
        return geometry;
    }
    skorTotalToRiskLevel(skor) {
        if (skor <= 1)
            return 'LOW';
        if (skor === 2)
            return 'MEDIUM';
        if (skor === 3)
            return 'HIGH';
        return 'CRITICAL';
    }
    resolveFeatureName(props, defaultType, index) {
        if (props?.name)
            return props.name;
        if (props?.NAME)
            return props.NAME;
        if (props?.NAMOBJ)
            return props.NAMOBJ;
        const label = { FLOOD: 'Banjir', EARTHQUAKE: 'Gempa', LANDSLIDE: 'Longsor' };
        const id = props?.OBJECTID ?? index + 1;
        return `Zona ${label[defaultType] || defaultType} #${id}`;
    }
    resolveRiskLevel(props) {
        if (props?.riskLevel)
            return props.riskLevel;
        if (props?.RISK)
            return props.RISK;
        if (props?.SkorTotal != null)
            return this.skorTotalToRiskLevel(Number(props.SkorTotal));
        if (props?.SKORTOTAL != null)
            return this.skorTotalToRiskLevel(Number(props.SKORTOTAL));
        return 'MEDIUM';
    }
    resolveArea(props) {
        if (props?.area != null)
            return parseFloat(props.area);
        if (props?.AREA != null)
            return parseFloat(props.AREA);
        if (props?.Shape_Area != null)
            return parseFloat(props.Shape_Area) / 1_000_000;
        if (props?.SHAPE_AREA != null)
            return parseFloat(props.SHAPE_AREA) / 1_000_000;
        return 0;
    }
    async analyzeGeoJSON(buffer, defaultType = 'FLOOD') {
        try {
            const geojson = JSON.parse(buffer.toString('utf-8'));
            if (geojson.type !== 'FeatureCollection' || !Array.isArray(geojson.features)) {
                throw new Error('Invalid GeoJSON format: Must be a FeatureCollection');
            }
            const features = geojson.features;
            const stats = {
                totalFeatures: features.length,
                byType: {},
                byRiskLevel: {},
                totalArea: 0,
                totalPopulation: 0,
                invalidGeometries: 0,
            };
            for (const feature of features) {
                const type = feature.properties?.type || defaultType;
                stats.byType[type] = (stats.byType[type] || 0) + 1;
                const risk = this.resolveRiskLevel(feature.properties);
                stats.byRiskLevel[risk] = (stats.byRiskLevel[risk] || 0) + 1;
                stats.totalArea += this.resolveArea(feature.properties);
                stats.totalPopulation += Number(feature.properties?.population || feature.properties?.POP || 0) || 0;
                if (!feature.geometry?.coordinates)
                    stats.invalidGeometries++;
            }
            return {
                fileName: 'upload.geojson',
                summary: stats,
                preview: features.slice(0, 5).map((f, idx) => ({
                    name: this.resolveFeatureName(f.properties, defaultType, idx),
                    type: f.properties?.type || defaultType,
                    riskLevel: this.resolveRiskLevel(f.properties),
                    kecamatan: f.properties?.kecamatan || f.properties?.DISTRICT || f.properties?.NAMOBJ || null,
                })),
            };
        }
        catch (error) {
            throw new Error(`Failed to analyze GeoJSON: ${error.message}`);
        }
    }
    buildZoneData(feature, defaultType, idx) {
        const type = feature.properties?.type || defaultType;
        const name = this.resolveFeatureName(feature.properties, type, idx);
        const riskLevel = this.resolveRiskLevel(feature.properties);
        let centroid = null;
        const geom = feature.geometry;
        if (geom?.type === 'Polygon' && geom.coordinates?.[0]) {
            const [lng, lat] = this.calculateCentroid(geom.coordinates[0]);
            centroid = { type: 'Point', coordinates: [lng, lat] };
        }
        else if (geom?.type === 'MultiPolygon' && geom.coordinates?.[0]?.[0]) {
            const [lng, lat] = this.calculateCentroid(geom.coordinates[0][0]);
            centroid = { type: 'Point', coordinates: [lng, lat] };
        }
        const simplifiedGeometry = this.simplifyGeometry(geom);
        return {
            type,
            name,
            riskLevel,
            description: feature.properties?.description || feature.properties?.DESC || '',
            geometry: simplifiedGeometry,
            centroid: centroid,
            area: this.resolveArea(feature.properties),
            population: Number(feature.properties?.population || feature.properties?.POP || 0) || 0,
            kelurahan: feature.properties?.kelurahan || feature.properties?.VILLAGE || feature.properties?.NAMOBJ || '',
            kecamatan: feature.properties?.kecamatan || feature.properties?.DISTRICT || '',
            mitigation: feature.properties?.mitigation || feature.properties?.MITIGATION || '',
        };
    }
    async importGeoJSON(buffer, defaultType, clearExisting = false) {
        try {
            const geojson = JSON.parse(buffer.toString('utf-8'));
            const features = geojson.features;
            if (clearExisting && defaultType) {
                await this.prisma.disasterZone.deleteMany({ where: { type: defaultType } });
            }
            const zonesData = features
                .map((feature, idx) => this.buildZoneData(feature, defaultType, idx))
                .filter((d) => !!d.type);
            const ids = [];
            for (const data of zonesData) {
                const zone = await this.prisma.disasterZone.create({ data });
                ids.push(zone.id);
            }
            return {
                success: true,
                count: ids.length,
                message: `Berhasil mengimport ${ids.length} zona ke sistem.`,
            };
        }
        catch (error) {
            throw new Error(`Gagal import GeoJSON: ${error.message}`);
        }
    }
    async importGeoJSONWithProgress(buffer, defaultType, clearExisting, onProgress) {
        const send = (data) => onProgress(data);
        try {
            send({ status: 'parsing', percent: 0, message: 'Membaca file GeoJSON...' });
            const geojson = JSON.parse(buffer.toString('utf-8'));
            const features = geojson.features;
            const total = features.length;
            if (clearExisting && defaultType) {
                send({ status: 'clearing', percent: 0, message: `Menghapus data ${defaultType} lama...` });
                await this.prisma.disasterZone.deleteMany({ where: { type: defaultType } });
            }
            send({ status: 'start', total, percent: 0, message: `Menyederhanakan & menyimpan ${total} zona...` });
            const ids = [];
            const log = [];
            for (const [idx, feature] of features.entries()) {
                const data = this.buildZoneData(feature, defaultType, idx);
                if (!data.type)
                    continue;
                const zone = await this.prisma.disasterZone.create({ data });
                ids.push(zone.id);
                const percent = Math.round(((idx + 1) / total) * 100);
                const entry = { name: data.name, riskLevel: data.riskLevel, area: data.area };
                log.push(entry);
                send({
                    status: 'progress',
                    current: idx + 1,
                    total,
                    percent,
                    current_name: data.name,
                    current_risk: data.riskLevel,
                    current_area: data.area ? Math.round(data.area * 100) / 100 : 0,
                    message: `[${idx + 1}/${total}] Menyimpan ${data.name}...`,
                    log,
                });
            }
            send({
                status: 'complete',
                count: ids.length,
                percent: 100,
                message: `✓ Berhasil mengimport ${ids.length} zona ke sistem.`,
                log,
            });
        }
        catch (error) {
            send({ status: 'error', message: `Gagal: ${error.message}` });
            throw error;
        }
    }
    calculateCentroid(coordinates) {
        let sumX = 0, sumY = 0;
        for (const [x, y] of coordinates) {
            sumX += x;
            sumY += y;
        }
        return [sumX / coordinates.length, sumY / coordinates.length];
    }
};
exports.DisastersService = DisastersService;
exports.DisastersService = DisastersService = DisastersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DisastersService);
//# sourceMappingURL=disasters.service.js.map