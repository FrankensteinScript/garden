import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Herb } from './entity/herb.entity';
import { HerbController } from './herb.controller';
import { HerbService } from './services/herb.service';

@Module({
    imports: [TypeOrmModule.forFeature([Herb])],
    controllers: [HerbController],
    providers: [HerbService],
    exports: [HerbService],
})
export class HerbModule {}
