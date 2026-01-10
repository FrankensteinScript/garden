import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from './entity/history.entity';
import { HistoryController } from './history.controller';
import { HistoryService } from './services/history.service';

@Module({
    imports: [TypeOrmModule.forFeature([History])],
    controllers: [HistoryController],
    providers: [HistoryService],
    exports: [HistoryService],
})
export class HistoryModule {}
