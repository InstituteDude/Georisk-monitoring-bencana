import { Role } from '@prisma/client';
export declare class RegisterDto {
    email: string;
    password: string;
    name: string;
    phone?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class UpdateProfileDto {
    name?: string;
    phone?: string;
}
export interface JwtPayload {
    sub: string;
    email: string;
    role: Role;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
