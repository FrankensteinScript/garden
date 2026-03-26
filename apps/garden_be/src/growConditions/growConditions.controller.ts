import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { GrowConditionsService } from './services/growConditions.service';
import { GrowConditionsRequestDto } from './dtos/growConditionsRequest.dto';
import { GrowConditionsResponseDto } from './dtos/growConditionsResponse.dto';
import { toGrowConditionsResponseDto } from './growConditions.mapper';

@Controller('growConditions')
export class GrowConditionsController {
    constructor(
        private readonly growConditionsService: GrowConditionsService
    ) {}

    @Post()
    async create(
        @Body() dto: GrowConditionsRequestDto
    ): Promise<GrowConditionsResponseDto> {
        const growConditions = await this.growConditionsService.create(dto);
        return toGrowConditionsResponseDto(growConditions);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<GrowConditionsResponseDto> {
        const growConditions = await this.growConditionsService.findOne({ id } as any);
        return toGrowConditionsResponseDto(growConditions);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: GrowConditionsRequestDto
    ): Promise<GrowConditionsResponseDto> {
        const growConditions = await this.growConditionsService.update({ id } as any, dto);
        return toGrowConditionsResponseDto(growConditions);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        await this.growConditionsService.delete({ id } as any);
    }
}
