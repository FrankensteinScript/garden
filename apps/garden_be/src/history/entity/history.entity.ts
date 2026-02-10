import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../infrastructure/database/base.entity';
import { Herb } from '../../herb/entity/herb.entity';

@Entity({ name: 'history' })
export class History extends BaseEntity {
    @Column({ type: 'timestamptz' })
    wateredAt!: Date;

    @Column({ type: 'float' })
    amountWater!: number;

    @Column({ type: 'float' })
    temperature!: number;

    @Column({ type: 'text', nullable: true })
    notes?: string;

    @ManyToOne(() => Herb, (herb) => herb.histories, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'herb_id' })
    herb!: Herb;
}
