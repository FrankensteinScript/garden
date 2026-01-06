import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../infrastructure/database/base.entity';

@Entity()
export class Plant extends BaseEntity {
    @Column({ type: 'varchar', length: 100 })
    name!: string;
}
