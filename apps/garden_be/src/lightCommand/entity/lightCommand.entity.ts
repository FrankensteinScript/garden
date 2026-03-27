import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../infrastructure/database/base.entity';
import { Room } from '../../room/entity/room.entity';
import {
    LIGHT_ACTIONS,
    LightAction,
    LIGHT_STATUSES,
    LightStatus,
    LIGHT_MODES,
    LightMode,
} from '../../utils/const';

@Entity({ name: 'light_command' })
export class LightCommand extends BaseEntity {
    @Column({ type: 'enum', enum: LIGHT_ACTIONS })
    action!: LightAction;

    @Column({ type: 'enum', enum: LIGHT_MODES, default: 'growth' })
    mode!: LightMode;

    @Column({ type: 'enum', enum: LIGHT_STATUSES, default: 'pending' })
    status!: LightStatus;

    @Column({ type: 'timestamptz', nullable: true })
    acknowledgedAt?: Date;

    @ManyToOne(() => Room, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'room_id' })
    room!: Room;
}
