import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBookBodyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'JK-45' })
  code: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Harry Potter' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'J.K Rowling' })
  author: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({ example: 0 })
  stock: number;
}
