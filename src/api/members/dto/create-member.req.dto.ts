import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMemberBodyDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'M004' })
  code?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'John Doe' })
  name?: string;
}
