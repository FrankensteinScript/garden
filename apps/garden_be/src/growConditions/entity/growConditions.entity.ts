import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../infrastructure/database/base.entity';
import { SoilType, SoilTypeEnum } from '../../utils/const';
import { Herb } from '../../herb/entity/herb.entity';

@Entity({ name: 'growConditions' })
export class GrowConditions extends BaseEntity {
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

    @OneToOne(() => Herb, (herb) => herb.growConditions, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'herb_id' })
    herb!: Herb;
}
