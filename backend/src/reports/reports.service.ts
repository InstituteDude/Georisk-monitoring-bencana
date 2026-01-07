import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto, UpdateReportDto, UpdateReportStatusDto, FilterReportDto } from './dto';
import { ReportStatus } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filter: FilterReportDto) {
    const { type, status, page = 1, limit = 20, search } = filter;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (type) where.type = type;
    if (status) where.status = status;
    
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

  async findOne(id: string) {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    return report;
  }

  async create(dto: CreateReportDto, userId?: string) {
    return this.prisma.report.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async update(id: string, dto: UpdateReportDto) {
    await this.findOne(id);
    return this.prisma.report.update({
      where: { id },
      data: dto,
    });
  }

  async updateStatus(id: string, dto: UpdateReportStatusDto) {
    await this.findOne(id);
    return this.prisma.report.update({
      where: { id },
      data: {
        status: dto.status,
        adminNotes: dto.adminNotes,
        resolvedAt: dto.status === ReportStatus.RESOLVED ? new Date() : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.report.delete({ where: { id } });
  }

  // Get reports as GeoJSON for map display
  async getAsGeoJSON() {
    const reports = await this.prisma.report.findMany({
      include: {
        user: {
          select: { name: true },
        },
      },
      where: { status: { not: ReportStatus.REJECTED } },
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

  // Statistics for dashboard
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
      }, {} as Record<string, number>),
      byType: byType.reduce((acc, item) => {
        acc[item.type] = item._count.type;
        return acc;
      }, {} as Record<string, number>),
      recentReports,
    };
  }

  // Get recent reports for notifications (last N hours)
  async getRecent(hours: number = 24) {
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

  // Count pending reports for admin badge
  async countPending() {
    return this.prisma.report.count({
      where: { status: ReportStatus.PENDING },
    });
  }

  // Get report counts by disaster type (for dashboard)
  async getStatsByType() {
    const byType = await this.prisma.report.groupBy({
      by: ['type'],
      _count: { type: true },
      where: { status: { not: ReportStatus.REJECTED } },
    });

    const byStatus = await this.prisma.report.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    return {
      byType: byType.reduce((acc, item) => {
        acc[item.type] = item._count.type;
        return acc;
      }, {} as Record<string, number>),
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {} as Record<string, number>),
      total: byType.reduce((sum, item) => sum + item._count.type, 0),
    };
  }
}
