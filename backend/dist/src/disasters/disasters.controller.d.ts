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
            createdAt: Date;
            updatedAt: Date;
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
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    identify(lat: string, lng: string): Promise<any> | null;
    getAsGeoJSON(type?: DisasterType): Promise<{
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
        createdAt: Date;
        updatedAt: Date;
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
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
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
    }>;
    create(dto: CreateDisasterZoneDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
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
    }>;
    update(id: string, dto: UpdateDisasterZoneDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
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
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
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
    }>;
}
