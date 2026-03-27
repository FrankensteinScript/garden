import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../infrastructure/database/base.entity';
import { Room } from '../../room/entity/room.entity';

@Entity({ name: 'sensor_reading' })
export class SensorReading extends BaseEntity {
    @Column({ type: 'float' })
    temperature!: number;

    @Column({ type: 'float' })
    humidity!: number;

    @Column({ type: 'float' })
    soilMoisture!: number;

    @Column({ type: 'float' })
    waterLevel!: number;

    @ManyToOne(() => Room, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'room_id' })
    room!: Room;
}
