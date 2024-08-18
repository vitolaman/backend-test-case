import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'members' })
export class Member {
  constructor(partial: Partial<Member>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  @PrimaryColumn()
  code: string;

  @ApiProperty()
  @Column({ nullable: false })
  name: string;
}
