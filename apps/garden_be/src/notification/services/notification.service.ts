import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Notification } from '../entity/notification.entity';
import { Herb } from '../../herb/entity/herb.entity';
import { User } from '../../user/entity/user.entity';
import { NotificationRequestDto } from '../dtos/notificationRequest.dto';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,

        @InjectRepository(Herb)
        private readonly herbRepository: Repository<Herb>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async create(dto: NotificationRequestDto): Promise<Notification> {
        const herbs = dto.herbIds?.length
            ? await this.herbRepository.findBy({
                  id: In(dto.herbIds),
              })
            : [];

        const users = dto.userIds?.length
            ? await this.userRepository.findBy({
                  id: In(dto.userIds),
              })
            : [];

        if (dto.herbIds?.length && herbs.length === 0) {
            throw new NotFoundException('Herbs not found');
        }

        if (dto.userIds?.length && users.length === 0) {
            throw new NotFoundException('Users not found');
        }

        const notification = this.notificationRepository.create({
            notificationType: dto.notificationType,
            message: dto.message,
            isRead: false,
            herbs,
            users,
        });

        return this.notificationRepository.save(notification);
    }

    async findAll(): Promise<Notification[]> {
        return this.notificationRepository.find({
            relations: ['herbs', 'users'],
        });
    }

    async findOne(id: string): Promise<Notification> {
        const notification = await this.notificationRepository.findOne({
            where: { id },
            relations: ['herbs', 'users'],
        });

        if (!notification) {
            throw new NotFoundException('Notification not found');
        }

        return notification;
    }

    async markAsRead(id: string): Promise<Notification> {
        const notification = await this.findOne(id);

        notification.isRead = true;
        return this.notificationRepository.save(notification);
    }

    async delete(id: string): Promise<void> {
        const result = await this.notificationRepository.delete(id);

        if (!result.affected)
            throw new NotFoundException('Notification not found');
    }
}
