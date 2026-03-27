import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID } from 'class-validator';

export class SensorDataRequestDto {
    @ApiProperty({ description: 'Room ID', example: 'uuid-room' })
    @IsUUID()
    roomId: string;

    @ApiProperty({ description: 'Temperature in °C', example: 22.5 })
    @IsNumber()
    temperature: number;

    @ApiProperty({ description: 'Humidity in %', example: 55 })
    @IsNumber()
    humidity: number;

    @ApiProperty({ description: 'Soil moisture in %', example: 45 })
    @IsNumber()
    soilMoisture: number;

    @ApiProperty({ description: 'Water level in %', example: 80 })
    @IsNumber()
    waterLevel: number;
}
