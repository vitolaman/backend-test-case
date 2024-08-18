import { ApiProperty } from '@nestjs/swagger';
import { Books } from '../../books/entities/books.entity';
import { Member } from '../../members/entities/member.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'borrowings' })
export class Borrowing {
  constructor(partial: Partial<Borrowing>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @ManyToOne(() => Member, { eager: true })
  member: Member;

  @ApiProperty()
  @ManyToOne(() => Books, { eager: true })
  book: Books;

  @ApiProperty()
  @Column({ type: 'date' })
  borrowDate: Date;

  @ApiProperty()
  @Column({ type: 'date', nullable: true })
  returnDate?: Date;

  @ApiProperty()
  @Column({ type: 'boolean', default: false })
  isReturned: boolean;
}
