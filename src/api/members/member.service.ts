import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { FindAllUserResDto } from './dto/find-all-user.res.dto';
import { Member } from './entities/member.entity';
import { RequestPaginatedQueryWithSearchDto } from 'src/common/request-paginated.dto';
import { CreateMemberBodyDto } from './dto/create-member.req.dto';
import { Borrowing } from '../borrows/entities/borrow.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private memberRepo: Repository<Member>,

    @InjectRepository(Borrowing)
    private readonly borrowingRepo: Repository<Borrowing>,
  ) {}

  async create(createMemberDto: CreateMemberBodyDto): Promise<Member> {
    const newMember = this.memberRepo.create(createMemberDto);
    return await this.memberRepo.save(newMember);
  }

  async findAllMembers({
    limit,
    page,
    search,
  }: RequestPaginatedQueryWithSearchDto): Promise<FindAllUserResDto> {
    const where: FindOptionsWhere<Member>[] = [];

    if (search) {
      where.push({ name: ILike(`%${search}%`) });
      where.push({ code: ILike(`%${search}%`) });
    }

    const [members, total] = await this.memberRepo.findAndCount({
      where: where.length > 0 ? where : undefined,
      order: {
        name: 'ASC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const membersWithBorrowCounts = await Promise.all(
      members.map(async (member) => {
        const borrowCount = await this.borrowingRepo.count({
          where: { member, isReturned: false },
        });
        return {
          ...member,
          book_borrowed: borrowCount,
        };
      }),
    );

    const totalPages = Math.ceil(total / limit);

    return new FindAllUserResDto({
      data: membersWithBorrowCounts,
      meta: {
        page,
        per_page: limit,
        total,
        total_page: totalPages,
      },
    });
  }
}
