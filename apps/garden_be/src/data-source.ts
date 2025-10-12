import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Plant } from './entity/Plant';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'garden',
    password: process.env.DB_PASSWORD || 'secret',
    database: process.env.DB_NAME || 'garden',
    synchronize: true,
    entities: [Plant],
});
