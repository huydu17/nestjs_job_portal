/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject } from '@nestjs/common';
import { BcryptProvider } from './bcrypt.provider';
import type { ConfigType } from '@nestjs/config';
import jwtConfig from 'src/configs/jwt.config';
import ms, { StringValue } from 'ms';
import { RedisService } from 'src/redis/redis.service';

export class RefreshTokenProvider {
  constructor(
    @Inject() private redisService: RedisService,
    private readonly bcryptProvider: BcryptProvider,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async saveTokenToRedis(userId: number, refreshToken: string) {
    const hashRfToken = await this.bcryptProvider.hash(refreshToken);
    const ttlInMs = ms(this.jwtConfiguration.refreshTokenTtl as StringValue);
    return this.redisService.set(
      `refreshToken:${userId}`,
      hashRfToken,
      ttlInMs,
    );
  }

  async getTokenFromRedis(userId: number): Promise<string | null> {
    const token: string | null = await this.redisService.get<string>(
      `refreshToken:${userId}`,
    );
    return token;
  }
  async deleteTokenFromRedis(userId: number): Promise<void> {
    await this.redisService.del(`refreshToken:${userId}`);
  }
}
