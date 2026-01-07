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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisastersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DisastersService = class DisastersService {
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
        if (!zone) {
            throw new common_1.NotFoundException(`Disaster zone with ID ${id} not found`);
        }
        return zone;
    }
    async findByType(type) {
        return this.prisma.disasterZone.findMany({
            where: { type },
            orderBy: { riskLevel: 'desc' },
        });
    }
    async create(dto) {
        return this.prisma.disasterZone.create({
            data: dto,
        });
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
    async getAsGeoJSON(type) {
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
        if (!zones.length) {
            return null;
        }
        return zones[0];
    }
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
            }, {}),
            byRiskLevel: byRiskLevel.reduce((acc, item) => {
                acc[item.riskLevel] = item._count.riskLevel;
                return acc;
            }, {}),
            totalAffectedPopulation: totalPopulation._sum.population || 0,
        };
    }
};
exports.DisastersService = DisastersService;
exports.DisastersService = DisastersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DisastersService);
//# sourceMappingURL=disasters.service.js.map