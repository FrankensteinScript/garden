import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantsService } from './services/plants.service';
import { Plant } from './entity/plant.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Plant])],
    providers: [PlantsService],
    exports: [PlantsService],
})
export class PlantsModule {}
