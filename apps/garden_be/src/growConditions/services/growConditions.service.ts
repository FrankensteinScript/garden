import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GrowConditions } from '../entity/growConditions.entity';
import { Repository } from 'typeorm';
import { Herb } from '../../herb/entity/herb.entity';
import { GrowConditionsRequestDto } from '../dtos/growConditionsRequest.dto';

@Injectable()
export class GrowConditionsService {
    constructor(
        @InjectRepository(GrowConditions)
        private readonly growConditionsRepository: Repository<GrowConditions>,

        @InjectRepository(Herb)
        private readonly herbRepository: Repository<Herb>
    ) {}

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

    async findOne(id: string): Promise<GrowConditions> {
        const growConditions = await this.growConditionsRepository.findOne({
            where: { id },
            relations: ['herb'],
        });
        if (!growConditions)
            throw new NotFoundException('Grow Conditions not found');
        return growConditions;
    }

    async update(
        id: string,
        dto: GrowConditionsRequestDto
    ): Promise<GrowConditions> {
        const growConditions = await this.findOne(id);
        if (dto.herbId) {
            const herb = await this.herbRepository.findOneBy({
                id: dto.herbId,
            });

            if (!herb) throw new NotFoundException('Herb not found');
            growConditions.herb = herb;
        }
        Object.assign(growConditions, dto);
        return this.growConditionsRepository.save(growConditions);
    }

    async delete(id: string): Promise<void> {
        const growConditions = await this.findOne(id);
        await this.growConditionsRepository.delete(growConditions);
    }
}
