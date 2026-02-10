import { Notification } from '../notification/entity/notification.entity';
import { NotificationResponseDto } from './dtos/notificationResponse.dto';

export const toNotificationResponseDto = (
    notification: Notification
): NotificationResponseDto => ({
    id: notification.id,
    notificationType: notification.notificationType,
    message: notification.message,
    isRead: notification.isRead,
    herbIds: notification.herbs?.map((h) => h.id) ?? [],
    userIds: notification.users?.map((u) => u.id) ?? [],
    createdAt: notification.createdAt,
    updatedAt: notification.updatedAt,
});
