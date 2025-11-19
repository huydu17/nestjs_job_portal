import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheableMemory } from 'cacheable';
import KeyvRedis, { Keyv } from '@keyv/redis';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
            }),
            new KeyvRedis(configService.get<string>('database.redisHost')),
          ],
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
