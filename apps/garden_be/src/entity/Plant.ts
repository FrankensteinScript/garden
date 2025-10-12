import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Plant {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ default: true })
    isAlive!: boolean;
}
