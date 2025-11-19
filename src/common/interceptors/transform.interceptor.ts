/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';

export interface IResponse<T> {
  statusCode: number;
  message: string;
  data: T | null;
  meta?: any;
  links?: any;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, IResponse<T>>
{
  constructor(private reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponse<T>> {
    const statusCode = context.switchToHttp().getResponse().statusCode;
    const message = this.reflector.get<string>(
      RESPONSE_MESSAGE_KEY,
      context.getHandler(),
    );
    return next.handle().pipe(
      map((data) => {
        if (
          data &&
          typeof data === 'object' &&
          'message' in data &&
          Object.keys(data).length === 1
        ) {
          return {
            statusCode,
            message: data.message,
            data: null,
          };
        }
        if (data && data.results && Array.isArray(data.results)) {
          return {
            statusCode,
            message: message || 'success',
            data: data.results,
            meta: data.meta,
            links: data.links,
          };
        }
        return {
          statusCode,
          message: message || 'success',
          data,
        };
      }),
    );
  }
}
