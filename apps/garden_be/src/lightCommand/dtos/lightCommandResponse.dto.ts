import { ApiProperty } from '@nestjs/swagger';
import { LightAction, LightStatus, LightMode } from '../../utils/const';

export class LightCommandResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    action: LightAction;

    @ApiProperty()
    mode: LightMode;

    @ApiProperty()
    status: LightStatus;

    @ApiProperty()
    roomId: string;

    @ApiProperty()
    createdAt: Date;
}
