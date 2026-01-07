import { PrismaService } from '../prisma/prisma.service';
import { CreateEvacuationPointDto, UpdateEvacuationPointDto } from './dto';
export declare class EvacuationService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(activeOnly?: boolean): Promise<{
        id: string;
        name: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        address: string;
        latitude: number;
        longitude: number;
        capacity: number;
        facilities: string[];
        isActive: boolean;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        address: string;
        latitude: number;
        longitude: number;
        capacity: number;
        facilities: string[];
        isActive: boolean;
    }>;
    create(dto: CreateEvacuationPointDto): Promise<{
        id: string;
        name: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        address: string;
        latitude: number;
        longitude: number;
        capacity: number;
        facilities: string[];
        isActive: boolean;
    }>;
    update(id: string, dto: UpdateEvacuationPointDto): Promise<{
        id: string;
        name: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        address: string;
        latitude: number;
        longitude: number;
        capacity: number;
        facilities: string[];
        isActive: boolean;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        address: string;
        latitude: number;
        longitude: number;
        capacity: number;
        facilities: string[];
        isActive: boolean;
    }>;
    getAsGeoJSON(): Promise<{
        type: string;
        features: {
            type: string;
            id: string;
            properties: {
                name: string;
                address: string;
                capacity: number;
                facilities: string[];
                phone: string | null;
            };
            geometry: {
                type: string;
                coordinates: number[];
            };
        }[];
    }>;
    getStatistics(): Promise<{
        total: number;
        totalCapacity: number;
    }>;
}
