import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { HistoryService } from './services/history.service';
import { HistoryRequestDto } from './dtos/historyRequest.dto';
import { toHistoryResponseDto } from './history.mapper';
import { HistoryResponseDto } from './dtos/historyResponse.dto';

@Controller('history')
export class HistoryController {
    constructor(private readonly historyService: HistoryService) {}

    @Post()
    async create(@Body() dto: HistoryRequestDto): Promise<HistoryResponseDto> {
        const history = await this.historyService.create(dto);
        return toHistoryResponseDto(history);
    }

    @Get()
    async findAll(): Promise<HistoryResponseDto[]> {
        const histories = await this.historyService.findAll();
        return histories.map(toHistoryResponseDto);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<HistoryResponseDto> {
        const history = await this.historyService.findOne({ id } as any);
        return toHistoryResponseDto(history);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: HistoryRequestDto
    ): Promise<HistoryResponseDto> {
        const history = await this.historyService.update({ id } as any, dto);
        return toHistoryResponseDto(history);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        await this.historyService.delete({ id } as any);
    }
}
