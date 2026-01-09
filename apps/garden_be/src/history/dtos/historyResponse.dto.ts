import { ApiProperty } from '@nestjs/swagger';

export class HistoryResponseDto {
    @ApiProperty({
        description: 'Unique identifier of the history record',
        example: 'uuid-history',
    })
    id: string;

    @ApiProperty({
        description: 'Date and time when the herb was watered',
        example: '2026-01-09T08:30:00Z',
    })
    wateredAt: Date;

    @ApiProperty({
        description: 'Amount of water used for watering (in ml)',
        example: 250,
    })
    amountWater: number;

    @ApiProperty({
        description: 'Measured temperature at the time of watering (°C)',
        example: 22.5,
    })
    temperature: number;

    @ApiProperty({
        description: 'Optional notes related to this watering event',
        example: 'Plant looked dry, increased water amount',
        required: false,
        nullable: true,
    })
    notes?: string;

    @ApiProperty({
        description: 'ID of the herb this history record belongs to',
        example: 'uuid-herb',
    })
    herbId: string;

    @ApiProperty({
        description: 'Date when this history record was created',
        example: '2026-01-09T08:30:00Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Date of last update of this history record',
        example: '2026-01-09T09:00:00Z',
    })
    updatedAt: Date;
}
