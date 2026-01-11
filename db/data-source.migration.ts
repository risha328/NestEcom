import { DataSource } from "typeorm";
import {config} from 'dotenv';
import { UserEntity } from '../src/users/entities/user.entity';
import { CategoryEntity } from '../src/categories/entities/category.entity';

config();

// Data source specifically for migration generation
// This uses source entities directly (not compiled)
export default new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // Import entities directly from source for migration generation
    entities: [UserEntity, CategoryEntity],
    // Migrations path
    migrations: ['db/migrations/*.ts'],
    migrationsTableName: 'migrations',
    logging: true,
    synchronize: false,
});

