import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { AppConfigService } from 'src/commons/config';
import { UtilsService } from 'src/commons/utils';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let utilsService: jest.Mocked<UtilsService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AppConfigService,
          useValue: {
            JWT_SECRET: 'secret',
            JWT_EXPIRES_IN: '1d',
          },
        },
        {
          provide: UtilsService,
          useValue: {
            validateCompare: jest.fn(),
            validateRandomChar: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
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

    service = module.get<AuthService>(AuthService);

    utilsService = module.get(UtilsService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(utilsService).toBeDefined();
    expect(jwtService).toBeDefined();
  });
});
