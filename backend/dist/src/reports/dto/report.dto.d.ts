import { DisasterType, ReportStatus } from '@prisma/client';
export declare class CreateReportDto {
    title: string;
    description: string;
    type: DisasterType;
    latitude: number;
    longitude: number;
    address?: string;
    images?: string[];
    severity?: number;
}
export declare class UpdateReportDto {
    title?: string;
    description?: string;
    type?: DisasterType;
    latitude?: number;
    longitude?: number;
    address?: string;
    images?: string[];
    severity?: number;
}
export declare class UpdateReportStatusDto {
    status: ReportStatus;
    adminNotes?: string;
}
export declare class FilterReportDto {
    type?: DisasterType;
    status?: ReportStatus;
    page?: number;
    limit?: number;
    search?: string;
}
