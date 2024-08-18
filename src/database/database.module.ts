import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseOption } from './database.option';

@Module({
  imports: [TypeOrmModule.forRootAsync({ useClass: DatabaseOption })],
})
export class DatabaseModule {}
