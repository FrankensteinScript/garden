import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Herb } from '../../herb/entity/herb.entity';
import { Room } from '../entity/room.entity';
import { User } from '../../user/entity/user.entity';
import { RoomRequestDto } from '../dtos/roomRequest.dto';

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(Room)
        private readonly roomRepository: Repository<Room>,

        @InjectRepository(Herb)
        private readonly herbRepository: Repository<Herb>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async create(dto: RoomRequestDto): Promise<Room> {
        const herbs = dto.herbIds?.length
            ? await this.herbRepository.findBy({ id: In(dto.herbIds) })
            : [];

        const users = dto.userIds?.length
            ? await this.userRepository.findBy({ id: In(dto.userIds) })
            : [];

        if (!herbs) throw new NotFoundException('Herb not found');

        if (!users) throw new NotFoundException('User not found');

        const room = this.roomRepository.create({
            name: dto.name,
            description: dto?.description,
            temperature: dto.temperature,
            humidity: dto.humidity,
            waterLevel: dto.waterLevel,
            herbs: herbs,
            users: users,
        });

        return this.roomRepository.save(room);
    }

    async findOne(id: string): Promise<Room> {
        const room = await this.roomRepository.findOne({
            where: { id },
            relations: ['herb', 'user'],
        });

        if (!room) throw new NotFoundException('Room not found');

        return room;
    }

    async findAll(): Promise<Room[]> {
        return this.roomRepository.find({
            relations: ['herbs', 'users'],
        });
    }

    async update(id: string, dto: RoomRequestDto): Promise<Room> {
        const room = await this.findOne(id);

        Object.assign(room, dto);

        return await this.roomRepository.save(room);
    }

    async delete(id: string): Promise<void> {
        const room = await this.roomRepository.delete(id);
        if (!room) throw new NotFoundException('Room not found');
    }
}
