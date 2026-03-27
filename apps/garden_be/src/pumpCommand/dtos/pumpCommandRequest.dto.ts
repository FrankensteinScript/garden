import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { PUMP_ACTIONS, PumpAction } from '../../utils/const';

export class PumpCommandRequestDto {
    @ApiProperty({ description: 'Pump action', enum: PUMP_ACTIONS, example: 'on' })
    @IsEnum(PUMP_ACTIONS)
    action: PumpAction;

    @ApiProperty({ description: 'Duration in seconds', example: 5, required: false })
    @IsOptional()
    @IsInt()
    @Min(1)
    durationSeconds?: number;
}
