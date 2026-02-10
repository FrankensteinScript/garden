import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

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
    ],
})
export class AppModule {}
