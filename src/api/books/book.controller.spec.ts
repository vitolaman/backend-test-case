import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { CreateBookBodyDto } from './dto/create-book.req.dto';
import { Books } from './entities/books.entity';

describe('BookController', () => {
  let bookController: BookController;
  let bookService: BookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        {
          provide: BookService,
          useValue: {
            create: jest.fn(),
            findAllMembers: jest.fn(),
          },
        },
      ],
    }).compile();

    bookController = module.get<BookController>(BookController);
    bookService = module.get<BookService>(BookService);
  });

  describe('create', () => {
    it('should create a book and return it', async () => {
      const createBookDto: CreateBookBodyDto = {
        code: 'B001',
        title: 'Book Title',
        author: 'Author Name',
        stock: 10,
      };
      const book: Books = { ...createBookDto } as Books;

      jest.spyOn(bookService, 'create').mockResolvedValue(book);

      expect(await bookController.create(createBookDto)).toEqual(book);
    });

    it('should handle errors appropriately', async () => {
      const createBookDto: CreateBookBodyDto = {
        code: 'B001',
        title: 'Book Title',
        author: 'Author Name',
        stock: 10,
      };

      jest
        .spyOn(bookService, 'create')
        .mockRejectedValue(new Error('Conflict'));

      await expect(bookController.create(createBookDto)).rejects.toThrowError(
        'Conflict',
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of books', async () => {
      const query = { limit: 10, page: 1 };
      const books: Books[] = [
        {
          code: 'B001',
          title: 'Book Title',
          author: 'Author Name',
          stock: 10,
        } as Books,
      ];

      const booksResponse = {
        data: books,
        meta: {
          page: 1,
          per_page: 10,
          total: 5,
          total_page: 1,
        },
      };

      jest
        .spyOn(bookService, 'findAllMembers')
        .mockResolvedValue(booksResponse);

      expect(await bookController.findAll(query)).toEqual(booksResponse);
    });

    it('should handle errors appropriately', async () => {
      const query = { limit: 10, page: 1 };

      jest
        .spyOn(bookService, 'findAllMembers')
        .mockRejectedValue(new Error('Bad Request'));

      await expect(bookController.findAll(query)).rejects.toThrowError(
        'Bad Request',
      );
    });
  });
});
