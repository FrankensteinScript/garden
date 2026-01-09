import { ApiProperty } from '@nestjs/swagger';

export class RoomResponseDto {
    @ApiProperty({ example: 'uuid-room' })
    id: string;

    @ApiProperty({ example: 'Living room' })
    name: string;

    @ApiProperty({
        example: 'Room with herbs near the window',
        nullable: true,
    })
    description?: string;

    @ApiProperty({ example: 22.5 })
    temperature: number;

    @ApiProperty({ example: 55 })
    humidity: number;

    @ApiProperty({ example: 80 })
    waterLevel: number;

    @ApiProperty({
        description: 'Herbs in the room (IDs)',
        example: ['uuid-herb-1', 'uuid-herb-2'],
    })
    herbIds: string[];

    @ApiProperty({
        description: 'Users assigned to the room (IDs)',
        example: ['uuid-user-1'],
    })
    userIds: string[];

    @ApiProperty({ example: '2026-01-09T12:00:00Z' })
    createdAt: Date;

    @ApiProperty({ example: '2026-01-09T12:00:00Z' })
    updatedAt: Date;
}
