import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { SoilType, SoilTypeEnum } from '../../utils/const';

export class GrowConditionsRequestDto {
    @ApiProperty({
        description: 'minimal temperature',
        example: '2026-01-09T12:00:00Z',
    })
    @IsNumber()
    minTemperature: number;

    @ApiProperty({
        description: 'maximal temperature',
        example: '2026-01-09T12:00:00Z',
    })
    @IsNumber()
    maxTemperature: number;

    @ApiProperty({
        description: 'minimal humidity',
        example: '2026-01-09T12:00:00Z',
    })
    @IsNumber()
    minHumidity: number;

    @ApiProperty({
        description: 'maximal humidity',
        example: '2026-01-09T12:00:00Z',
    })
    @IsNumber()
    maxHumidity: number;

    @ApiProperty({
        description: 'Soil type',
        example: '2026-01-09T12:00:00Z',
    })
    @IsEnum(SoilTypeEnum)
    soilType: SoilType;

    @ApiProperty({
        description: 'ID of the herb this history belongs to',
        example: 'uuid-of-herb',
    })
    @IsString()
    herbId: string;
}
