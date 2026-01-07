import { IsEnum, IsOptional, IsString, IsNumber, IsObject, Min, Max } from 'class-validator';
import { DisasterType, RiskLevel } from '@prisma/client';

export class CreateDisasterZoneDto {
  @IsString()
  name: string;

  @IsEnum(DisasterType)
  type: DisasterType;

  @IsEnum(RiskLevel)
  riskLevel: RiskLevel;

  @IsOptional()
  @IsString()
  description?: string;

  @IsObject()
  geometry: Record<string, any>; // GeoJSON geometry

  @IsOptional()
  @IsObject()
  centroid?: Record<string, any>;

  @IsOptional()
  @IsNumber()
  @Min(0)
  area?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  population?: number;

  @IsOptional()
  @IsString()
  kelurahan?: string;

  @IsOptional()
  @IsString()
  kecamatan?: string;

  @IsOptional()
  @IsString()
  mitigation?: string;
}

export class UpdateDisasterZoneDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(DisasterType)
  type?: DisasterType;

  @IsOptional()
  @IsEnum(RiskLevel)
  riskLevel?: RiskLevel;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  geometry?: Record<string, any>;

  @IsOptional()
  @IsObject()
  centroid?: Record<string, any>;

  @IsOptional()
  @IsNumber()
  @Min(0)
  area?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  population?: number;

  @IsOptional()
  @IsString()
  kelurahan?: string;

  @IsOptional()
  @IsString()
  kecamatan?: string;

  @IsOptional()
  @IsString()
  mitigation?: string;
}

export class FilterDisasterZoneDto {
  @IsOptional()
  @IsEnum(DisasterType)
  type?: DisasterType;

  @IsOptional()
  @IsEnum(RiskLevel)
  riskLevel?: RiskLevel;

  @IsOptional()
  @IsString()
  kecamatan?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}
