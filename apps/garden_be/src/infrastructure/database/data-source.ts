import 'dotenv/config';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: 5432,
    username: process.env.DB_USER ?? 'garden',
    password: process.env.DB_PASSWORD ?? 'secret',
    database: process.env.DB_NAME ?? 'garden',
    synchronize: false,
    logging: true,
    entities: ['src/**/*.entity.ts'],
    migrations: ['src/infrastructure/database/migrations/*.ts'],
});
