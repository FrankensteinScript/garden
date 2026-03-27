import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PumpCommandService } from './services/pumpCommand.service';
import { PumpCommandRequestDto } from './dtos/pumpCommandRequest.dto';
import { PumpCommandResponseDto } from './dtos/pumpCommandResponse.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('room/:roomId/pump')
export class PumpCommandController {
    constructor(private readonly pumpCommandService: PumpCommandService) {}

    @Post()
    async create(
        @Param('roomId') roomId: string,
        @Body() dto: PumpCommandRequestDto
    ): Promise<PumpCommandResponseDto> {
        const cmd = await this.pumpCommandService.create(roomId, dto);
        return {
            id: cmd.id,
            action: cmd.action,
            durationSeconds: cmd.durationSeconds,
            status: cmd.status,
            roomId,
            createdAt: cmd.createdAt,
        };
    }

    @Public()
    @Get('pending')
    async getPending(
        @Param('roomId') roomId: string
    ): Promise<PumpCommandResponseDto | null> {
        const cmd = await this.pumpCommandService.getPending(roomId);
        if (!cmd) return null;
        return {
            id: cmd.id,
            action: cmd.action,
            durationSeconds: cmd.durationSeconds,
            status: cmd.status,
            roomId,
            createdAt: cmd.createdAt,
        };
    }
}
