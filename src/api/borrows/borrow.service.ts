import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Books } from '../books/entities/books.entity';
import { Member } from '../members/entities/member.entity';
import { Borrowing } from './entities/borrow.entity';
import { Penalty } from './entities/penalties.entity';

@Injectable()
export class BorrowService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepo: Repository<Member>,

    @InjectRepository(Books)
    private readonly booksRepo: Repository<Books>,

    @InjectRepository(Borrowing)
    private readonly borrowingRepo: Repository<Borrowing>,

    @InjectRepository(Penalty)
    private readonly penaltyRepo: Repository<Penalty>,
  ) {}

  async borrowBook(memberCode: string, bookCode: string): Promise<Borrowing> {
    const member = await this.memberRepo.findOneBy({ code: memberCode });
    const book = await this.booksRepo.findOneBy({ code: bookCode });

    if (!member || !book) {
      throw new NotFoundException('Member or Book not found');
    }

    const activePenalty = await this.penaltyRepo.findOne({
      where: { member, penaltyEndDate: MoreThan(new Date()) },
    });

    if (activePenalty) {
      throw new ForbiddenException('Member is currently penalized');
    }

    const borrowedBooks = await this.borrowingRepo.find({
      where: { member, isReturned: false },
    });

    if (borrowedBooks.length >= 2) {
      throw new BadRequestException('Cannot borrow more than 2 books');
    }

    if (book.stock <= 0) {
      throw new BadRequestException('Book is not available');
    }

    book.stock -= 1;
    await this.booksRepo.save(book);

    const borrowing = this.borrowingRepo.create({
      member,
      book,
      borrowDate: new Date(),
      isReturned: false,
    });

    return await this.borrowingRepo.save(borrowing);
  }

  async returnBook(borrowingId: number): Promise<Borrowing> {
    const borrowing = await this.borrowingRepo.findOne({
      where: { id: borrowingId, isReturned: false },
      relations: ['member', 'book'],
    });

    if (!borrowing) {
      throw new NotFoundException('Borrowing record not found');
    }

    const today = new Date();
    const borrowDate = new Date(borrowing.borrowDate);
    const diffDays = Math.ceil(
      (today.getTime() - borrowDate.getTime()) / (1000 * 3600 * 24),
    );

    borrowing.returnDate = today;
    borrowing.isReturned = true;

    if (diffDays > 7) {
      const penaltyEndDate = new Date(today);
      penaltyEndDate.setDate(today.getDate() + 3);

      const penalty = this.penaltyRepo.create({
        member: borrowing.member,
        penaltyDate: today,
        penaltyEndDate,
        reason: 'Late return of book',
      });

      await this.penaltyRepo.save(penalty);
    }

    borrowing.book.stock += 1;
    await this.booksRepo.save(borrowing.book);

    return await this.borrowingRepo.save(borrowing);
  }
}
