import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MemberService } from './member.service';
import { RequestPaginatedQueryWithSearchDto } from 'src/common/request-paginated.dto';
import { Member } from './entities/member.entity';
import { CreateMemberBodyDto } from './dto/create-member.req.dto';

@Controller('members')
@ApiBearerAuth()
@ApiTags('Member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiResponse({
    status: 201,
    description: 'Member created successfully.',
    type: Member,
  })
  @ApiConflictResponse({ description: 'Member already exists' })
  @ApiOperation({ summary: 'Add new member' })
  async create(@Body() createMemberDto: CreateMemberBodyDto): Promise<Member> {
    return this.memberService.create(createMemberDto);
  }

  @Get()
  @ApiCreatedResponse({ description: 'user created' })
  @ApiConflictResponse({ description: 'Email already exist' })
  @ApiBadRequestResponse({ description: 'Request body not match' })
  @ApiOperation({ summary: 'Find all member' })
  findById(@Query() query: RequestPaginatedQueryWithSearchDto) {
    return this.memberService.findAllMembers(query);
  }
}
