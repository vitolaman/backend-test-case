import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BookService } from './book.service';
import { RequestPaginatedQueryDto } from 'src/common/request-paginated.dto';
import { CreateBookBodyDto } from './dto/create-book.req.dto';
import { Books } from './entities/books.entity';

@Controller('books')
@ApiBearerAuth()
@ApiTags('Book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Books created successfully.',
    type: Books,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async create(@Body() createMemberDto: CreateBookBodyDto): Promise<Books> {
    return this.bookService.create(createMemberDto);
  }

  @Get()
  @ApiCreatedResponse({ description: 'user created' })
  @ApiConflictResponse({ description: 'Email already exist' })
  @ApiBadRequestResponse({ description: 'Request body not match' })
  findById(@Query() query: RequestPaginatedQueryDto) {
    return this.bookService.findAllMembers(query);
  }
}
