import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Room } from '../entity/room.entity';
import { Herb } from '../../herb/entity/herb.entity';
import { User } from '../../user/entity/user.entity';
import { RoomRequestDto } from '../dtos/roomRequest.dto';
import { BaseCrudService } from '../../BaseCrudService';

@Injectable()
export class RoomService extends BaseCrudService<Room> {
    constructor(
        @InjectRepository(Room)
        roomRepository: Repository<Room>,

        @InjectRepository(Herb)
        private readonly herbRepository: Repository<Herb>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {
        super(roomRepository, 'Room', { herbs: true, users: true });
    }

    async create(dto: RoomRequestDto): Promise<Room> {
        const herbs = dto.herbIds?.length
            ? await this.herbRepository.findBy({ id: In(dto.herbIds) })
            : [];

        const users = dto.userIds?.length
            ? await this.userRepository.findBy({ id: In(dto.userIds) })
            : [];

        if (dto.herbIds?.length && herbs.length === 0)
            throw new NotFoundException('Herbs not found');

        if (dto.userIds?.length && users.length === 0)
            throw new NotFoundException('Users not found');

        const room = this.repository.create({ ...dto, herbs, users });
        return this.repository.save(room);
    }

    async findById(id: string): Promise<Room> {
        return this.findOne({ id });
    }
}
