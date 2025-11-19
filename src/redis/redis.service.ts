/* eslint-disable no-useless-catch */
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl);
    } catch (error) {
      throw error;
    }
  }

  async get<T>(key: string): Promise<any> {
    try {
      const value = await this.cacheManager.get<T>(key);
      return value ?? null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (error) {
      throw error;
    }
  }
}
