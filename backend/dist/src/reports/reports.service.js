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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filter) {
        const { type, status, page = 1, limit = 20, search } = filter;
        const skip = (page - 1) * limit;
        const where = {};
        if (type)
            where.type = type;
        if (status)
            where.status = status;
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { address: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [data, total] = await Promise.all([
            this.prisma.report.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: { id: true, name: true, email: true },
                    },
                },
            }),
            this.prisma.report.count({ where }),
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
        const report = await this.prisma.report.findUnique({
            where: { id },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
        if (!report) {
            throw new common_1.NotFoundException(`Report with ID ${id} not found`);
        }
        return report;
    }
    async create(dto, userId) {
        return this.prisma.report.create({
            data: {
                ...dto,
                userId,
            },
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.report.update({
            where: { id },
            data: dto,
        });
    }
    async updateStatus(id, dto) {
        await this.findOne(id);
        return this.prisma.report.update({
            where: { id },
            data: {
                status: dto.status,
                adminNotes: dto.adminNotes,
                resolvedAt: dto.status === client_1.ReportStatus.RESOLVED ? new Date() : undefined,
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.report.delete({ where: { id } });
    }
    async getAsGeoJSON() {
        const reports = await this.prisma.report.findMany({
            include: {
                user: {
                    select: { name: true },
                },
            },
            where: { status: { not: client_1.ReportStatus.REJECTED } },
        });
        return {
            type: 'FeatureCollection',
            features: reports.map((report) => ({
                type: 'Feature',
                id: report.id,
                properties: {
                    title: report.title,
                    description: report.description,
                    type: report.type,
                    status: report.status,
                    severity: report.severity,
                    createdAt: report.createdAt,
                    address: report.address,
                    reporter: report.user?.name || 'Anonim',
                },
                geometry: {
                    type: 'Point',
                    coordinates: [report.longitude, report.latitude],
                },
            })),
        };
    }
    async getStatistics() {
        const [total, byStatus, byType, recentReports] = await Promise.all([
            this.prisma.report.count(),
            this.prisma.report.groupBy({
                by: ['status'],
                _count: { status: true },
            }),
            this.prisma.report.groupBy({
                by: ['type'],
                _count: { type: true },
            }),
            this.prisma.report.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: { id: true, title: true, type: true, status: true, createdAt: true },
            }),
        ]);
        return {
            total,
            byStatus: byStatus.reduce((acc, item) => {
                acc[item.status] = item._count.status;
                return acc;
            }, {}),
            byType: byType.reduce((acc, item) => {
                acc[item.type] = item._count.type;
                return acc;
            }, {}),
            recentReports,
        };
    }
    async getRecent(hours = 24) {
        const since = new Date();
        since.setHours(since.getHours() - hours);
        return this.prisma.report.findMany({
            where: {
                createdAt: { gte: since },
            },
            orderBy: { createdAt: 'desc' },
            take: 20,
            include: {
                user: {
                    select: { name: true },
                },
            },
        });
    }
    async countPending() {
        return this.prisma.report.count({
            where: { status: client_1.ReportStatus.PENDING },
        });
    }
    async getStatsByType() {
        const byType = await this.prisma.report.groupBy({
            by: ['type'],
            _count: { type: true },
            where: { status: { not: client_1.ReportStatus.REJECTED } },
        });
        const byStatus = await this.prisma.report.groupBy({
            by: ['status'],
            _count: { status: true },
        });
        return {
            byType: byType.reduce((acc, item) => {
                acc[item.type] = item._count.type;
                return acc;
            }, {}),
            byStatus: byStatus.reduce((acc, item) => {
                acc[item.status] = item._count.status;
                return acc;
            }, {}),
            total: byType.reduce((sum, item) => sum + item._count.type, 0),
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map