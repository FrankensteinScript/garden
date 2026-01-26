import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { UserRequestDto } from '../dtos/userRequest.dto';
import { BaseCrudService } from '../../BaseCrudService';

@Injectable()
export class UserService extends BaseCrudService<User> {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {
        super(userRepository, 'User');
    }

    async create(dto: UserRequestDto): Promise<User> {
        const user = this.userRepository.create(dto);
        return this.userRepository.save(user);
    }
}
