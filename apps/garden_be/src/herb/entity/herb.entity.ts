import {
    Column,
    Entity,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
} from 'typeorm';
import { BaseEntity } from '../../infrastructure/database/base.entity';
import { History } from '../../history/entity/history.entity';
import { Room } from '../../room/entity/room.entity';
import { Notification } from '../../notification/entity/notification.entity';
import { GrowConditions } from '../../growConditions/entity/growConditions.entity';
import { PLANT_TYPES, PlantType } from '../../utils/const';

@Entity({ name: 'herb' })
export class Herb extends BaseEntity {
    @Column({ type: 'varchar', length: 256 })
    name!: string;

    @Column({ type: 'text' })
    description!: string;

    @Column({ type: 'float' })
    temperature!: number;

    @Column({ type: 'float' })
    humidity!: number;

    @Column({ type: 'float' })
    soilMoisture!: number;

    @Column({ type: 'timestamptz' })
    lastWatering!: Date;

    @Column({ type: 'varchar', nullable: true })
    imageUrl!: string | null;

    @Column({
        type: 'enum',
        enum: PLANT_TYPES,
        default: 'herb',
    })
    plantType!: PlantType;

    @OneToMany(() => History, (history) => history.herb)
    histories!: History[];

    @OneToOne(() => GrowConditions, (condition) => condition.herb)
    growConditions!: GrowConditions;

    @ManyToOne(() => Room, (room) => room.herbs)
    room!: Room;

    @ManyToMany(() => Notification, (notification) => notification.herbs)
    notifications!: Notification[];
}
