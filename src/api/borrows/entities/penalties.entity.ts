import { ApiProperty } from '@nestjs/swagger';
import { Member } from 'src/api/members/entities/member.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'penalties' })
export class Penalty {
  constructor(partial: Partial<Penalty>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @ManyToOne(() => Member, { eager: true })
  member: Member;

  @ApiProperty()
  @Column({ type: 'date' })
  penaltyDate: Date;

  @ApiProperty()
  @Column({ type: 'date' })
  penaltyEndDate: Date;

  @ApiProperty()
  @Column({ type: 'text' })
  reason: string;
}
