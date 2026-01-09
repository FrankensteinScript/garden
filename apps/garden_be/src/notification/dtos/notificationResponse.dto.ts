import { NotificationTypeEnum } from '../../utils/const';

export class NotificationResponseDto {
    id: string;
    notificationType: NotificationTypeEnum;
    message: string;
    isRead: boolean;
    herbIds: string[];
    userIds: string[];
    createdAt: Date;
    updatedAt: Date;
}
