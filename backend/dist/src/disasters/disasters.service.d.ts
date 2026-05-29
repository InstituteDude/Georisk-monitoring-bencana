import { PrismaService } from '../prisma/prisma.service';
import { CreateDisasterZoneDto, UpdateDisasterZoneDto, FilterDisasterZoneDto } from './dto';
import { DisasterType } from '@prisma/client';
export declare class DisastersService {
    private prisma;
    constructor(prisma: PrismaService);
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
    getAsGeoJSON(type?: DisasterType, bbox?: {
        minLat: number;
        maxLat: number;
        minLng: number;
        maxLng: number;
    }): Promise<{
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
    identify(lat: number, lng: number): Promise<any>;
    getStatistics(): Promise<{
        totalZones: number;
        byType: Record<string, number>;
        byRiskLevel: Record<string, number>;
        totalAffectedPopulation: number;
    }>;
    private static readonly SIMPLIFY_TOLERANCE;
    private static readonly COORD_PRECISION;
    private static readonly MIN_RING_AREA;
    private pointSegDist;
    private dpSimplify;
    private simplifyRing;
    private ringArea;
    private simplifyGeometry;
    private skorTotalToRiskLevel;
    private resolveFeatureName;
    private resolveRiskLevel;
    private resolveArea;
    analyzeGeoJSON(buffer: Buffer, defaultType?: string): Promise<{
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
    private buildZoneData;
    importGeoJSON(buffer: Buffer, defaultType?: DisasterType, clearExisting?: boolean): Promise<{
        success: boolean;
        count: number;
        message: string;
    }>;
    importGeoJSONWithProgress(buffer: Buffer, defaultType: DisasterType | undefined, clearExisting: boolean, onProgress: (event: object) => void): Promise<void>;
    private calculateCentroid;
}
