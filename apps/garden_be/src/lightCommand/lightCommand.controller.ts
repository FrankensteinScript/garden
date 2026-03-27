import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LightCommandService } from './services/lightCommand.service';
import { LightCommandRequestDto } from './dtos/lightCommandRequest.dto';
import { LightCommandResponseDto } from './dtos/lightCommandResponse.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('room/:roomId/light')
export class LightCommandController {
    constructor(private readonly lightCommandService: LightCommandService) {}

    @Post()
    async create(
        @Param('roomId') roomId: string,
        @Body() dto: LightCommandRequestDto
    ): Promise<LightCommandResponseDto> {
        const cmd = await this.lightCommandService.create(roomId, dto);
        return {
            id: cmd.id,
            action: cmd.action,
            mode: cmd.mode,
            status: cmd.status,
            roomId,
            createdAt: cmd.createdAt,
        };
    }

    @Public()
    @Get('pending')
    async getPending(
        @Param('roomId') roomId: string
    ): Promise<LightCommandResponseDto | null> {
        const cmd = await this.lightCommandService.getPending(roomId);
        if (!cmd) return null;
        return {
            id: cmd.id,
            action: cmd.action,
            mode: cmd.mode,
            status: cmd.status,
            roomId,
            createdAt: cmd.createdAt,
        };
    }

    @Get('status')
    async getStatus(
        @Param('roomId') roomId: string
    ): Promise<{ isLightOn: boolean; lightMode: string }> {
        return this.lightCommandService.getStatus(roomId);
    }
}
