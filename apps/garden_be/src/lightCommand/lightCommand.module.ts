import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LightCommand } from './entity/lightCommand.entity';
import { LightCommandController } from './lightCommand.controller';
import { LightCommandService } from './services/lightCommand.service';
import { Room } from '../room/entity/room.entity';

@Module({
    imports: [TypeOrmModule.forFeature([LightCommand, Room])],
    controllers: [LightCommandController],
    providers: [LightCommandService],
    exports: [LightCommandService],
})
export class LightCommandModule {}
