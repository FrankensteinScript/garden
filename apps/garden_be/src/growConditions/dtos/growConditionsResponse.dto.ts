import { ApiProperty } from '@nestjs/swagger';
import { SoilTypeEnum } from '../../utils/const';

export class GrowConditionsResponseDto {
    @ApiProperty({
        description: 'Minimum allowed temperature for the herb',
        example: 18,
    })
    minTemperature: number;

    @ApiProperty({
        description: 'Maximum allowed temperature for the herb',
        example: 26,
    })
    maxTemperature: number;

    @ApiProperty({
        description: 'Minimum allowed humidity (%)',
        example: 40,
    })
    minHumidity: number;

    @ApiProperty({
        description: 'Maximum allowed humidity (%)',
        example: 70,
    })
    maxHumidity: number;

    @ApiProperty({
        description: 'Preferred soil type for the herb',
        example: 'LOAMY',
        enum: ['SANDY', 'CLAY', 'LOAMY'],
    })
    soilType: SoilTypeEnum;

    @ApiProperty({
        description: 'ID of the herb this grow condition belongs to',
        example: 'uuid-herb',
    })
    herbId: string;
}
