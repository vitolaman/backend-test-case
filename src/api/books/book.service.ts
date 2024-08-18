import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { FindAllBookResDto } from './dto/find-all-book.res.dto';
import { Books } from './entities/books.entity';
import { RequestPaginatedQueryWithSearchDto } from 'src/common/request-paginated.dto';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Books)
    private bookRepo: Repository<Books>,
  ) {}

  async create(createBookDto: Partial<Books>): Promise<Books> {
    const newMember = this.bookRepo.create(createBookDto);
    return await this.bookRepo.save(newMember);
  }

  async findAllUsers({
    limit,
    page,
    search,
  }: RequestPaginatedQueryWithSearchDto): Promise<FindAllBookResDto> {
    const where: FindOptionsWhere<Books>[] = [];

    if (search) {
      where.push({ title: ILike(`%${search}%`) });
      where.push({ code: ILike(`%${search}%`) });
    }

    const [users, total] = await this.bookRepo.findAndCount({
      where: where.length > 0 ? where : undefined,
      order: {
        code: 'ASC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return new FindAllBookResDto({
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
