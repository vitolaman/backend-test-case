import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import { DataSource } from 'typeorm';
import { DatabaseLogger } from './database.logger';

dotenvExpand.expand(dotenv.config());

const isProduction = process.env.NODE_ENV == 'production';

export const defaultDataSource = new DataSource({
  type: 'postgres',
  host: 'aws-0-ap-southeast-1.pooler.supabase.com',
  port: 6543,
  username: 'postgres.tsaduejgdtsofoalegyv',
  password: 'Joyoboyo19#@',
  database: 'postgres',
  entities: [`${__dirname}/../**/*.entity.{js,ts}`],
  migrations: [`${__dirname}/migrations/*.{js,ts}`],
  synchronize: false,
  migrationsRun: true,
  migrationsTransactionMode: 'each',
  logging: true,
  logger: isProduction
    ? new DatabaseLogger(new Logger('Database'), true)
    : 'advanced-console',
});
