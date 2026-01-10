import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import type { HerbService } from './services/herb.service';
import type { HerbResponseDto } from './dtos/herbResponse.dto';
import { toHerbResponseDto } from './herb.mapper';
import { HerbRequestDto } from './dtos/herbRequest.dto';

@Controller('herb')
export class HerbController {
    constructor(private readonly herbService: HerbService) {}

    @Get()
    async findAll(): Promise<HerbResponseDto[]> {
        const herbs = await this.herbService.findAll();
        return herbs.map(toHerbResponseDto);
    }

    @Get(':id')
    async findOne(@Param() id: string): Promise<HerbResponseDto> {
        const herb = await this.herbService.findOne(id);
        return toHerbResponseDto(herb);
    }

    @Post()
    async create(@Body() dto: HerbRequestDto): Promise<HerbResponseDto> {
        const herb = await this.herbService.create(dto);
        return toHerbResponseDto(herb);
    }

    @Put(':id')
    async update(
        @Param(':id') id: string,
        @Body() dto: HerbRequestDto
    ): Promise<HerbResponseDto> {
        const herb = await this.herbService.update(id, dto);
        return toHerbResponseDto(herb);
    }

    @Delete(':id')
    async delete(@Param(':id') id: string): Promise<void> {
        await this.herbService.delete(id);
    }
}
