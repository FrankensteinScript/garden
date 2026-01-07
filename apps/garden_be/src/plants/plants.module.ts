import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantsService } from './services/plants.service';
import { Plant } from './entity/plant.entity';
import { PlantsController } from './plants.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Plant])],
    controllers: [PlantsController],
    providers: [PlantsService],
    exports: [PlantsService],
})
export class PlantsModule {}
