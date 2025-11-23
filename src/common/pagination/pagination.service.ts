/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Inject, Injectable } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';
import type { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { LIMIT, PAGE, PaginationQueryDto } from './dto/pagination-query.dto';
import { Paginated } from './intefaces/paginated.interface';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class PaginationService {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
    private redisService: RedisService,
  ) {}
  async paginateQuery<T extends ObjectLiteral>(
    paginateQuery: PaginationQueryDto,
    repository: Repository<T>,
    options?: any,
    cacheKey?: string,
    ttl?: number,
  ): Promise<Paginated<T>> {
    const { page = PAGE, limit = LIMIT } = paginateQuery;
    let finalCacheKey = '';
    if (cacheKey) {
      const optionsString = JSON.stringify(options);
      finalCacheKey = `${cacheKey}:page:${page}:limit:${limit}:opt:${optionsString}`;
      const cacheData = await this.redisService.get(finalCacheKey.toString());
      if (cacheData) {
        return cacheData;
      }
    }
    const [results, totalItems] = await repository.findAndCount({
      ...options,
      skip: (page - 1) * limit,
      take: limit,
    });
    const baseURL =
      this.request.protocol + '://' + this.request.headers.host + '/';
    const newURL = new URL(this.request.url, baseURL);
    const totalPages = Math.ceil(totalItems / limit);
    const nextPage = page === totalPages ? page : page + 1;
    const previousPage = page === 1 ? page : page - 1;
    const finalResponse: Paginated<T> = {
      results: results,
      meta: {
        itemsPerPage: results.length,
        totalItems: totalItems,
        currentPage: page,
        totalPages: totalPages,
      },
      links: {
        first: `${newURL.protocol}${newURL.host}/${newURL.pathname}?limit=${paginateQuery.limit}&page=1`,
        last: `${newURL.protocol}${newURL.host}/${newURL.pathname}?limit=${paginateQuery.limit}&page=${totalPages}`,
        current: `${newURL.protocol}${newURL.host}/${newURL.pathname}?limit=${paginateQuery.limit}&page=${paginateQuery.page}`,
        previous: `${newURL.protocol}${newURL.host}/${newURL.pathname}?limit=${paginateQuery.limit}&page=${previousPage}`,
        next: `${newURL.protocol}${newURL.host}/${newURL.pathname}?limit=${paginateQuery.limit}&page=${nextPage}`,
      },
    };
    if (finalCacheKey) {
      await this.redisService.set(finalCacheKey, finalResponse, ttl || 3600);
    }
    return finalResponse;
  }
}
