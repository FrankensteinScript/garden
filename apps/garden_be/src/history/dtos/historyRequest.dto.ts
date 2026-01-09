import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class HistoryRequestDto {
    @ApiProperty({
        description: 'Date when the herb was watered',
        example: '2026-01-09T12:00:00Z',
    })
    @IsDate()
    wateredAt: Date;

    @ApiProperty({ description: 'Amount of water in liters', example: 0.5 })
    @IsNumber()
    amountWater: number;

    @ApiProperty({
        description: 'Temperature at watering time in Celsius',
        example: 22.5,
    })
    @IsNumber()
    temperature: number;

    @ApiProperty({
        description: 'Optional notes about watering',
        example: 'Herb looks healthy',
    })
    @IsOptional()
    @IsString()
    notes?: string;

    @ApiProperty({
        description: 'ID of the herb this history belongs to',
        example: 'uuid-of-herb',
    })
    @IsString()
    herbId: string;
}
