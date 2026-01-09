import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsArray } from 'class-validator';

export class UserRequestDto {
    @ApiProperty({ description: 'Name of the user', example: 'John Doe' })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Email of the user',
        example: 'john.doe@example.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Password for the user', example: 'secret123' })
    @IsString()
    password: string;

    @ApiProperty({
        description: 'IDs of rooms associated with the user',
        example: ['uuid-room1', 'uuid-room2'],
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    roomIds?: string[];

    @ApiProperty({
        description: 'IDs of notifications for the user',
        example: ['uuid-notification1'],
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    notificationIds?: string[];
}
