import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Herb } from './entity/herb.entity';
import { HerbController } from './herb.controller';
import { HerbService } from './services/herb.service';
import { Room } from '../room/entity/room.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Herb, Room])],
    controllers: [HerbController],
    providers: [HerbService],
    exports: [HerbService],
})
export class HerbModule {}
