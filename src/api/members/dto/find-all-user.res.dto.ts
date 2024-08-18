import { ResponsePaginatedDto } from 'src/common/response-paginated.dto-default';
import { Member } from '../entities/member.entity';

export class FindAllUserResDto extends ResponsePaginatedDto<Member> {}
