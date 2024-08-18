import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Books } from './entities/books.entity';
import { MemberController } from './book.controller';
import { MemberService } from './book.service';

@Module({
  imports: [TypeOrmModule.forFeature([Books])],
  controllers: [MemberController],
  providers: [MemberService],
  exports: [MemberService],
})
export class BookModule {}
