import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GrowConditions } from '../entity/growConditions.entity';
import { Repository } from 'typeorm';
import { Herb } from '../../herb/entity/herb.entity';
import { GrowConditionsRequestDto } from '../dtos/growConditionsRequest.dto';
import { BaseCrudService } from '../../BaseCrudService';

@Injectable()
export class GrowConditionsService extends BaseCrudService<GrowConditions> {
    constructor(
        @InjectRepository(GrowConditions)
        private readonly growConditionsRepository: Repository<GrowConditions>,

        @InjectRepository(Herb)
        private readonly herbRepository: Repository<Herb>
    ) {
        super(growConditionsRepository, 'GrowConditions', { herb: true });
    }

    async create(dto: GrowConditionsRequestDto): Promise<GrowConditions> {
        const herb = await this.herbRepository.findOneBy({
            id: dto.herbId,
        });
        if (!herb) throw new NotFoundException('Herb not found');

        const growConditions = this.growConditionsRepository.create({
            ...dto,
            herb,
        });

        return this.growConditionsRepository.save(growConditions);
    }
}
