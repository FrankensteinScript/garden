// src/history/history.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from '../entity/history.entity';
import { Herb } from '../../herb/entity/herb.entity';
import { HistoryRequestDto } from '../dtos/historyRequest.dto';

@Injectable()
export class HistoryService {
    constructor(
        @InjectRepository(History)
        private readonly historyRepository: Repository<History>,

        @InjectRepository(Herb)
        private readonly herbRepository: Repository<Herb>
    ) {}

    async create(dto: HistoryRequestDto): Promise<History> {
        const herb = await this.herbRepository.findOneBy({ id: dto.herbId });
        if (!herb) throw new NotFoundException('Herb not found');

        const history = this.historyRepository.create({ ...dto, herb });
        return this.historyRepository.save(history);
    }

    async findAll(): Promise<History[]> {
        return this.historyRepository.find({ relations: ['herb'] });
    }

    async findOne(id: string): Promise<History> {
        const history = await this.historyRepository.findOne({
            where: { id },
            relations: ['herb'],
        });
        if (!history) throw new NotFoundException('History not found');
        return history;
    }

    async update(id: string, dto: HistoryRequestDto): Promise<History> {
        const history = await this.findOne(id);
        if (dto.herbId) {
            const herb = await this.herbRepository.findOneBy({
                id: dto.herbId,
            });
            if (!herb) throw new NotFoundException('Herb not found');
            history.herb = herb;
        }
        Object.assign(history, dto);
        return this.historyRepository.save(history);
    }

    async remove(id: string): Promise<void> {
        const history = await this.findOne(id);
        await this.historyRepository.remove(history);
    }
}
