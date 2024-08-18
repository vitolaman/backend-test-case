import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import DB_CONFIG from './config/db.config';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { MemberModule } from './api/members/member.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [DB_CONFIG],
    }),
    DatabaseModule,
    MemberModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
