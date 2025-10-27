import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { ServeStaticModule } from '@nestjs/serve-static';
import { BullModule } from '@nestjs/bullmq';
import { KnexModule } from 'nest-knexjs';
import { ZodValidationPipe } from 'nestjs-zod';
import { createKeyv } from '@keyv/redis';
import { resolve } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AppConfigModule, AppConfigService } from './commons/config';
import { AppLoggerModule } from './commons/logger';
import { UtilsModule } from './commons/utils';
import { TraceMiddleware } from './commons/middlewares';
import { AllExceptionsFilter } from './commons/filters';
import {
  LoggingInterceptor,
  TimeoutInterceptor,
  TransformInterceptor,
} from './commons/interceptors';

import { UploadWorkerModule } from './workers/upload';

import { AuthModule } from './modules/auth/auth.module';
import { CartsModule } from './modules/carts/carts.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ProductsModule } from './modules/products/products.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { UploadModule } from './modules/upload/upload.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: resolve(process.cwd(), '..', 'public'),
      serveRoot: '/media',
      exclude: ['/api/v1/*path'],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => ({
        stores: [
          createKeyv(appConfigService.REDIS_HOST, {
            connectionTimeout: 10000,
          }),
        ],
      }),
    }),
    BullModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => ({
        connection: {
          url: appConfigService.REDIS_HOST,
          connectTimeout: 10000,
        },
      }),
    }),
    KnexModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => ({
        config: {
          client: appConfigService.DB_TYPE,
          connection: {
            host: appConfigService.DB_HOST,
            port: appConfigService.DB_PORT,
            user: appConfigService.DB_USER,
            password: appConfigService.DB_PASS,
            database: appConfigService.DB_NAME,
          },
          pool: {
            min: 2,
            max: 20,
            idleTimeoutMillis: 10000,
            acquireTimeoutMillis: 10000,
          },
        },
      }),
    }),
    AppConfigModule,
    AppLoggerModule,
    UtilsModule,
    UploadWorkerModule,

    AuthModule,
    CartsModule,
    CategoriesModule,
    PaymentsModule,
    ProductsModule,
    TransactionsModule,
    UploadModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TimeoutInterceptor },
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule implements NestModule {
  static port: number;
  static docs: boolean;

  constructor(private readonly appConfigService: AppConfigService) {
    AppModule.port = this.appConfigService.API_PORT;
    AppModule.docs = this.appConfigService.API_DOCS;
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TraceMiddleware).forRoutes({ path: '/v1/*path', method: RequestMethod.ALL });
  }
}
