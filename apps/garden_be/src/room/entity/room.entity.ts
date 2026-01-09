import { Column, Entity, JoinColumn, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '../../infrastructure/database/base.entity';
import { Herb } from '../../herb/entity/herb.entity';
import { User } from '../../user/entity/user.entity';

@Entity({ name: 'room' })
export class Room extends BaseEntity {
    @Column({ type: 'varchar' })
    name!: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'float' })
    temperature!: number;

    @Column({ type: 'float' })
    humidity!: number;

    @Column({ type: 'float' })
    waterLevel!: number;

    @OneToMany(() => Herb, (herb) => herb.room, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'herb_ids' })
    herbs!: Herb[];

    @ManyToMany(() => User, (user) => user.rooms, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user' })
    users!: User[];
}
