import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config({ path: '../.env' });

export default new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['src/**/*.entity.ts'],
    migrations: ['src/database/migrations/*.ts'],
    synchronize: false,
});