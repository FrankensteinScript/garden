import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { RoomService } from './services/room.service';
import { RoomResponseDto } from './dtos/roomResponse.dto';
import { toRoomResponseDto } from './room.mapper';
import { RoomRequestDto } from './dtos/roomRequest.dto';

@Controller()
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    @Get()
    async findAll(): Promise<RoomResponseDto[]> {
        const rooms = await this.roomService.findAll();
        return rooms.map(toRoomResponseDto);
    }

    @Get(':id')
    async findOne(@Param() id: string): Promise<RoomResponseDto> {
        const room = await this.roomService.findOne(id);
        return toRoomResponseDto(room);
    }

    @Post()
    async create(@Body() dto: RoomRequestDto): Promise<RoomResponseDto> {
        const room = await this.roomService.create(dto);
        return toRoomResponseDto(room);
    }

    @Put(':id')
    async update(
        @Param() id: string,
        @Body() dto: RoomResponseDto
    ): Promise<RoomResponseDto> {
        const room = await this.roomService.update(id, dto);
        return toRoomResponseDto(room);
    }

    @Delete(':id')
    async delete(@Param() id: string): Promise<void> {
        await this.roomService.delete(id);
    }
}
