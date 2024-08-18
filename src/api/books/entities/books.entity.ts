import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'books' })
export class Books {
  constructor(partial: Partial<Books>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  @PrimaryColumn()
  code: string;

  @ApiProperty()
  @Column({ nullable: false })
  title: string;

  @ApiProperty()
  @Column({ nullable: false })
  author: string;

  @ApiProperty()
  @Column({ nullable: true, default: 0 })
  stock: number;
}
