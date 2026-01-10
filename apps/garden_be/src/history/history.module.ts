import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from './entity/history.entity';
import { HistoryController } from './history.controller';
import { HistoryService } from './services/history.service';
import { Herb } from '../herb/entity/herb.entity';

@Module({
    imports: [TypeOrmModule.forFeature([History, Herb])],
    controllers: [HistoryController],
    providers: [HistoryService],
    exports: [HistoryService],
})
export class HistoryModule {}
