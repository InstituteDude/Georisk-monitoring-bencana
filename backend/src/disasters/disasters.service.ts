import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDisasterZoneDto, UpdateDisasterZoneDto, FilterDisasterZoneDto } from './dto';
import { DisasterType, RiskLevel } from '@prisma/client';

@Injectable()
export class DisastersService {
  constructor(private prisma: PrismaService) {}

  async findAll(filter: FilterDisasterZoneDto) {
    const { type, riskLevel, kecamatan, search, page = 1, limit = 50 } = filter;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (type) where.type = type;
    if (riskLevel) where.riskLevel = riskLevel;
    if (kecamatan) where.kecamatan = { contains: kecamatan, mode: 'insensitive' };

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

  async findOne(id: string) {
    const zone = await this.prisma.disasterZone.findUnique({ where: { id } });
    if (!zone) throw new NotFoundException(`Disaster zone with ID ${id} not found`);
    return zone;
  }

  async findByType(type: DisasterType) {
    return this.prisma.disasterZone.findMany({
      where: { type },
      orderBy: { riskLevel: 'desc' },
    });
  }

  async create(dto: CreateDisasterZoneDto) {
    return this.prisma.disasterZone.create({ data: dto });
  }

  async update(id: string, dto: UpdateDisasterZoneDto) {
    await this.findOne(id);
    return this.prisma.disasterZone.update({
      where: { id },
      data: { ...dto, lastUpdated: new Date() },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.disasterZone.delete({ where: { id } });
  }

  // Get zones as GeoJSON FeatureCollection, optionally filtered by viewport bbox
  async getAsGeoJSON(type?: DisasterType, bbox?: { minLat: number; maxLat: number; minLng: number; maxLng: number }) {
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

    // Filter by bbox using centroid when provided (fast JS-side check)
    const filtered = bbox
      ? zones.filter((zone) => {
          const c = zone.centroid as any;
          if (!c?.coordinates) return true; // include if no centroid
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

  // Identify zone by coordinates (PostGIS ST_Contains)
  async identify(lat: number, lng: number) {
    const zones = await this.prisma.$queryRaw<any[]>`
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

  // Statistics for dashboard
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
      }, {} as Record<string, number>),
      byRiskLevel: byRiskLevel.reduce((acc, item) => {
        acc[item.riskLevel] = item._count.riskLevel;
        return acc;
      }, {} as Record<string, number>),
      totalAffectedPopulation: totalPopulation._sum.population || 0,
    };
  }

  // ─── Geometry simplification (Douglas-Peucker) ───────────────────────────────

  private static readonly SIMPLIFY_TOLERANCE = 0.005;  // ~550 m — good for regional/city display
  private static readonly COORD_PRECISION = 4;          // 4 decimal places ≈ 11 m
  private static readonly MIN_RING_AREA = 0.0001;       // drop sub-polygons < ~1 km² (invisible at city zoom)

  // Perpendicular distance from point (px,py) to segment (x1,y1)→(x2,y2)
  private pointSegDist(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1, dy = y2 - y1;
    const len2 = dx * dx + dy * dy;
    if (len2 === 0) return Math.hypot(px - x1, py - y1);
    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / len2));
    return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
  }

  // Douglas-Peucker on a flat coordinate array
  private dpSimplify(coords: number[][], tol: number): number[][] {
    if (coords.length <= 2) return coords;
    const [x1, y1] = coords[0];
    const [x2, y2] = coords[coords.length - 1];
    let maxDist = 0, maxIdx = 1;
    for (let i = 1; i < coords.length - 1; i++) {
      const d = this.pointSegDist(coords[i][0], coords[i][1], x1, y1, x2, y2);
      if (d > maxDist) { maxDist = d; maxIdx = i; }
    }
    if (maxDist > tol) {
      const left = this.dpSimplify(coords.slice(0, maxIdx + 1), tol);
      const right = this.dpSimplify(coords.slice(maxIdx), tol);
      return [...left.slice(0, -1), ...right];
    }
    return [coords[0], coords[coords.length - 1]];
  }

  private simplifyRing(ring: number[][]): number[][] {
    const p = 10 ** DisastersService.COORD_PRECISION;
    // Round precision + remove consecutive duplicates
    let prev: number[] | null = null;
    const rounded: number[][] = [];
    for (const [x, y] of ring) {
      const rx = Math.round(x * p) / p;
      const ry = Math.round(y * p) / p;
      if (!prev || rx !== prev[0] || ry !== prev[1]) {
        rounded.push([rx, ry]);
        prev = [rx, ry];
      }
    }
    if (rounded.length < 4) return rounded;

    const simplified = this.dpSimplify(rounded, DisastersService.SIMPLIFY_TOLERANCE);
    if (simplified.length < 4) return rounded;

    // Ensure ring is closed
    const f = simplified[0], l = simplified[simplified.length - 1];
    if (f[0] !== l[0] || f[1] !== l[1]) simplified.push([f[0], f[1]]);
    return simplified;
  }

  // Shoelace formula — returns area in degrees²
  private ringArea(ring: number[][]): number {
    let area = 0;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      area += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
    }
    return Math.abs(area) / 2;
  }

  private simplifyGeometry(geometry: any): any {
    if (!geometry?.type || !geometry?.coordinates) return geometry;

    if (geometry.type === 'Polygon') {
      return { ...geometry, coordinates: geometry.coordinates.map((ring: number[][]) => this.simplifyRing(ring)) };
    }

    if (geometry.type === 'MultiPolygon') {
      const coords: number[][][][] = (geometry.coordinates as number[][][][])
        .filter((poly) => poly[0] && this.ringArea(poly[0]) >= DisastersService.MIN_RING_AREA)
        .map((poly) => poly.map((ring) => this.simplifyRing(ring)));

      return { ...geometry, coordinates: coords.length ? coords : geometry.coordinates.slice(0, 1) };
    }

    return geometry;
  }

  // ─── ArcGIS field resolvers ──────────────────────────────────────────────────

  private skorTotalToRiskLevel(skor: number): RiskLevel {
    if (skor <= 1) return 'LOW';
    if (skor === 2) return 'MEDIUM';
    if (skor === 3) return 'HIGH';
    return 'CRITICAL';
  }

  private resolveFeatureName(props: any, defaultType: string, index: number): string {
    if (props?.name) return props.name;
    if (props?.NAME) return props.NAME;
    if (props?.NAMOBJ) return props.NAMOBJ;
    const label: Record<string, string> = { FLOOD: 'Banjir', EARTHQUAKE: 'Gempa', LANDSLIDE: 'Longsor' };
    const id = props?.OBJECTID ?? index + 1;
    return `Zona ${label[defaultType] || defaultType} #${id}`;
  }

  private resolveRiskLevel(props: any): RiskLevel {
    if (props?.riskLevel) return props.riskLevel as RiskLevel;
    if (props?.RISK) return props.RISK as RiskLevel;
    if (props?.SkorTotal != null) return this.skorTotalToRiskLevel(Number(props.SkorTotal));
    if (props?.SKORTOTAL != null) return this.skorTotalToRiskLevel(Number(props.SKORTOTAL));
    return 'MEDIUM';
  }

  private resolveArea(props: any): number {
    if (props?.area != null) return parseFloat(props.area);
    if (props?.AREA != null) return parseFloat(props.AREA);
    if (props?.Shape_Area != null) return parseFloat(props.Shape_Area) / 1_000_000;
    if (props?.SHAPE_AREA != null) return parseFloat(props.SHAPE_AREA) / 1_000_000;
    return 0;
  }

  // ─── Analyze ────────────────────────────────────────────────────────────────

  async analyzeGeoJSON(buffer: Buffer, defaultType = 'FLOOD') {
    try {
      const geojson = JSON.parse(buffer.toString('utf-8'));
      if (geojson.type !== 'FeatureCollection' || !Array.isArray(geojson.features)) {
        throw new Error('Invalid GeoJSON format: Must be a FeatureCollection');
      }

      const features = geojson.features;
      const stats = {
        totalFeatures: features.length,
        byType: {} as Record<string, number>,
        byRiskLevel: {} as Record<string, number>,
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

        if (!feature.geometry?.coordinates) stats.invalidGeometries++;
      }

      return {
        fileName: 'upload.geojson',
        summary: stats,
        preview: features.slice(0, 5).map((f: any, idx: number) => ({
          name: this.resolveFeatureName(f.properties, defaultType, idx),
          type: f.properties?.type || defaultType,
          riskLevel: this.resolveRiskLevel(f.properties),
          kecamatan: f.properties?.kecamatan || f.properties?.DISTRICT || f.properties?.NAMOBJ || null,
        })),
      };
    } catch (error) {
      throw new Error(`Failed to analyze GeoJSON: ${error.message}`);
    }
  }

  // ─── Import ─────────────────────────────────────────────────────────────────

  private buildZoneData(feature: any, defaultType: DisasterType, idx: number) {
    const type = (feature.properties?.type as DisasterType) || defaultType;
    const name = this.resolveFeatureName(feature.properties, type, idx);
    const riskLevel = this.resolveRiskLevel(feature.properties);

    // Calculate centroid BEFORE simplification for accuracy
    let centroid: any = null;
    const geom = feature.geometry;
    if (geom?.type === 'Polygon' && geom.coordinates?.[0]) {
      const [lng, lat] = this.calculateCentroid(geom.coordinates[0]);
      centroid = { type: 'Point', coordinates: [lng, lat] };
    } else if (geom?.type === 'MultiPolygon' && geom.coordinates?.[0]?.[0]) {
      const [lng, lat] = this.calculateCentroid(geom.coordinates[0][0]);
      centroid = { type: 'Point', coordinates: [lng, lat] };
    }

    // Simplify geometry — reduces storage and render time dramatically
    const simplifiedGeometry = this.simplifyGeometry(geom);

    return {
      type,
      name,
      riskLevel,
      description: feature.properties?.description || feature.properties?.DESC || '',
      geometry: simplifiedGeometry,
      centroid: centroid as any,
      area: this.resolveArea(feature.properties),
      population: Number(feature.properties?.population || feature.properties?.POP || 0) || 0,
      kelurahan: feature.properties?.kelurahan || feature.properties?.VILLAGE || feature.properties?.NAMOBJ || '',
      kecamatan: feature.properties?.kecamatan || feature.properties?.DISTRICT || '',
      mitigation: feature.properties?.mitigation || feature.properties?.MITIGATION || '',
    };
  }

  async importGeoJSON(buffer: Buffer, defaultType?: DisasterType, clearExisting = false) {
    try {
      const geojson = JSON.parse(buffer.toString('utf-8'));
      const features: any[] = geojson.features;

      if (clearExisting && defaultType) {
        await this.prisma.disasterZone.deleteMany({ where: { type: defaultType } });
      }

      const zonesData = features
        .map((feature, idx) => this.buildZoneData(feature, defaultType as DisasterType, idx))
        .filter((d) => !!d.type);

      const ids: string[] = [];
      for (const data of zonesData) {
        const zone = await this.prisma.disasterZone.create({ data });
        ids.push(zone.id);
      }

      return {
        success: true,
        count: ids.length,
        message: `Berhasil mengimport ${ids.length} zona ke sistem.`,
      };
    } catch (error) {
      throw new Error(`Gagal import GeoJSON: ${error.message}`);
    }
  }

  // Import with real-time SSE progress streaming
  async importGeoJSONWithProgress(
    buffer: Buffer,
    defaultType: DisasterType | undefined,
    clearExisting: boolean,
    onProgress: (event: object) => void,
  ) {
    const send = (data: object) => onProgress(data);

    try {
      send({ status: 'parsing', percent: 0, message: 'Membaca file GeoJSON...' });
      const geojson = JSON.parse(buffer.toString('utf-8'));
      const features: any[] = geojson.features;
      const total = features.length;

      if (clearExisting && defaultType) {
        send({ status: 'clearing', percent: 0, message: `Menghapus data ${defaultType} lama...` });
        await this.prisma.disasterZone.deleteMany({ where: { type: defaultType } });
      }

      send({ status: 'start', total, percent: 0, message: `Menyederhanakan & menyimpan ${total} zona...` });

      const ids: string[] = [];
      const log: object[] = [];

      for (const [idx, feature] of features.entries()) {
        const data = this.buildZoneData(feature, defaultType as DisasterType, idx);
        if (!data.type) continue;

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
    } catch (error) {
      send({ status: 'error', message: `Gagal: ${error.message}` });
      throw error;
    }
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  private calculateCentroid(coordinates: number[][]): [number, number] {
    let sumX = 0, sumY = 0;
    for (const [x, y] of coordinates) { sumX += x; sumY += y; }
    return [sumX / coordinates.length, sumY / coordinates.length];
  }
}
