import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import DB_CONFIG from '../config/db.config';

@Injectable()
export class DatabaseOption implements TypeOrmOptionsFactory {
  constructor(
    @Inject(DB_CONFIG.KEY)
    private dbCfg: ConfigType<typeof DB_CONFIG>,
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const options: TypeOrmModuleOptions = {
      autoLoadEntities: true,
    };

    return Object.assign(options, this.dbCfg);
  }
}
