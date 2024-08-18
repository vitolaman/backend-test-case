import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { MemberService } from './member.service';
import { Member } from './entities/member.entity';
import { Borrowing } from '../borrows/entities/borrow.entity';
import { CreateMemberBodyDto } from './dto/create-member.req.dto';
import { FindAllUserResDto } from './dto/find-all-user.res.dto';

describe('MemberService', () => {
  let service: MemberService;
  let memberRepo: Repository<Member>;
  let borrowingRepo: Repository<Borrowing>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        {
          provide: getRepositoryToken(Member),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            findAndCount: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Borrowing),
          useValue: {
            count: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MemberService>(MemberService);
    memberRepo = module.get<Repository<Member>>(getRepositoryToken(Member));
    borrowingRepo = module.get<Repository<Borrowing>>(
      getRepositoryToken(Borrowing),
    );
  });

  describe('create', () => {
    it('should create a new member', async () => {
      const createMemberDto: CreateMemberBodyDto = {
        code: 'MEMBER099',
        name: 'John',
      };

      jest.spyOn(memberRepo, 'find').mockResolvedValue([]);
      jest
        .spyOn(memberRepo, 'create')
        .mockReturnValue(createMemberDto as Member);
      jest
        .spyOn(memberRepo, 'save')
        .mockResolvedValue(createMemberDto as Member);

      const result = await service.create(createMemberDto);

      expect(memberRepo.find).toHaveBeenCalledWith({
        where: { code: createMemberDto.code },
      });
      expect(memberRepo.create).toHaveBeenCalledWith(createMemberDto);
      expect(memberRepo.save).toHaveBeenCalledWith(createMemberDto);
      expect(result).toEqual(createMemberDto);
    });

    it('should throw a ConflictException if the code already exists', async () => {
      const createMemberDto: CreateMemberBodyDto = {
        code: 'M001',
        name: 'John Doe',
      };
      jest
        .spyOn(memberRepo, 'find')
        .mockResolvedValue([createMemberDto as Member]);

      await expect(service.create(createMemberDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAllMembers', () => {
    it('should return paginated members with borrow count', async () => {
      const members: Member[] = [
        { code: 'M001', name: 'John Doe' } as Member,
        { code: 'M002', name: 'Jane Doe' } as Member,
      ];

      const findAndCountMock = jest
        .spyOn(memberRepo, 'findAndCount')
        .mockResolvedValue([members, 2]);
      const countMock = jest.spyOn(borrowingRepo, 'count').mockResolvedValue(1);

      const result = await service.findAllMembers({
        limit: 10,
        page: 1,
        search: '',
      });

      expect(findAndCountMock).toHaveBeenCalledWith({
        where: undefined,
        order: { name: 'ASC' },
        skip: 0,
        take: 10,
      });
      expect(countMock).toHaveBeenCalledTimes(members.length);

      const expectedResponse = new FindAllUserResDto({
        data: [
          { ...members[0], book_borrowed: 1 },
          { ...members[1], book_borrowed: 1 },
        ],
        meta: {
          page: 1,
          per_page: 10,
          total: 2,
          total_page: 1,
        },
      });

      expect(result).toEqual(expectedResponse);
    });

    it('should handle the search query', async () => {
      const search = 'John';
      const members: Member[] = [{ code: 'M001', name: 'John Doe' } as Member];

      jest.spyOn(memberRepo, 'findAndCount').mockResolvedValue([members, 1]);
      jest.spyOn(borrowingRepo, 'count').mockResolvedValue(1);

      const result = await service.findAllMembers({
        limit: 10,
        page: 1,
        search,
      });

      expect(memberRepo.findAndCount).toHaveBeenCalledWith({
        where: [{ name: ILike(`%${search}%`) }, { code: ILike(`%${search}%`) }],
        order: { name: 'ASC' },
        skip: 0,
        take: 10,
      });

      const expectedResponse = new FindAllUserResDto({
        data: [{ ...members[0], book_borrowed: 1 }],
        meta: {
          page: 1,
          per_page: 10,
          total: 1,
          total_page: 1,
        },
      });

      expect(result).toEqual(expectedResponse);
    });
  });
});
