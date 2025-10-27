import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';

import { AppConfigService } from 'src/commons/config';
import { IUser, MutationResponse, UtilsService } from 'src/commons/utils';
import { CACHE_STORE_KEY, CACHE_STORE_TIME } from 'src/commons/constants';

import { LoginDto, RegisterDto } from './auth.dto';
import { LoginResponse, SessionResponse, SignSessionResponse } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly utilsService: UtilsService,
    private readonly jwtService: JwtService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    @InjectConnection()
    private readonly model: Knex,
  ) {}

  /**
   * Handle sign session service
   * @param params
   * @returns
   */
  async signSession(params: Omit<IUser, 'iat' | 'exp'>): Promise<SignSessionResponse> {
    const getNow = Math.floor(Date.now() / 1000);
    const getSession = `${getNow}:${params.id}`;

    const getAccessToken = await this.jwtService.signAsync(
      {
        id: params.uuid,
        name: params.name,
      },
      {
        secret: this.appConfigService.JWT_SECRET,
        expiresIn: this.appConfigService.JWT_EXPIRES_IN,
      },
    );

    return {
      access_token: getAccessToken,
      session_id: getSession,
    };
  }

  /**
   * Handle session service
   * @param user
   * @returns
   */
  async session(user: IUser): Promise<SessionResponse> {
    const getSession = await this.cacheManager.get<string>(CACHE_STORE_KEY.SESSION(user.id));

    if (!getSession) {
      return {
        user_id: 0,
        session: false,
      };
    }

    const [sign, user_id] = getSession.split(':').map(Number);

    return {
      user_id: user_id,
      session: sign <= user.iat,
    };
  }

  /**
   * Handle register service
   * @param dto
   * @returns
   */
  async register(dto: RegisterDto): Promise<MutationResponse> {
    const getUser = await this.model('users').select('id').where('users.email', dto.email).first();

    if (getUser) {
      throw new BadRequestException('Email already exists');
    }

    const generatePassword = await this.utilsService.validateHash(dto.password);
    const formatPhone = this.utilsService.validateReplacePhone(dto.phone, '62');

    await this.model('users').insert({
      email: dto.email,
      password: generatePassword,
      name: dto.name,
      phone: formatPhone,
    });

    return {
      message: 'Successfully registered',
    };
  }

  /**
   * Handle login service
   * @param dto
   * @returns
   */
  async login(dto: LoginDto): Promise<LoginResponse> {
    const getUser = await this.model('users')
      .select(
        'users.id AS id',
        'users.uuid AS uuid',
        'users.name AS name',
        'users.password AS password',
      )
      .where('users.email', dto.user)
      .andWhere('users.status', 1)
      .first();

    if (!getUser) throw new BadRequestException('Email or password is incorrect');

    const getCompare = await this.utilsService.validateCompare(getUser.password, dto.password);

    if (!getCompare) throw new BadRequestException('Email or password is incorrect');

    const getDevice = await this.model('user_devices')
      .select('id')
      .where('user_id', getUser.id)
      .first();

    if (!getDevice) {
      await this.model('user_devices').insert({
        user_id: getUser.id,
        firebase_id: dto.device.firebase_id,
        device_browser: dto.device.device_browser,
        device_browser_version: dto.device.device_browser_version,
        device_imei: dto.device.device_imei,
        device_model: dto.device.device_model,
        device_type: dto.device.device_type,
        device_vendor: dto.device.device_vendor,
        device_os: dto.device.device_os,
        device_os_version: dto.device.device_os_version,
        device_platform: dto.device.device_platform,
        user_agent: dto.device.user_agent,
        app_version: dto.device.app_version,
      });
    } else {
      await this.model('user_devices').where({ user_id: getUser.id }).update({
        firebase_id: dto.device.firebase_id,
        device_browser: dto.device.device_browser,
        device_browser_version: dto.device.device_browser_version,
        device_imei: dto.device.device_imei,
        device_model: dto.device.device_model,
        device_type: dto.device.device_type,
        device_vendor: dto.device.device_vendor,
        device_os: dto.device.device_os,
        device_os_version: dto.device.device_os_version,
        device_platform: dto.device.device_platform,
        user_agent: dto.device.user_agent,
        app_version: dto.device.app_version,
        updated_at: this.model.fn.now(),
      });
    }

    const generateSession = await this.signSession({
      id: getUser.id,
      uuid: getUser.uuid,
      name: getUser.name,
    });

    await this.cacheManager.set(
      CACHE_STORE_KEY.SESSION(getUser.uuid),
      generateSession.session_id,
      CACHE_STORE_TIME.SESSION,
    );

    return {
      access_token: generateSession.access_token,
    };
  }
}
