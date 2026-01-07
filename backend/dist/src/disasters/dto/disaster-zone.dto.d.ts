import { DisasterType, RiskLevel } from '@prisma/client';
export declare class CreateDisasterZoneDto {
    name: string;
    type: DisasterType;
    riskLevel: RiskLevel;
    description?: string;
    geometry: Record<string, any>;
    centroid?: Record<string, any>;
    area?: number;
    population?: number;
    kelurahan?: string;
    kecamatan?: string;
    mitigation?: string;
}
export declare class UpdateDisasterZoneDto {
    name?: string;
    type?: DisasterType;
    riskLevel?: RiskLevel;
    description?: string;
    geometry?: Record<string, any>;
    centroid?: Record<string, any>;
    area?: number;
    population?: number;
    kelurahan?: string;
    kecamatan?: string;
    mitigation?: string;
}
export declare class FilterDisasterZoneDto {
    type?: DisasterType;
    riskLevel?: RiskLevel;
    kecamatan?: string;
    search?: string;
    page?: number;
    limit?: number;
}
