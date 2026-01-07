import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto, UpdateReportDto, UpdateReportStatusDto, FilterReportDto } from './dto';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(filter: FilterReportDto): Promise<{
        data: ({
            user: {
                id: string;
                email: string;
                name: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.DisasterType;
            description: string;
            address: string | null;
            latitude: number;
            longitude: number;
            title: string;
            images: string[];
            status: import("@prisma/client").$Enums.ReportStatus;
            severity: number;
            adminNotes: string | null;
            resolvedAt: Date | null;
            userId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.DisasterType;
        description: string;
        address: string | null;
        latitude: number;
        longitude: number;
        title: string;
        images: string[];
        status: import("@prisma/client").$Enums.ReportStatus;
        severity: number;
        adminNotes: string | null;
        resolvedAt: Date | null;
        userId: string | null;
    }>;
    create(dto: CreateReportDto, userId?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.DisasterType;
        description: string;
        address: string | null;
        latitude: number;
        longitude: number;
        title: string;
        images: string[];
        status: import("@prisma/client").$Enums.ReportStatus;
        severity: number;
        adminNotes: string | null;
        resolvedAt: Date | null;
        userId: string | null;
    }>;
    update(id: string, dto: UpdateReportDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.DisasterType;
        description: string;
        address: string | null;
        latitude: number;
        longitude: number;
        title: string;
        images: string[];
        status: import("@prisma/client").$Enums.ReportStatus;
        severity: number;
        adminNotes: string | null;
        resolvedAt: Date | null;
        userId: string | null;
    }>;
    updateStatus(id: string, dto: UpdateReportStatusDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.DisasterType;
        description: string;
        address: string | null;
        latitude: number;
        longitude: number;
        title: string;
        images: string[];
        status: import("@prisma/client").$Enums.ReportStatus;
        severity: number;
        adminNotes: string | null;
        resolvedAt: Date | null;
        userId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.DisasterType;
        description: string;
        address: string | null;
        latitude: number;
        longitude: number;
        title: string;
        images: string[];
        status: import("@prisma/client").$Enums.ReportStatus;
        severity: number;
        adminNotes: string | null;
        resolvedAt: Date | null;
        userId: string | null;
    }>;
    getAsGeoJSON(): Promise<{
        type: string;
        features: {
            type: string;
            id: string;
            properties: {
                title: string;
                description: string;
                type: import("@prisma/client").$Enums.DisasterType;
                status: import("@prisma/client").$Enums.ReportStatus;
                severity: number;
                createdAt: Date;
                address: string | null;
                reporter: string;
            };
            geometry: {
                type: string;
                coordinates: number[];
            };
        }[];
    }>;
    getStatistics(): Promise<{
        total: number;
        byStatus: Record<string, number>;
        byType: Record<string, number>;
        recentReports: {
            id: string;
            createdAt: Date;
            type: import("@prisma/client").$Enums.DisasterType;
            title: string;
            status: import("@prisma/client").$Enums.ReportStatus;
        }[];
    }>;
    getRecent(hours?: number): Promise<({
        user: {
            name: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.DisasterType;
        description: string;
        address: string | null;
        latitude: number;
        longitude: number;
        title: string;
        images: string[];
        status: import("@prisma/client").$Enums.ReportStatus;
        severity: number;
        adminNotes: string | null;
        resolvedAt: Date | null;
        userId: string | null;
    })[]>;
    countPending(): Promise<number>;
    getStatsByType(): Promise<{
        byType: Record<string, number>;
        byStatus: Record<string, number>;
        total: number;
    }>;
}
