import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PumpCommand } from './entity/pumpCommand.entity';
import { PumpCommandController } from './pumpCommand.controller';
import { PumpCommandService } from './services/pumpCommand.service';
import { Room } from '../room/entity/room.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PumpCommand, Room])],
    controllers: [PumpCommandController],
    providers: [PumpCommandService],
    exports: [PumpCommandService],
})
export class PumpCommandModule {}
