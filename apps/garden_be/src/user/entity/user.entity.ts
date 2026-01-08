import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../infrastructure/database/base.entity';
import { Room } from '../../room/entity/room.entity';
import { Notification } from '../../notification/entity/notification.entity';

@Entity({ name: 'user' })
export class User extends BaseEntity {
    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'varchar' })
    email: string;

    @Column({ type: 'varchar' })
    password: string;

    @ManyToMany(() => Room, (room) => room.user)
    rooms: Room[];

    @ManyToMany(() => Notification, (notification) => notification.users)
    notifications: Notification[];
}
