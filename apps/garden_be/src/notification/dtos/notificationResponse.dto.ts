import { ApiProperty } from '@nestjs/swagger';
import {
    NotificationType,
    NotificationTypeEnum,
} from '../../utils/const/index';

export class NotificationResponseDto {
    @ApiProperty({
        description: 'Unique identifier of the notification',
        example: 'uuid-notification',
    })
    id: string;

    @ApiProperty({
        description: 'Type of the notification',
        example: 'LOW_SOIL_MOISTURE',
        enum: Object.values(NotificationType),
    })
    notificationType: NotificationTypeEnum;

    @ApiProperty({
        description: 'Notification message shown to the user',
        example: 'Soil moisture is below the optimal level',
    })
    message: string;

    @ApiProperty({
        description: 'Indicates whether the notification has been read',
        example: false,
    })
    isRead: boolean;

    @ApiProperty({
        description: 'IDs of herbs related to this notification',
        example: ['uuid-herb-1', 'uuid-herb-2'],
    })
    herbIds: string[];

    @ApiProperty({
        description: 'IDs of users who received this notification',
        example: ['uuid-user-1'],
    })
    userIds: string[];

    @ApiProperty({
        description: 'Date when the notification was created',
        example: '2026-01-09T10:00:00Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Date when the notification was last updated',
        example: '2026-01-09T10:05:00Z',
    })
    updatedAt: Date;
}
