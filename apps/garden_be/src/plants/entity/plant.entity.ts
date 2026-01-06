import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { EntityBase } from '../../infrastructure/database/base.entity';

@Entity()
export class Plant extends EntityBase {
    @PrimaryKey()
    id!: number;

    @Property()
    name!: string;
}
