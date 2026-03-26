import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsOptional,
    IsString,
} from 'class-validator';
import { NotificationType, NotificationTypeEnum } from '../../utils/const';

export class NotificationRequestDto {
    @ApiProperty({
        description: 'Type of notification',
        enum: NotificationTypeEnum,
        example: NotificationTypeEnum.WARNING,
    })
    @IsEnum(NotificationTypeEnum)
    notificationType: NotificationType;

    @ApiProperty({
        description: 'Notification message content',
        example: 'Your basil needs watering',
    })
    @IsString()
    message: string;

    @ApiProperty({
        description: 'Whether the notification has been read',
        example: false,
    })
    @IsBoolean()
    isRead: boolean;

    @ApiProperty({
        description: 'IDs of herbs this notification is related to',
        example: ['uuid-of-herb1', 'uuid-of-herb2'],
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    herbIds?: string[];

    @ApiProperty({
        description: 'IDs of users this notification is for',
        example: ['uuid-of-user1', 'uuid-of-user2'],
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    userIds?: string[];
}
