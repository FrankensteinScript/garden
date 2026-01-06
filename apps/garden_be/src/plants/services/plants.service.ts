import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plant } from '../entity/plant.entity';

@Injectable()
export class PlantsService implements OnModuleInit {
    private readonly logger = new Logger(PlantsService.name);

    constructor(
        @InjectRepository(Plant)
        private readonly plantRepository: Repository<Plant>
    ) {}

    async onModuleInit(): Promise<void> {
        await this.seedPlants();
    }

    async seedPlants(): Promise<void> {
        const count = await this.plantRepository.count();

        if (count > 0) return;

        this.logger.log('Seeding initial plants...');

        const plants: Partial<Plant>[] = [
            { name: 'Basil' },
            { name: 'Mint' },
            { name: 'Rosemary' },
            { name: 'Thyme' },
        ];

        await this.plantRepository.save(plants);

        this.logger.log(`Seeded ${plants.length} plants.`);
    }

    /**
     * Example getter
     */
    async findAll(): Promise<Plant[]> {
        return this.plantRepository.find();
    }
}
