import { DataSource } from 'typeorm';

export const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'restaurante',
  password: 'restaurante',
  database: 'restaurante2025',
  synchronize: false,
  entities: ['src/**/*.entity{.ts, .js}'],
  
});