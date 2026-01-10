import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import type { UserService } from './services/user.service';
import type { UserResponseDto } from './dtos/userResponse.dto';
import { toUserResponseDto } from './user.mapper';
import type { UserRequestDto } from './dtos/userRequest.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async findAll(): Promise<UserResponseDto[]> {
        const users = await this.userService.findAll();
        return users.map(toUserResponseDto);
    }

    @Get(':id')
    async findOne(@Param() id: string): Promise<UserResponseDto> {
        const user = await this.userService.findOne(id);
        return toUserResponseDto(user);
    }

    @Post()
    async create(@Body() dto: UserRequestDto): Promise<UserResponseDto> {
        const user = await this.userService.create(dto);
        return toUserResponseDto(user);
    }

    @Put(':id')
    async update(
        @Param() id: string,
        @Body() dto: UserRequestDto
    ): Promise<UserResponseDto> {
        const user = await this.userService.update(id, dto);
        return toUserResponseDto(user);
    }

    @Delete(':id')
    async delete(@Param() id: string): Promise<void> {
        await this.userService.delete(id);
    }
}
