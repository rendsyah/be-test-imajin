import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

import { AppConfigService } from 'src/commons/config';
import { UtilsService } from 'src/commons/utils';

import { UploadService } from './upload.service';

describe('UploadService', () => {
  let service: UploadService;
  let utilsService: jest.Mocked<UtilsService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        {
          provide: AppConfigService,
          useValue: {
            JWT_SECRET: 'secret',
          },
        },
        {
          provide: UtilsService,
          useValue: {
            validateRandomChar: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);

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
