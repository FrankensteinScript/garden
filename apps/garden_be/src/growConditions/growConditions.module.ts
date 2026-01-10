import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrowConditions } from './entity/growConditions.entity';
import { GrowConditionsController } from './growConditions.controller';
import { GrowConditionsService } from './services/growConditions.service';

@Module({
    imports: [TypeOrmModule.forFeature([GrowConditions])],
    controllers: [GrowConditionsController],
    providers: [GrowConditionsService],
    exports: [GrowConditionsService],
})
export class GrowConditionsModule {}
