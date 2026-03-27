import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../infrastructure/database/base.entity';
import { Room } from '../../room/entity/room.entity';
import {
    PUMP_ACTIONS,
    PumpAction,
    PUMP_STATUSES,
    PumpStatus,
} from '../../utils/const';

@Entity({ name: 'pump_command' })
export class PumpCommand extends BaseEntity {
    @Column({ type: 'enum', enum: PUMP_ACTIONS })
    action!: PumpAction;

    @Column({ type: 'int', nullable: true })
    durationSeconds?: number;

    @Column({ type: 'enum', enum: PUMP_STATUSES, default: 'pending' })
    status!: PumpStatus;

    @Column({ type: 'timestamptz', nullable: true })
    acknowledgedAt?: Date;

    @ManyToOne(() => Room, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'room_id' })
    room!: Room;
}
