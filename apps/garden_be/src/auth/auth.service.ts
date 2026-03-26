import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/services/user.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { User } from '../user/entity/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    async register(dto: RegisterDto) {
        const existing = await this.userService.findByEmail(dto.email);
        if (existing) {
            throw new ConflictException('Uživatel s tímto e-mailem již existuje');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.userService.create({
            name: dto.name,
            email: dto.email,
            password: hashedPassword,
        });

        return this.buildResponse(user);
    }

    async login(dto: LoginDto) {
        const user = await this.userService.findByEmail(dto.email);
        if (!user) {
            throw new UnauthorizedException('Neplatné přihlašovací údaje');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Neplatné přihlašovací údaje');
        }

        return this.buildResponse(user);
    }

    async getProfile(userId: string) {
        const user = await this.userService.findOne({ id: userId } as any);
        return {
            id: user.id,
            name: user.name,
            email: user.email,
        };
    }

    private buildResponse(user: User) {
        const payload = { sub: user.id, email: user.email };
        return {
            accessToken: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    }
}
