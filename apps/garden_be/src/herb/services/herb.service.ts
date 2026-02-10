import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Herb } from '../entity/herb.entity';
import { Room } from '../../room/entity/room.entity';
import { HerbRequestDto } from '../dtos/herbRequest.dto';
import { BaseCrudService } from '../../BaseCrudService';

@Injectable()
export class HerbService extends BaseCrudService<Herb> {
    constructor(
        @InjectRepository(Herb)
        herbRepository: Repository<Herb>,

        @InjectRepository(Room)
        private readonly roomRepository: Repository<Room>
    ) {
        super(herbRepository, 'Herb', { room: true });
    }

    async create(dto: HerbRequestDto): Promise<Herb> {
        const room = await this.roomRepository.findOne({
            where: { id: dto.roomId },
        });
        if (!room) throw new NotFoundException('Room not found');

        const herb = this.repository.create({ ...dto, room });
        return this.repository.save(herb);
    }

    async seedPlants(): Promise<void> {
        const count = await this.repository.count();
        if (count > 0) return;

        const herbs: Partial<Herb>[] = [
            {
                name: 'Bazalka',
                description: 'Aromatická bylina vhodná do kuchyně.',
                temperature: 22,
                humidity: 60,
                soilMoisture: 40,
                lastWatering: new Date(),
            },
            {
                name: 'Máta',
                description: 'Osvěžující bylina, nenáročná na pěstování.',
                temperature: 20,
                humidity: 65,
                soilMoisture: 50,
                lastWatering: new Date(),
            },
            {
                name: 'Rozmarýn',
                description: 'Středomořská bylina, má ráda sušší půdu.',
                temperature: 24,
                humidity: 45,
                soilMoisture: 30,
                lastWatering: new Date(),
            },
        ];

        await this.repository.save(herbs);
    }

    async findById(id: string): Promise<Herb> {
        return this.findOne({ id });
    }
}
