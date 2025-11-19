/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';
import { ClassConstructor } from 'class-transformer';

export function Serialize<T>(dto: ClassConstructor<T>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private dto: ClassConstructor<T>) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        if (data && data.results && Array.isArray(data.results)) {
          const transformedData = plainToInstance(this.dto, data.results, {
            excludeExtraneousValues: true,
          });
          return {
            ...data,
            data: transformedData,
          };
        }
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
