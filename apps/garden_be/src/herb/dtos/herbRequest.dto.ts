import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class HerbRequestDto {
    @ApiProperty({
        description: 'Name of the herb',
        example: 'Basil',
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Short description of the herb',
        example: 'Aromatic herb commonly used in Italian cuisine',
    })
    @IsString()
    description: string;

    @ApiProperty({
        description: 'Current temperature around the herb (°C)',
        example: 22.5,
    })
    @IsNumber()
    temperature: number;

    @ApiProperty({
        description: 'Current air humidity around the herb (%)',
        example: 55,
    })
    @IsNumber()
    humidity: number;

    @ApiProperty({
        description: 'Soil moisture level (%)',
        example: 40,
    })
    @IsNumber()
    soilMoisture: number;

    @ApiProperty({
        description: 'Date and time of the last watering',
        example: '2024-11-01T08:30:00.000Z',
        required: false,
    })
    @IsOptional()
    @IsDate()
    lastWatering?: Date;
}
