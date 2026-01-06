import { OptionalProps, Property } from '@mikro-orm/core';

export abstract class EntityBase {
    [OptionalProps]?: 'createdAt' | 'updatedAt';

    @Property({ type: 'timestamptz' })
    createdAt: Date = new Date();

    @Property({ type: 'timestamptz', onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
