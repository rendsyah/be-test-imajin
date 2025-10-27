import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { map } from 'rxjs/operators';

import { SKIP_TRANSFORM_KEY } from '../decorators/skip';

type TransformResponse<T> = {
  statusCode: number;
  message: string;
  data: T;
};

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, TransformResponse<T>> {
  constructor(private readonly reflector: Reflector) {}

  private isEmptyObject(value: unknown): boolean {
    return (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      Object.keys(value).length === 0
    );
  }

  intercept(context: ExecutionContext, next: CallHandler) {
    const skipTransform = this.reflector.getAllAndOverride<boolean>(SKIP_TRANSFORM_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipTransform) {
      return next.handle();
    }

    return next.handle().pipe(
      map((res) => {
        const response = context.switchToHttp().getResponse<Response>();
        const statusCode = response.statusCode || 200;
        const message = 'Success';
        const data = res;

        const fallbackResponse = {
          statusCode,
          message,
          data,
        };

        if (data && !Array.isArray(data) && typeof data === 'object' && 'message' in data) {
          const { message: overrideMessage, ...rest } = data;
          fallbackResponse.message = overrideMessage || message;
          fallbackResponse.data = this.isEmptyObject(rest) ? null : rest;
        }

        return fallbackResponse;
      }),
    );
  }
}
