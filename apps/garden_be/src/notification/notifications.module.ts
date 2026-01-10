import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entity/notification.entity';
import { NotificationController } from './notification.controller';
import { NotificationService } from './services/notification.service';
import { Herb } from '../herb/entity/herb.entity';
import { User } from '../user/entity/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Notification, Herb, User])],
    controllers: [NotificationController],
    providers: [NotificationService],
    exports: [NotificationService],
})
export class NotificationsModule {}
