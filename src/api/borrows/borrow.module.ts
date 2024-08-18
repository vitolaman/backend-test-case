import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BorrowController } from './borrow.controller';
import { BorrowService } from './borrow.service';
import { Member } from '../members/entities/member.entity';
import { Books } from '../books/entities/books.entity';
import { Borrowing } from './entities/borrow.entity';
import { Penalty } from './entities/penalties.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Member, Books, Borrowing, Penalty])],
  controllers: [BorrowController],
  providers: [BorrowService],
  exports: [BorrowService],
})
export class BorrowModule {}
