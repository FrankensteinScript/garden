import { ApiProperty } from '@nestjs/swagger';
import {
    IsDate,
    IsIn,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    IsArray,
    IsObject,
} from 'class-validator';
import { GrowConditions } from '../../growConditions/entity/growConditions.entity';
import { PLANT_TYPES, PlantType } from '../../utils/const';

export class HerbRequestDto {
    @ApiProperty({ description: 'Name of the herb', example: 'Basil' })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Description of the herb',
        example: 'A fragrant herb used in cooking',
    })
    @IsString()
    description: string;

    @ApiProperty({
        description: 'Optimal temperature for the herb',
        example: 22,
    })
    @IsNumber()
    temperature: number;

    @ApiProperty({ description: 'Optimal humidity for the herb', example: 60 })
    @IsNumber()
    humidity: number;

    @ApiProperty({ description: 'Soil moisture level', example: 30 })
    @IsNumber()
    soilMoisture: number;

    @ApiProperty({
        description: 'Date of last watering',
        example: '2026-01-09T12:00:00Z',
        required: false,
    })
    @IsOptional()
    @IsDate()
    lastWatering?: Date;

    @ApiProperty({
        description: 'Plant type',
        example: 'herb',
        enum: PLANT_TYPES,
        required: false,
    })
    @IsOptional()
    @IsIn(PLANT_TYPES)
    plantType?: PlantType;

    @ApiProperty({
        description: 'Grow Conditions of herb',
        example: 'something',
        required: false,
    })
    @IsOptional()
    @IsObject()
    growConditions?: GrowConditions;

    @ApiProperty({
        description: 'ID of the room the herb belongs to',
        example: 'uuid-room',
        required: false,
    })
    @IsOptional()
    @IsUUID()
    roomId?: string;

    @ApiProperty({
        description: 'IDs of associated notifications',
        example: ['uuid-notification1'],
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsUUID('all', { each: true })
    notificationIds?: string[];
}
