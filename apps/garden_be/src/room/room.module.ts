import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entity/room.entity';
import { RoomController } from './room.controller';
import { RoomService } from './services/room.service';
import { Herb } from '../herb/entity/herb.entity';
import { User } from '../user/entity/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Room, Herb, User])],
    controllers: [RoomController],
    providers: [RoomService],
    exports: [RoomService],
})
export class RoomModule {}
