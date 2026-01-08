import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../infrastructure/database/base.entity';
import { History } from '../../history/entity/history.entity';
import { GrowthConditions } from '../../growConditions/entity/growthConditions.entity';
import { Room } from '../../room/entity/room.entity';
import { Notification } from '../../notification/entity/notification.entity';

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

    @OneToMany(() => History, (history) => history.herb)
    histories!: History[];

    @OneToMany(() => GrowthConditions, (condition) => condition.herb)
    growthConditions!: GrowthConditions[];

    @ManyToOne(() => Room, (room) => room.herbs)
    room!: Room;

    @ManyToMany(() => Notification, (notification) => notification.herbs)
    notifications!: Notification[];
}
