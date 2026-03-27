import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { SensorReading } from '../entity/sensorReading.entity';
import { Room } from '../../room/entity/room.entity';
import { Herb } from '../../herb/entity/herb.entity';
import { GrowConditions } from '../../growConditions/entity/growConditions.entity';
import { Notification } from '../../notification/entity/notification.entity';
import { User } from '../../user/entity/user.entity';
import { SensorDataRequestDto } from '../dtos/sensorDataRequest.dto';
import { PumpCommand } from '../../pumpCommand/entity/pumpCommand.entity';
import { LightCommand } from '../../lightCommand/entity/lightCommand.entity';
import { EmailService } from '../../email/email.service';

@Injectable()
export class SensorReadingService {
    constructor(
        @InjectRepository(SensorReading)
        private readonly sensorReadingRepository: Repository<SensorReading>,

        @InjectRepository(Room)
        private readonly roomRepository: Repository<Room>,

        @InjectRepository(Herb)
        private readonly herbRepository: Repository<Herb>,

        @InjectRepository(GrowConditions)
        private readonly growConditionsRepository: Repository<GrowConditions>,

        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(PumpCommand)
        private readonly pumpCommandRepository: Repository<PumpCommand>,

        @InjectRepository(LightCommand)
        private readonly lightCommandRepository: Repository<LightCommand>,

        private readonly emailService: EmailService
    ) {}

    async ingestSensorData(
        dto: SensorDataRequestDto
    ): Promise<{ success: boolean; pendingPumpCommand: any; pendingLightCommand: any }> {
        const room = await this.roomRepository.findOne({
            where: { id: dto.roomId },
            relations: { herbs: true, users: true },
        });
        if (!room) throw new NotFoundException('Room not found');

        // Save sensor reading
        const reading = this.sensorReadingRepository.create({
            temperature: dto.temperature,
            humidity: dto.humidity,
            soilMoisture: dto.soilMoisture,
            waterLevel: dto.waterLevel,
            room,
        });
        await this.sensorReadingRepository.save(reading);

        // Update room with latest values
        room.temperature = dto.temperature;
        room.humidity = dto.humidity;
        room.waterLevel = dto.waterLevel;
        await this.roomRepository.save(room);

        // Update herbs in this room
        for (const herb of room.herbs) {
            herb.temperature = dto.temperature;
            herb.humidity = dto.humidity;
            herb.soilMoisture = dto.soilMoisture;
            await this.herbRepository.save(herb);

            // Check thresholds
            await this.checkThresholds(herb, dto, room.users);
        }

        // Get pending pump command (piggybacking)
        const pendingCmd = await this.pumpCommandRepository.findOne({
            where: { room: { id: dto.roomId }, status: 'pending' as any },
            order: { createdAt: 'ASC' },
        });

        if (pendingCmd) {
            pendingCmd.status = 'acknowledged';
            pendingCmd.acknowledgedAt = new Date();
            await this.pumpCommandRepository.save(pendingCmd);
        }

        // Get pending light command (piggybacking)
        const pendingLightCmd = await this.lightCommandRepository.findOne({
            where: { room: { id: dto.roomId }, status: 'pending' as any },
            order: { createdAt: 'ASC' },
        });

        if (pendingLightCmd) {
            pendingLightCmd.status = 'acknowledged';
            pendingLightCmd.acknowledgedAt = new Date();
            await this.lightCommandRepository.save(pendingLightCmd);
        }

        return {
            success: true,
            pendingPumpCommand: pendingCmd
                ? {
                      action: pendingCmd.action,
                      durationSeconds: pendingCmd.durationSeconds ?? 5,
                  }
                : null,
            pendingLightCommand: pendingLightCmd
                ? {
                      action: pendingLightCmd.action,
                      mode: pendingLightCmd.mode,
                  }
                : null,
        };
    }

    async findByRoom(
        roomId: string,
        from?: string,
        to?: string,
        limit = 100
    ): Promise<SensorReading[]> {
        const where: any = { room: { id: roomId } };
        if (from) where.createdAt = MoreThanOrEqual(new Date(from));
        if (to)
            where.createdAt = {
                ...(where.createdAt || {}),
                ...LessThanOrEqual(new Date(to)),
            };

        return this.sensorReadingRepository.find({
            where,
            order: { createdAt: 'ASC' },
            take: limit,
        });
    }

    async findLatest(roomId: string): Promise<SensorReading | null> {
        return this.sensorReadingRepository.findOne({
            where: { room: { id: roomId } },
            order: { createdAt: 'DESC' },
        });
    }

    private async checkThresholds(
        herb: Herb,
        data: SensorDataRequestDto,
        users: User[]
    ): Promise<void> {
        const conditions = await this.growConditionsRepository.findOne({
            where: { herb: { id: herb.id } },
        });
        if (!conditions) return;

        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        // Check temperature
        if (
            data.temperature < conditions.minTemperature ||
            data.temperature > conditions.maxTemperature
        ) {
            await this.createThrottledNotification(
                `Teplota ${data.temperature}°C je mimo rozsah (${conditions.minTemperature}–${conditions.maxTemperature}°C) pro ${herb.name}`,
                'warning',
                herb,
                users,
                oneHourAgo
            );
        }

        // Check humidity
        if (
            data.humidity < conditions.minHumidity ||
            data.humidity > conditions.maxHumidity
        ) {
            await this.createThrottledNotification(
                `Vlhkost ${data.humidity}% je mimo rozsah (${conditions.minHumidity}–${conditions.maxHumidity}%) pro ${herb.name}`,
                'warning',
                herb,
                users,
                oneHourAgo
            );
        }

        // Check soil moisture - emergency if critically low
        if (data.soilMoisture < 20) {
            await this.createThrottledNotification(
                `Vlhkost půdy ${data.soilMoisture}% je kriticky nízká pro ${herb.name}! Zalijte rostlinu.`,
                'emergency',
                herb,
                users,
                oneHourAgo
            );
        }

        // Check water level - emergency if reservoir low
        if (data.waterLevel < 10) {
            await this.createThrottledNotification(
                `Hladina vody v nádrži je kriticky nízká (${data.waterLevel}%)! Doplňte vodu.`,
                'emergency',
                herb,
                users,
                oneHourAgo
            );
        }
    }

    private async createThrottledNotification(
        message: string,
        type: 'warning' | 'emergency',
        herb: Herb,
        users: User[],
        since: Date
    ): Promise<void> {
        // Check if similar notification was created recently
        const recent = await this.notificationRepository
            .createQueryBuilder('n')
            .innerJoin('n.herbs', 'h', 'h.id = :herbId', {
                herbId: herb.id,
            })
            .where('n.notificationType = :type', { type })
            .andWhere('n.createdAt > :since', { since })
            .getOne();

        if (recent) return;

        const notification = this.notificationRepository.create({
            notificationType: type,
            message,
            isRead: false,
            herbs: [herb],
            users,
        });
        const saved = await this.notificationRepository.save(notification);

        for (const user of users) {
            this.emailService.sendNotificationEmail(user.email, {
                type,
                message,
                herbNames: [herb.name],
            });
        }
    }
}
