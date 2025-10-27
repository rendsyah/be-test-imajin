import { Test, TestingModule } from '@nestjs/testing';

import { AppConfigService } from 'src/commons/config';

import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: AppConfigService,
          useValue: {
            JWT_SECRET: 'secret',
          },
        },
        {
          provide: AuthService,
          useValue: {
            session: jest.fn(),
          },
        },
      ],
    }).compile();

    strategy = module.get(JwtStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
    expect(authService).toBeDefined();
  });
});
