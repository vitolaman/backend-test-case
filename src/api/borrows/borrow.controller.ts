import { Controller, Post, Param, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { BorrowService } from './borrow.service';
import { Borrowing } from './entities/borrow.entity';
import { CreateBorrowDto } from './dto/create-borrow.dto';

@ApiTags('borrowings')
@Controller('borrowings')
export class BorrowController {
  constructor(private readonly borrowingService: BorrowService) {}

  @Post('borrow')
  @ApiCreatedResponse({
    description: 'Book borrowed successfully.',
    type: Borrowing,
  })
  @ApiBadRequestResponse({
    description:
      'Invalid request body | Cannot borrow more than 2 books | Book is not available',
  })
  @ApiForbiddenResponse({
    description: 'Member is currently penalized',
  })
  async borrowBook(
    @Body() @Body() borrowDto: CreateBorrowDto,
  ): Promise<Borrowing> {
    const { memberCode, bookCode } = borrowDto;
    return this.borrowingService.borrowBook(memberCode, bookCode);
  }

  @Post('return/:id')
  @ApiOkResponse({
    description: 'Book returned successfully.',
    type: Borrowing,
  })
  @ApiNotFoundResponse({
    description: 'Borrowing record not found.',
  })
  async returnBook(@Param('id') borrowingId: number): Promise<Borrowing> {
    return this.borrowingService.returnBook(borrowingId);
  }
}
