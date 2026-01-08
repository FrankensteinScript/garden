import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../infrastructure/database/base.entity';
import { SoilType, type SoilTypeEnum } from '../../utils/const';
import { Herb } from '../../herb/entity/herb.entity';

@Entity({ name: 'growthConditions' })
export class GrowthConditions extends BaseEntity {
    @Column({ type: 'float' })
    minTemperature!: number;

    @Column({ type: 'float' })
    maxTemperature!: number;

    @Column({ type: 'float' })
    minHumidity!: number;

    @Column({ type: 'float' })
    maxHumidity!: number;

    @Column({
        type: 'enum',
        enum: Object.values(SoilType),
        default: SoilType.LOAMY,
    })
    soilType!: SoilTypeEnum;

    @ManyToOne(() => Herb, (herb) => herb.growthConditions, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'herb_id' })
    herb!: Herb;
}
