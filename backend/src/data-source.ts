import { DataSource } from 'typeorm';
import { DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { User } from './database/entity/user.entity';
import { Video } from './database/entity/video.entity';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  username: 'admin',
  password: 'admin',
  database: 'app',
  synchronize: false,
  logging: false,
  entities: [User, Video],

  // chemins POSIX, pas de back-slash
  seeds: ['src/database/seed/**/*{.ts,.js}'],
};

export const AppDataSource = new DataSource(options);
