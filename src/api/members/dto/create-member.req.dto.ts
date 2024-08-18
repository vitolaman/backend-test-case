import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMemberBodyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'M004' })
  code?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'John Doe' })
  name?: string;
}
