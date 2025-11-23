import { Module } from '@nestjs/common';
import { PaginationService } from './pagination.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  providers: [PaginationService, RedisModule],
  exports: [PaginationService],
})
export class PaginationModule {}
