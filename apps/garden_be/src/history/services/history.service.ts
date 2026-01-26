import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from '../entity/history.entity';
import { Herb } from '../../herb/entity/herb.entity';
import { HistoryRequestDto } from '../dtos/historyRequest.dto';
import { BaseCrudService } from '../../BaseCrudService';

@Injectable()
export class HistoryService extends BaseCrudService<History> {
    constructor(
        @InjectRepository(History)
        private readonly historyRepository: Repository<History>,

        @InjectRepository(Herb)
        private readonly herbRepository: Repository<Herb>
    ) {
        super(historyRepository, 'History', { herb: true });
    }

    async create(dto: HistoryRequestDto): Promise<History> {
        const herb = await this.herbRepository.findOneBy({ id: dto.herbId });
        if (!herb) throw new NotFoundException('Herb not found');

        const history = this.historyRepository.create({ ...dto, herb });
        return this.historyRepository.save(history);
    }
}
