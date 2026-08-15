import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateMovementDto {
    @IsUUID()
    @IsNotEmpty()
    equipmentId: string;

    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @IsEnum(['CHECK_OUT', 'RETURN'])
    @IsNotEmpty()
    action: string;

    @IsString()
    @IsOptional()
    notes?: string;
}