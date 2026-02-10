import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Notification } from '../entity/notification.entity';
import { Herb } from '../../herb/entity/herb.entity';
import { User } from '../../user/entity/user.entity';
import { NotificationRequestDto } from '../dtos/notificationRequest.dto';
import { BaseCrudService } from '../../BaseCrudService';

@Injectable()
export class NotificationService extends BaseCrudService<Notification> {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,

        @InjectRepository(Herb)
        private readonly herbRepository: Repository<Herb>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {
        super(notificationRepository, 'Notification', {
            herbs: true,
            users: true,
        });
    }

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

    async markAsRead(id: string): Promise<Notification> {
        const notification = await this.findOne({ id });

        notification.isRead = true;
        return this.notificationRepository.save(notification);
    }
}
