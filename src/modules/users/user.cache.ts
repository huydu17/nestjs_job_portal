/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { User } from './entities/user.entity';

@Injectable()
export class UserCacheService {
  constructor(private readonly redisService: RedisService) {}

  private getKey(userId: number): string {
    return `user:${userId}`;
  }

  async getUser(userId: number): Promise<User | null> {
    const key = this.getKey(userId);
    const user = await this.redisService.get<User>(key);
    return user;
  }

  async saveUser(user: User): Promise<void> {
    const key = this.getKey(user.id);
    const { password, ...userToCache } = user;
    await this.redisService.set(key, userToCache, 3600);
  }

  async clearUser(userId: number): Promise<void> {
    const key = this.getKey(userId);
    await this.redisService.del(key);
  }
}
