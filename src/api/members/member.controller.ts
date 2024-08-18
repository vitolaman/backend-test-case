import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MemberService } from './member.service';
import { RequestPaginatedQueryDto } from 'src/common/request-paginated.dto';
import { Member } from './entities/member.entity';
import { CreateMemberBodyDto } from './dto/create-member.req.dto';

@Controller('users')
@ApiBearerAuth()
@ApiTags('User')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Member created successfully.',
    type: Member,
  })
  async create(@Body() createMemberDto: CreateMemberBodyDto): Promise<Member> {
    return this.memberService.create(createMemberDto);
  }

  @Get()
  @ApiCreatedResponse({ description: 'user created' })
  @ApiConflictResponse({ description: 'Email already exist' })
  @ApiBadRequestResponse({ description: 'Request body not match' })
  findById(@Query() query: RequestPaginatedQueryDto) {
    return this.memberService.findAllUsers(query);
  }
}
