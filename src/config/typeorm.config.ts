import 'reflect-metadata'
import { DataSource } from 'typeorm'
import User from '@/models/entities/User'
import path from 'path'
import dotenv from 'dotenv'
dotenv.config()

export default new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [User],
    migrationsTableName: 'migrations',
    migrations: [path.join(__dirname, '..', 'migration', '*.{ts,js}')],
    synchronize: false,
    logging: false,
})