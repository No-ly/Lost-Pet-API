import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { envs } from '../config/envs';
import { LostPet } from '../lost-pets/entities/lost-pet.entity';
import { User } from '../users/entities/user.entity';
import { PendingEmail } from '../email/entities/pending-email.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: envs.DB_HOST,
  port: envs.DB_PORT,
  username: envs.DB_USER,
  password: envs.DB_PASSWORD,
  database: envs.DB_NAME,
  entities: [LostPet, User, PendingEmail],
  // join(__dirname) funciona igual en src (ts) y en dist (js), y en Windows
  migrations: [join(__dirname, 'migrations', '[0-9]*-*{.ts,.js}')],
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
