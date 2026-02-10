import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';

export class RoomRequestDto {
    @ApiProperty({
        description: 'Name of the room',
        example: 'Living room',
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Optional room description',
        example: 'Room with herbs near the window',
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        description: 'Current temperature in the room (°C)',
        example: 22.5,
    })
    @IsNumber()
    temperature: number;

    @ApiProperty({
        description: 'Current humidity in the room (%)',
        example: 55,
    })
    @IsNumber()
    humidity: number;

    @ApiProperty({
        description: 'Water level in the room tank (%)',
        example: 80,
    })
    @IsNumber()
    waterLevel: number;

    @ApiProperty({
        description: 'IDs of herbs in the room',
        example: ['uuid-herb-1', 'uuid-herb-2'],
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsUUID('all', { each: true })
    herbIds?: string[];

    @ApiProperty({
        description: 'IDs of users assigned to the room',
        example: ['uuid-user-1'],
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsUUID('all', { each: true })
    userIds?: string[];
}
