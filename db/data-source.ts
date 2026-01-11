import { DataSource, DataSourceOptions } from "typeorm";
import {config} from 'dotenv';
config();

export const dataSourceOptions: DataSourceOptions = {
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // Use dist entities for migration generation (after build)
    entities: ['dist/**/*.entity{.ts,.js}'],
    // Use source migrations path for generation
    migrations: ['db/migrations/*.ts'],
    migrationsTableName: 'migrations',
    logging: true, // Enable logging to see what's happening
    // Disable synchronize when using migrations
    synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;