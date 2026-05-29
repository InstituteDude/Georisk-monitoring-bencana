import { Response } from 'express';
import { DisasterType } from '@prisma/client';
import { DisastersService } from './disasters.service';
import { CreateDisasterZoneDto, UpdateDisasterZoneDto, FilterDisasterZoneDto } from './dto';
export declare class DisastersController {
    private readonly disastersService;
    constructor(disastersService: DisastersService);
    findAll(filter: FilterDisasterZoneDto): Promise<{
        data: {
            id: string;
            name: string;
            type: import("@prisma/client").$Enums.DisasterType;
            riskLevel: import("@prisma/client").$Enums.RiskLevel;
            description: string | null;
            geometry: import("@prisma/client/runtime/library").JsonValue;
            centroid: import("@prisma/client/runtime/library").JsonValue | null;
            area: number | null;
            population: number | null;
            kelurahan: string | null;
            kecamatan: string | null;
            mitigation: string | null;
            lastUpdated: Date;
            createdAt: Date;
            updatedAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    identify(lat: string, lng: string): Promise<any> | null;
    getAsGeoJSON(type?: DisasterType, minLat?: string, maxLat?: string, minLng?: string, maxLng?: string): Promise<{
        type: string;
        features: {
            type: string;
            id: string;
            properties: {
                name: string;
                type: import("@prisma/client").$Enums.DisasterType;
                riskLevel: import("@prisma/client").$Enums.RiskLevel;
                description: string | null;
                area: number | null;
                population: number | null;
                kelurahan: string | null;
                kecamatan: string | null;
                mitigation: string | null;
            };
            geometry: import("@prisma/client/runtime/library").JsonValue;
        }[];
    }>;
    getStatistics(): Promise<{
        totalZones: number;
        byType: Record<string, number>;
        byRiskLevel: Record<string, number>;
        totalAffectedPopulation: number;
    }>;
    findByType(type: DisasterType): Promise<{
        id: string;
        name: string;
        type: import("@prisma/client").$Enums.DisasterType;
        riskLevel: import("@prisma/client").$Enums.RiskLevel;
        description: string | null;
        geometry: import("@prisma/client/runtime/library").JsonValue;
        centroid: import("@prisma/client/runtime/library").JsonValue | null;
        area: number | null;
        population: number | null;
        kelurahan: string | null;
        kecamatan: string | null;
        mitigation: string | null;
        lastUpdated: Date;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        type: import("@prisma/client").$Enums.DisasterType;
        riskLevel: import("@prisma/client").$Enums.RiskLevel;
        description: string | null;
        geometry: import("@prisma/client/runtime/library").JsonValue;
        centroid: import("@prisma/client/runtime/library").JsonValue | null;
        area: number | null;
        population: number | null;
        kelurahan: string | null;
        kecamatan: string | null;
        mitigation: string | null;
        lastUpdated: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(dto: CreateDisasterZoneDto): Promise<{
        id: string;
        name: string;
        type: import("@prisma/client").$Enums.DisasterType;
        riskLevel: import("@prisma/client").$Enums.RiskLevel;
        description: string | null;
        geometry: import("@prisma/client/runtime/library").JsonValue;
        centroid: import("@prisma/client/runtime/library").JsonValue | null;
        area: number | null;
        population: number | null;
        kelurahan: string | null;
        kecamatan: string | null;
        mitigation: string | null;
        lastUpdated: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    analyze(file: Express.Multer.File, defaultType?: string): Promise<{
        fileName: string;
        summary: {
            totalFeatures: any;
            byType: Record<string, number>;
            byRiskLevel: Record<string, number>;
            totalArea: number;
            totalPopulation: number;
            invalidGeometries: number;
        };
        preview: any;
    }>;
    import(file: Express.Multer.File, type?: DisasterType, clearExisting?: string): Promise<{
        success: boolean;
        count: number;
        message: string;
    }>;
    importStream(file: Express.Multer.File, type: DisasterType, clearExisting: string, res: Response): Promise<void>;
    update(id: string, dto: UpdateDisasterZoneDto): Promise<{
        id: string;
        name: string;
        type: import("@prisma/client").$Enums.DisasterType;
        riskLevel: import("@prisma/client").$Enums.RiskLevel;
        description: string | null;
        geometry: import("@prisma/client/runtime/library").JsonValue;
        centroid: import("@prisma/client/runtime/library").JsonValue | null;
        area: number | null;
        population: number | null;
        kelurahan: string | null;
        kecamatan: string | null;
        mitigation: string | null;
        lastUpdated: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        type: import("@prisma/client").$Enums.DisasterType;
        riskLevel: import("@prisma/client").$Enums.RiskLevel;
        description: string | null;
        geometry: import("@prisma/client/runtime/library").JsonValue;
        centroid: import("@prisma/client/runtime/library").JsonValue | null;
        area: number | null;
        population: number | null;
        kelurahan: string | null;
        kecamatan: string | null;
        mitigation: string | null;
        lastUpdated: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
