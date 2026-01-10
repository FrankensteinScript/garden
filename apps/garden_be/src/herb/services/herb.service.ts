import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Herb } from '../entity/herb.entity';
import { Repository } from 'typeorm';
import { Room } from '../../room/entity/room.entity';
import { HerbRequestDto } from '../dtos/herbRequest.dto';

@Injectable()
export class HerbService {
    constructor(
        @InjectRepository(Herb)
        private readonly herbRepository: Repository<Herb>,
        @InjectRepository(Room)
        private readonly roomRepository: Repository<Room>
    ) {}

    //TODO: FIX SEED
    // async onModuleInit(): Promise<void> {
    //     await this.seedPlants();
    // }

    async seedPlants(): Promise<void> {
        const count = await this.herbRepository.count();
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

        await this.herbRepository.save(herbs);
    }

    async create(dto: HerbRequestDto): Promise<Herb> {
        const room = await this.roomRepository.findOneBy({ id: dto.roomId });
        if (!room) throw new NotFoundException('Room not found');

        const herb = this.herbRepository.create({ ...dto, room });
        return this.herbRepository.save(herb);
    }

    async findAll(): Promise<Herb[]> {
        return this.herbRepository.find({ relations: ['room'] });
    }

    async findOne(id: string): Promise<Herb> {
        const herb = await this.herbRepository.findOne({
            where: { id },
            relations: ['room'],
        });

        if (!herb) throw new NotFoundException('Herb not found');
        return herb;
    }

    async update(id: string, dto: HerbRequestDto): Promise<Herb> {
        const herb = await this.findOne(id);

        if (!herb) throw new NotFoundException('Herb not found');
        Object.assign(herb, dto);
        return this.herbRepository.save(herb);
    }

    async delete(id: string): Promise<void> {
        const herb = await this.findOne(id);
        await this.herbRepository.delete(herb);
    }
}
