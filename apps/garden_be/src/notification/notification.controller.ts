import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { NotificationService } from './services/notification.service';
import { NotificationRequestDto } from './dtos/notificationRequest.dto';
import { toNotificationResponseDto } from './notification.mapper';
import { NotificationResponseDto } from './dtos/notificationResponse.dto';

@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Get()
    async findAll(): Promise<NotificationResponseDto[]> {
        const notifications = await this.notificationService.findAll();
        return notifications.map(toNotificationResponseDto);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<NotificationResponseDto> {
        const notification = await this.notificationService.findOne({ id } as any);
        return toNotificationResponseDto(notification);
    }

    @Post()
    async create(
        @Body() dto: NotificationRequestDto
    ): Promise<NotificationResponseDto> {
        const notification = await this.notificationService.create(dto);
        return toNotificationResponseDto(notification);
    }

    @Put(':id')
    async markAsRead(@Param('id') id: string): Promise<NotificationResponseDto> {
        const notification = await this.notificationService.markAsRead(id);

        return toNotificationResponseDto(notification);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        await this.notificationService.delete({ id } as any);
    }
}
