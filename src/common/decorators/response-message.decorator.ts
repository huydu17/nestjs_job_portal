import { SetMetadata } from '@nestjs/common';
export const RESPONSE_MESSAGE_KEY = 'ResponseMessage';
export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSAGE_KEY, message);
