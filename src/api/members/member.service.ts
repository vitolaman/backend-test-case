import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { FindAllUserResDto } from './dto/find-all-user.res.dto';
import { Member } from './entities/member.entity';
import { RequestPaginatedQueryWithSearchDto } from 'src/common/request-paginated.dto';

@Injectable()
export class MemberService {
  private readonly logger = new Logger(MemberService.name);

  constructor(
    @InjectRepository(Member)
    private memberRepo: Repository<Member>,
  ) {}

  async create(createMemberDto: Partial<Member>): Promise<Member> {
    const newMember = this.memberRepo.create(createMemberDto);
    return await this.memberRepo.save(newMember);
  }

  async findAllUsers({
    limit,
    page,
    search,
  }: RequestPaginatedQueryWithSearchDto): Promise<FindAllUserResDto> {
    const where: FindOptionsWhere<Member>[] = [];

    if (search) {
      where.push({ name: ILike(`%${search}%`) });
      where.push({ code: ILike(`%${search}%`) });
    }

    const [users, total] = await this.memberRepo.findAndCount({
      where: where.length > 0 ? where : undefined,
      order: {
        name: 'ASC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return new FindAllUserResDto({
      data: users,
      meta: {
        page,
        per_page: limit,
        total,
        total_page: totalPages,
      },
    });
  }
}
