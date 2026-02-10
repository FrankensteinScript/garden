import { NotFoundException } from '@nestjs/common';
import { Repository, FindOptionsWhere, FindOptionsRelations } from 'typeorm';

export abstract class BaseCrudService<T extends object> {
    protected constructor(
        protected readonly repository: Repository<T>,
        private readonly entityName: string,
        protected readonly relations?: FindOptionsRelations<T>
    ) {}

    async findAll(): Promise<T[]> {
        return this.repository.find({ relations: this.relations });
    }

    async findOne(where: FindOptionsWhere<T>): Promise<T> {
        const entity = await this.repository.findOne({
            where,
            relations: this.relations,
        });
        if (!entity)
            throw new NotFoundException(`${this.entityName} not found`);
        return entity;
    }

    async update(where: FindOptionsWhere<T>, dto: Partial<T>): Promise<T> {
        const entity = await this.findOne(where);
        Object.assign(entity, dto);
        return this.repository.save(entity);
    }

    async delete(where: FindOptionsWhere<T>): Promise<void> {
        const result = await this.repository.delete(where);
        if (!result.affected)
            throw new NotFoundException(`${this.entityName} not found`);
    }
}
