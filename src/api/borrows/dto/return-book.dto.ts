import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ReturnBookDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the borrowing record being returned.',
  })
  @IsNotEmpty()
  @IsNumber()
  borrowingId: number;
}
