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
    if (!zone) {
      throw new NotFoundException(`Disaster zone with ID ${id} not found`);
    }
    return zone;
  }

  async findByType(type: DisasterType) {
    return this.prisma.disasterZone.findMany({
      where: { type },
      orderBy: { riskLevel: 'desc' },
    });
  }

  async create(dto: CreateDisasterZoneDto) {
    return this.prisma.disasterZone.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateDisasterZoneDto) {
    await this.findOne(id); // Check if exists
    return this.prisma.disasterZone.update({
      where: { id },
      data: { ...dto, lastUpdated: new Date() },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists
    return this.prisma.disasterZone.delete({ where: { id } });
  }

  // Get all zones as GeoJSON FeatureCollection
  async getAsGeoJSON(type?: DisasterType) {
    const where = type ? { type } : {};
    const zones = await this.prisma.disasterZone.findMany({ where });

    return {
      type: 'FeatureCollection',
      features: zones.map((zone) => ({
        type: 'Feature',
        id: zone.id,
        properties: {
          name: zone.name,
          type: zone.type,
          riskLevel: zone.riskLevel,
          description: zone.description,
          area: zone.area,
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
    // Use raw query for PostGIS spatial function
    // Find zones where the point is inside the geometry
    const zones = await this.prisma.$queryRaw<any[]>`
      SELECT id, name, type, "riskLevel"::text, description, area, population, kelurahan, kecamatan, mitigation
      FROM disaster_zones
      WHERE ST_Contains(
        geometry::geometry,
        ST_SetSRID(ST_MakePoint(${parseFloat(lng.toString())}, ${parseFloat(lat.toString())}), 4326)
      )
      LIMIT 1;
    `;

    if (!zones.length) {
      return null;
    }

    // Return the first match (most relevant)
    return zones[0];
  }

  // Statistics for dashboard
  async getStatistics() {
    const [totalZones, byType, byRiskLevel, totalPopulation] = await Promise.all([
      this.prisma.disasterZone.count(),
      this.prisma.disasterZone.groupBy({
        by: ['type'],
        _count: { type: true },
      }),
      this.prisma.disasterZone.groupBy({
        by: ['riskLevel'],
        _count: { riskLevel: true },
      }),
      this.prisma.disasterZone.aggregate({
        _sum: { population: true },
      }),
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
}
