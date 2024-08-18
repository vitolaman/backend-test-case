import { ResponseDto } from 'src/common/response.dto-default';
import { Member } from '../entities/member.entity';

export class MemberDataDto extends Member {
  book_borrowed: number;
}

export class FindOneMemberesDto extends ResponseDto<MemberDataDto> {
  constructor(partial: Partial<ResponseDto<MemberDataDto>>) {
    partial.data = new MemberDataDto(partial.data);

    super(partial);
  }

  data: MemberDataDto;
}
