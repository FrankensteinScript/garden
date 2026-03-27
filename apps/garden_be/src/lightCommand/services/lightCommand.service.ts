import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LightCommand } from '../entity/lightCommand.entity';
import { Room } from '../../room/entity/room.entity';
import { LightCommandRequestDto } from '../dtos/lightCommandRequest.dto';

@Injectable()
export class LightCommandService {
    constructor(
        @InjectRepository(LightCommand)
        private readonly lightCommandRepository: Repository<LightCommand>,

        @InjectRepository(Room)
        private readonly roomRepository: Repository<Room>
    ) {}

    async create(
        roomId: string,
        dto: LightCommandRequestDto
    ): Promise<LightCommand> {
        const room = await this.roomRepository.findOne({
            where: { id: roomId },
        });
        if (!room) throw new NotFoundException('Room not found');

        // Update room light state
        room.lightMode = dto.mode;
        room.isLightOn = dto.action === 'on';
        await this.roomRepository.save(room);

        const command = this.lightCommandRepository.create({
            action: dto.action,
            mode: dto.mode,
            status: 'pending',
            room,
        });
        return this.lightCommandRepository.save(command);
    }

    async getPending(roomId: string): Promise<LightCommand | null> {
        const command = await this.lightCommandRepository.findOne({
            where: { room: { id: roomId }, status: 'pending' as any },
            order: { createdAt: 'ASC' },
        });

        if (command) {
            command.status = 'acknowledged';
            command.acknowledgedAt = new Date();
            await this.lightCommandRepository.save(command);
        }

        return command;
    }

    async getStatus(roomId: string): Promise<{ isLightOn: boolean; lightMode: string }> {
        const room = await this.roomRepository.findOne({
            where: { id: roomId },
        });
        if (!room) throw new NotFoundException('Room not found');

        return {
            isLightOn: room.isLightOn,
            lightMode: room.lightMode,
        };
    }
}
