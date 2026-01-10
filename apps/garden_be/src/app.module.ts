import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrowConditionsModule } from './growConditions/growConditions.module';
import { HerbModule } from './herb/herb.module';
import { HistoryModule } from './history/history.module';
import { NotificationsModule } from './notification/notifications.module';
import { RoomModule } from './room/room.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST ?? 'localhost',
            port: Number(process.env.DB_PORT) ?? 5432,
            username: process.env.DB_USER ?? 'garden',
            password: process.env.DB_PASSWORD ?? 'secret',
            database: process.env.DB_NAME ?? 'garden',
            autoLoadEntities: true,
            synchronize: false,
        }),
        GrowConditionsModule,
        HerbModule,
        HistoryModule,
        NotificationsModule,
        RoomModule,
        UserModule,
    ],
})
export class AppModule {}
