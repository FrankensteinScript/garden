import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { LIGHT_ACTIONS, LightAction, LIGHT_MODES, LightMode } from '../../utils/const';

export class LightCommandRequestDto {
    @ApiProperty({ description: 'Light action', enum: LIGHT_ACTIONS, example: 'on' })
    @IsEnum(LIGHT_ACTIONS)
    action: LightAction;

    @ApiProperty({ description: 'Light mode (growth=18h, bloom=12h)', enum: LIGHT_MODES, example: 'growth' })
    @IsEnum(LIGHT_MODES)
    mode: LightMode;
}
