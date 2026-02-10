import { ApiProperty } from '@nestjs/swagger';

export class HerbResponseDto {
    @ApiProperty({
        description: 'Unique identifier of the herb',
        example: 'uuid-herb',
    })
    id: string;

    @ApiProperty({
        description: 'Name of the herb',
        example: 'Basil',
    })
    name: string;

    @ApiProperty({
        description: 'Description of the herb',
        example: 'A fragrant herb commonly used in cooking',
    })
    description: string;

    @ApiProperty({
        description: 'Current temperature around the herb (°C)',
        example: 22,
    })
    temperature: number;

    @ApiProperty({
        description: 'Current humidity around the herb (%)',
        example: 60,
    })
    humidity: number;

    @ApiProperty({
        description: 'Current soil moisture level (%)',
        example: 35,
    })
    soilMoisture: number;

    @ApiProperty({
        description: 'Date and time of the last watering',
        example: '2026-01-09T12:00:00Z',
    })
    lastWatering: Date;

    @ApiProperty({
        description: 'ID of the room where the herb is located',
        example: 'uuid-room',
        required: false,
        nullable: true,
    })
    roomId?: string;

    @ApiProperty({
        description: 'IDs of notifications related to this herb',
        example: ['uuid-notification-1', 'uuid-notification-2'],
        type: [String],
    })
    notificationIds: string[];

    @ApiProperty({
        description: 'IDs of history records (watering, measurements)',
        example: ['uuid-history-1', 'uuid-history-2'],
        type: [String],
    })
    historyIds: string[];

    @ApiProperty({
        description: 'ID of grow conditions associated with this herb',
        example: 'uuid-grow-conditions',
    })
    growConditionId: string;

    @ApiProperty({
        description: 'Date when the herb was created',
        example: '2026-01-01T08:00:00Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Date of last update',
        example: '2026-01-09T10:30:00Z',
    })
    updatedAt: Date;
}
