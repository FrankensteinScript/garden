import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomModule } from './room/room.module';
import { HerbModule } from './herb/herb.module';
import { UserModule } from './user/user.module';
import { NotificationsModule } from './notification/notification.module';
import { HistoryModule } from './history/history.module';
import { GrowConditionsModule } from './growConditions/growConditions.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                host: config.get('DB_HOST', 'localhost'),
                port: config.get<number>('DB_PORT', 5432),
                username: config.get('DB_USER', 'garden'),
                password: config.get('DB_PASSWORD', 'secret'),
                database: config.get('DB_NAME', 'garden'),
                autoLoadEntities: true,
                synchronize: false,
            }),
        }),
        RoomModule,
        HerbModule,
        UserModule,
        NotificationsModule,
        HistoryModule,
        GrowConditionsModule,
        AuthModule,
        EmailModule,
    ],
})
export class AppModule {}
