import { ResponsePaginatedDto } from '../../../common/response-paginated.dto-default';
import { Member } from '../entities/member.entity';

export class MemberDataDto extends Member {
  book_borrowed: number;
}
export class FindAllUserResDto extends ResponsePaginatedDto<MemberDataDto> {}
