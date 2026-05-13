import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DbEnvs } from 'src/config';

config();

export const options: DataSourceOptions = {
  type: 'postgres' as const,
  host: DbEnvs.dbHost,
  port: DbEnvs.dbPort,
  database: DbEnvs.dbDatabase,
  username: DbEnvs.dbUsername,
  password: DbEnvs.dbPassword,
  synchronize: false,
  schema: DbEnvs.dbSchema,
  migrationsTableName: 'collections_service_migrations',
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  namingStrategy: new SnakeNamingStrategy(),
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
};

export default new DataSource(options);
