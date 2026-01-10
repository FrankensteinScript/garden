import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantsModule } from './plants/plants.module';
import { GrowConditionsModule } from './growConditions/growConditions.module';
import { HerbModule } from './herb/herb.module';
import { HistoryModule } from './history/history.module';
import { NotificationsModule } from './notification/notifications.module';

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
        PlantsModule,
        GrowConditionsModule,
        HerbModule,
        HistoryModule,
        NotificationsModule,
    ],
})
export class AppModule {}
