import {
    Body,
    Controller,
    Get,
    Headers,
    Param,
    Post,
    Query,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SensorReadingService } from './services/sensorReading.service';
import { SensorDataRequestDto } from './dtos/sensorDataRequest.dto';
import { SensorReadingResponseDto } from './dtos/sensorReadingResponse.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('sensor-data')
export class SensorReadingController {
    constructor(
        private readonly sensorReadingService: SensorReadingService,
        private readonly configService: ConfigService
    ) {}

    @Public()
    @Post()
    async ingest(
        @Body() dto: SensorDataRequestDto,
        @Headers('x-api-key') apiKey: string
    ) {
        const expectedKey = this.configService.get<string>(
            'IOT_API_KEY',
            'garden-iot-secret'
        );
        if (apiKey !== expectedKey) {
            throw new UnauthorizedException('Invalid API key');
        }

        return this.sensorReadingService.ingestSensorData(dto);
    }

    @Get('room/:roomId')
    async findByRoom(
        @Param('roomId') roomId: string,
        @Query('from') from?: string,
        @Query('to') to?: string,
        @Query('limit') limit?: string
    ): Promise<SensorReadingResponseDto[]> {
        const readings = await this.sensorReadingService.findByRoom(
            roomId,
            from,
            to,
            limit ? parseInt(limit) : 100
        );
        return readings.map((r) => ({
            id: r.id,
            temperature: r.temperature,
            humidity: r.humidity,
            soilMoisture: r.soilMoisture,
            waterLevel: r.waterLevel,
            roomId,
            createdAt: r.createdAt,
        }));
    }

    @Get('room/:roomId/latest')
    async findLatest(
        @Param('roomId') roomId: string
    ): Promise<SensorReadingResponseDto | null> {
        const reading = await this.sensorReadingService.findLatest(roomId);
        if (!reading) return null;
        return {
            id: reading.id,
            temperature: reading.temperature,
            humidity: reading.humidity,
            soilMoisture: reading.soilMoisture,
            waterLevel: reading.waterLevel,
            roomId,
            createdAt: reading.createdAt,
        };
    }
}
