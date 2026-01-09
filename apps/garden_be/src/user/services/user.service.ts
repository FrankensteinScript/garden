import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { UserRequestDto } from '../dtos/userRequest.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async create(dto: UserRequestDto): Promise<User> {
        const user = this.userRepository.create(dto);
        return this.userRepository.save(user);
    }

    async findOne(id: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });

        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find({ relations: ['user'] });
    }

    async update(id: string, dto: UserRequestDto): Promise<User> {
        const user = await this.findOne(id);

        if (!user) throw new NotFoundException('User not found');
        Object.assign(user, dto);
        return this.userRepository.save(user);
    }

    async delete(id: string): Promise<void> {
        const user = await this.findOne(id);
        if (!user) throw new NotFoundException('User not found');

        await this.userRepository.delete(user);
    }
}
