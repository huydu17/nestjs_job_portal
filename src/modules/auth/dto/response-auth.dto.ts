import { Expose, Type } from 'class-transformer';

class UserResponse {
  @Expose()
  _id: string;
  @Expose()
  name: string;
  @Expose()
  email: string;
  @Expose()
  roles: string[];
}

export class ResponseAuthDto {
  @Expose()
  @Type(() => UserResponse)
  user: UserResponse;
  @Expose()
  accessToken: string;
  @Expose()
  refreshToken: string;
}
