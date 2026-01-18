import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../infrastructure/database/base.entity';
import { SOIL_TYPES, SoilType } from '../../utils/const';
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
        enum: Object.values(SOIL_TYPES),
        default: SOIL_TYPES[0],
    })
    soilType!: SoilType;

    @OneToOne(() => Herb, (herb) => herb.growConditions, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'herb_id' })
    herb!: Herb;
}
