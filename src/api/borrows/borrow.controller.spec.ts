import { Test, TestingModule } from '@nestjs/testing';
import { BorrowController } from './borrow.controller';
import { BorrowService } from './borrow.service';
import { Borrowing } from './entities/borrow.entity';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

describe('BorrowController', () => {
  let borrowController: BorrowController;
  let borrowService: BorrowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BorrowController],
      providers: [
        {
          provide: BorrowService,
          useValue: {
            borrowBook: jest.fn(),
            returnBook: jest.fn(),
          },
        },
      ],
    }).compile();

    borrowController = module.get<BorrowController>(BorrowController);
    borrowService = module.get<BorrowService>(BorrowService);
  });

  describe('borrowBook', () => {
    it('should borrow a book and return the borrowing entity', async () => {
      const borrowDto: CreateBorrowDto = {
        memberCode: 'M001',
        bookCode: 'B001',
      };
      const borrowing: Borrowing = {
        id: 1,
        member: { code: borrowDto.memberCode, name: 'John Doe' },
        book: {
          code: borrowDto.bookCode,
          title: 'Some Book',
          author: 'Some Author',
          stock: 10,
        },
        borrowDate: new Date(),
        returnDate: null,
        isReturned: false,
      } as Borrowing;

      jest.spyOn(borrowService, 'borrowBook').mockResolvedValue(borrowing);

      expect(await borrowController.borrowBook(borrowDto)).toEqual(borrowing);
    });

    it('should throw a BadRequestException if the request is invalid', async () => {
      const borrowDto: CreateBorrowDto = {
        memberCode: 'M001',
        bookCode: 'B001',
      };

      jest
        .spyOn(borrowService, 'borrowBook')
        .mockRejectedValue(
          new BadRequestException('Cannot borrow more than 2 books'),
        );

      await expect(borrowController.borrowBook(borrowDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw a ForbiddenException if the member is penalized', async () => {
      const borrowDto: CreateBorrowDto = {
        memberCode: 'M001',
        bookCode: 'B001',
      };

      jest
        .spyOn(borrowService, 'borrowBook')
        .mockRejectedValue(
          new ForbiddenException('Member is currently penalized'),
        );

      await expect(borrowController.borrowBook(borrowDto)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('returnBook', () => {
    it('should return a book and update the borrowing entity', async () => {
      const borrowingId = 1;
      const borrowing: Borrowing = {
        id: borrowingId,
        member: { code: 'M001', name: 'John Doe' },
        book: {
          code: 'B001',
          title: 'Book Title',
          author: 'Author',
          stock: 10,
        },
        borrowDate: new Date(),
        isReturned: true,
      } as Borrowing;

      jest.spyOn(borrowService, 'returnBook').mockResolvedValue(borrowing);

      expect(await borrowController.returnBook(borrowingId)).toEqual(borrowing);
    });

    it('should throw a NotFoundException if the borrowing record is not found', async () => {
      const borrowingId = 1;

      jest
        .spyOn(borrowService, 'returnBook')
        .mockRejectedValue(new NotFoundException('Borrowing record not found'));

      await expect(borrowController.returnBook(borrowingId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
