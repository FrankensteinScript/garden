import { ApiProperty } from '@nestjs/swagger';

export class SensorReadingResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    temperature: number;

    @ApiProperty()
    humidity: number;

    @ApiProperty()
    soilMoisture: number;

    @ApiProperty()
    waterLevel: number;

    @ApiProperty()
    roomId: string;

    @ApiProperty()
    createdAt: Date;
}
