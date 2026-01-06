import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plant } from './entity/plant.entity';
import { PlantsService } from './services/plants.service';
import { PlantsController } from './plants.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Plant])],
    providers: [PlantsService],
    controllers: [PlantsController],
    exports: [PlantsService],
})
export class PlantsModule {}
