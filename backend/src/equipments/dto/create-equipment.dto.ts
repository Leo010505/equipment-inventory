import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateEquipmentDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsNotEmpty()
    serialNumber: string;

    @IsEnum(['AVAILABLE', 'IN_USE', 'MAINTENANCE'])
    @IsOptional()
    status?: string;

    @IsUUID()
    @IsNotEmpty()
    categoryId: string; // <-- Este es el campo clave que espera el servicio
}