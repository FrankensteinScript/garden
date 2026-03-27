import { ApiProperty } from '@nestjs/swagger';
import { PumpAction, PumpStatus } from '../../utils/const';

export class PumpCommandResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    action: PumpAction;

    @ApiProperty({ nullable: true })
    durationSeconds?: number;

    @ApiProperty()
    status: PumpStatus;

    @ApiProperty()
    roomId: string;

    @ApiProperty()
    createdAt: Date;
}
