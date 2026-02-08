import { Column, Entity, JoinColumn, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../infrastructure/database/base.entity';
import { NOTIFICATION_TYPES, NotificationType } from '../../utils/const';
import { Herb } from '../../herb/entity/herb.entity';
import { User } from '../../user/entity/user.entity';

@Entity({ name: 'notifications' })
export class Notification extends BaseEntity {
    @Column({ type: 'enum', enum: NOTIFICATION_TYPES })
    notificationType!: NotificationType;

    @Column({ type: 'text' })
    message!: string;

    @Column({ type: 'boolean' })
    isRead!: boolean;

    @ManyToMany(() => Herb, (herb) => herb.notifications, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'herb_id' })
    herbs!: Herb[];

    @ManyToMany(() => User, (user) => user.notifications, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    users!: User[];
}
