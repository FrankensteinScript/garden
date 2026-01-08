import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../infrastructure/database/base.entity';
import { SoilType, type SoilTypeEnum } from '../../utils/const';

@Entity({ name: 'growthConditions' })
export class GrowthConditions extends BaseEntity {
    @Column({ type: 'float' })
    minTemperature: number;

    @Column({ type: 'float' })
    maxTemperature: number;

    @Column({ type: 'float' })
    minHumidity: number;

    @Column({ type: 'float' })
    maxHumidity: number;

    @Column({
        type: 'enum',
        enum: Object.values(SoilType),
        default: SoilType.LOAMY,
    })
    soilType: SoilTypeEnum;
}
