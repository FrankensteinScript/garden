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

@Controller('room')
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    @Get()
    async findAll(): Promise<RoomResponseDto[]> {
        const rooms = await this.roomService.findAll();
        return rooms.map(toRoomResponseDto);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<RoomResponseDto> {
        const room = await this.roomService.findOne({ id } as any);
        return toRoomResponseDto(room);
    }

    @Post()
    async create(@Body() dto: RoomRequestDto): Promise<RoomResponseDto> {
        const room = await this.roomService.create(dto);
        return toRoomResponseDto(room);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: RoomResponseDto
    ): Promise<RoomResponseDto> {
        const room = await this.roomService.update({ id } as any, dto);
        return toRoomResponseDto(room);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        await this.roomService.delete({ id } as any);
    }
}
