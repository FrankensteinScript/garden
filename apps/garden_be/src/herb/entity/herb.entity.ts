import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../infrastructure/database/base.entity';
import { History } from '../../history/entity/history.entity';

@Entity({ name: 'herb' })
export class Herb extends BaseEntity {
    @Column({ type: 'varchar', length: 256 })
    name: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'float' })
    temperature: number;

    @Column({ type: 'float' })
    humidity: number;

    @Column({ type: 'float' })
    soilMoisture: number;

    @Column({ type: 'timestamptz' })
    lastWatering: Date;

    @OneToMany(() => History, (history) => history.herb)
    histories: History[];
}
