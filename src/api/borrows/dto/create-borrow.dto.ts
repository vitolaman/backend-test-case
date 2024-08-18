import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBorrowDto {
  @ApiProperty({
    example: 'M001',
    description: 'The code of the member borrowing the book.',
  })
  @IsNotEmpty()
  @IsString()
  memberCode: string;

  @ApiProperty({
    example: 'B001',
    description: 'The code of the book being borrowed.',
  })
  @IsNotEmpty()
  @IsString()
  bookCode: string;
}
