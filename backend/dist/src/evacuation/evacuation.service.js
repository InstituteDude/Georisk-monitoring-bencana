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
exports.EvacuationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EvacuationService = class EvacuationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(activeOnly = true) {
        const where = activeOnly ? { isActive: true } : {};
        return this.prisma.evacuationPoint.findMany({
            where,
            orderBy: { name: 'asc' },
        });
    }
    async findOne(id) {
        const point = await this.prisma.evacuationPoint.findUnique({ where: { id } });
        if (!point) {
            throw new common_1.NotFoundException(`Evacuation point with ID ${id} not found`);
        }
        return point;
    }
    async create(dto) {
        return this.prisma.evacuationPoint.create({
            data: dto,
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.evacuationPoint.update({
            where: { id },
            data: dto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.evacuationPoint.delete({ where: { id } });
    }
    async getAsGeoJSON() {
        const points = await this.prisma.evacuationPoint.findMany({
            where: { isActive: true },
        });
        return {
            type: 'FeatureCollection',
            features: points.map((point) => ({
                type: 'Feature',
                id: point.id,
                properties: {
                    name: point.name,
                    address: point.address,
                    capacity: point.capacity,
                    facilities: point.facilities,
                    phone: point.phone,
                },
                geometry: {
                    type: 'Point',
                    coordinates: [point.longitude, point.latitude],
                },
            })),
        };
    }
    async getStatistics() {
        const [total, totalCapacity] = await Promise.all([
            this.prisma.evacuationPoint.count({ where: { isActive: true } }),
            this.prisma.evacuationPoint.aggregate({
                where: { isActive: true },
                _sum: { capacity: true },
            }),
        ]);
        return {
            total,
            totalCapacity: totalCapacity._sum.capacity || 0,
        };
    }
};
exports.EvacuationService = EvacuationService;
exports.EvacuationService = EvacuationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EvacuationService);
//# sourceMappingURL=evacuation.service.js.map