import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MemberService } from './book.service';
import { RequestPaginatedQueryDto } from 'src/common/request-paginated.dto';
import { CreateBookBodyDto } from './dto/create-book.req.dto';
import { Books } from './entities/books.entity';

@Controller('books')
@ApiBearerAuth()
@ApiTags('Book')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Books created successfully.',
    type: Books,
  })
  async create(@Body() createMemberDto: CreateBookBodyDto): Promise<Books> {
    return this.memberService.create(createMemberDto);
  }

  @Get()
  @ApiCreatedResponse({ description: 'user created' })
  @ApiConflictResponse({ description: 'Email already exist' })
  @ApiBadRequestResponse({ description: 'Request body not match' })
  findById(@Query() query: RequestPaginatedQueryDto) {
    return this.memberService.findAllUsers(query);
  }
}
