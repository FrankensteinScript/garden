import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
    @ApiProperty({
        description: 'Unique identifier of the user',
        example: 'uuid-user',
    })
    id: string;

    @ApiProperty({
        description: 'Full name of the user',
        example: 'Patrik Ludvik',
    })
    name: string;

    @ApiProperty({
        description: 'Email address of the user',
        example: 'patrik.ludvik@example.com',
    })
    email: string;

    @ApiProperty({
        description: 'IDs of rooms the user has access to',
        example: ['uuid-room-1', 'uuid-room-2'],
    })
    roomIds: string[];

    @ApiProperty({
        description: 'IDs of notifications assigned to the user',
        example: ['uuid-notification-1'],
    })
    notificationIds: string[];

    @ApiProperty({
        description: 'Date when the user was created',
        example: '2026-01-09T09:00:00Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Date when the user was last updated',
        example: '2026-01-09T09:15:00Z',
    })
    updatedAt: Date;
}
