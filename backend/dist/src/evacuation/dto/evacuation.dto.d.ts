export declare class CreateEvacuationPointDto {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    capacity: number;
    facilities?: string[];
    phone?: string;
}
export declare class UpdateEvacuationPointDto {
    name?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    capacity?: number;
    facilities?: string[];
    phone?: string;
    isActive?: boolean;
}
