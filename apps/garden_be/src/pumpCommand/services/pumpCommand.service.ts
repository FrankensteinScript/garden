import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PumpCommand } from '../entity/pumpCommand.entity';
import { Room } from '../../room/entity/room.entity';
import { PumpCommandRequestDto } from '../dtos/pumpCommandRequest.dto';

@Injectable()
export class PumpCommandService {
    constructor(
        @InjectRepository(PumpCommand)
        private readonly pumpCommandRepository: Repository<PumpCommand>,

        @InjectRepository(Room)
        private readonly roomRepository: Repository<Room>
    ) {}

    async create(
        roomId: string,
        dto: PumpCommandRequestDto
    ): Promise<PumpCommand> {
        const room = await this.roomRepository.findOne({
            where: { id: roomId },
        });
        if (!room) throw new NotFoundException('Room not found');

        const command = this.pumpCommandRepository.create({
            action: dto.action,
            durationSeconds: dto.durationSeconds,
            status: 'pending',
            room,
        });
        return this.pumpCommandRepository.save(command);
    }

    async getPending(roomId: string): Promise<PumpCommand | null> {
        const command = await this.pumpCommandRepository.findOne({
            where: { room: { id: roomId }, status: 'pending' as any },
            order: { createdAt: 'ASC' },
        });

        if (command) {
            command.status = 'acknowledged';
            command.acknowledgedAt = new Date();
            await this.pumpCommandRepository.save(command);
        }

        return command;
    }
}
