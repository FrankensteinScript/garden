import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'Jan Novák' })
    @IsString()
    name!: string;

    @ApiProperty({ example: 'jan@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'secret123', minLength: 6 })
    @IsString()
    @MinLength(6)
    password!: string;
}
