import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plant } from '../entity/plant.entity';

@Injectable()
export class PlantsService {
    constructor(
        @InjectRepository(Plant)
        private readonly plantRepo: Repository<Plant>
    ) {}

    findAll() {
        return this.plantRepo.find();
    }

    async create(name: string) {
        const plant = this.plantRepo.create({ name });
        return this.plantRepo.save(plant);
    }

    async seedPlants() {
        const count = await this.plantRepo.count();
        if (count === 0) {
            const plants = this.plantRepo.create([
                { name: 'Bazalka' },
                { name: 'Máta' },
                { name: 'Rozmarýn' },
            ]);
            await this.plantRepo.save(plants);
            console.log('🌱 Plants seeded successfully!');
        }
    }
}
