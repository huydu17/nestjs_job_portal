import { HttpStatus } from '@nestjs/common';
import { ApiResponseKey } from '../enums/api-response-key.enum';

export class ApiResponse {
  static ok<T>(
    data: T,
    message: string = '',
    statusCode: HttpStatus = HttpStatus.OK,
  ): Record<string, unknown> {
    return {
      [ApiResponseKey.STATUS_CODE]: statusCode,
      [ApiResponseKey.MESSAGE]: message,
      [ApiResponseKey.DATA]: data,
    };
  }

  static error<T>(
    error: T,
    message: string = '',
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ): Record<string, unknown> {
    return {
      [ApiResponseKey.STATUS_CODE]: statusCode,
      [ApiResponseKey.MESSAGE]: message,
      [ApiResponseKey.ERROR]: error,
    };
  }

  static message(
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ): Record<string, unknown> {
    return {
      [ApiResponseKey.STATUS_CODE]:
        statusCode === HttpStatus.OK || statusCode === HttpStatus.CREATED,
      [ApiResponseKey.MESSAGE]: message,
    };
  }
}
