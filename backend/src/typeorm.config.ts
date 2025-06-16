import { DataSource } from 'typeorm';
import { join, resolve } from 'path';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

const options: SqliteConnectionOptions = {
  type: 'sqlite',
  database: resolve(__dirname, '..', 'db.sqlite'),
  synchronize: false,
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
};

export const AppDataSource = new DataSource(options);
