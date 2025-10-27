import { Test, TestingModule } from '@nestjs/testing';

import { UtilsService } from 'src/commons/utils';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let utilsService: jest.Mocked<UtilsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UtilsService,
          useValue: {
            pagination: jest.fn(),
            paginationResponse: jest.fn(),
            validateCapitalizeWords: jest.fn(),
          },
        },
        {
          provide: 'default',
          useValue: {
            model: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    utilsService = module.get(UtilsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(utilsService).toBeDefined();
  });
});
