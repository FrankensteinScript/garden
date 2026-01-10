import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrowConditions } from './entity/growConditions.entity';
import { GrowConditionsController } from './growConditions.controller';
import { GrowConditionsService } from './services/growConditions.service';
import { Herb } from '../herb/entity/herb.entity';

@Module({
    imports: [TypeOrmModule.forFeature([GrowConditions, Herb])],
    controllers: [GrowConditionsController],
    providers: [GrowConditionsService],
    exports: [GrowConditionsService],
})
export class GrowConditionsModule {}
