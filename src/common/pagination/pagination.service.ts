/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Inject, Injectable } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';
import type { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { LIMIT, PAGE, PaginationQueryDto } from './dto/pagination-query.dto';
import { Paginated } from './intefaces/paginated.interface';

@Injectable()
export class PaginationService {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}
  async paginateQuery<T extends ObjectLiteral>(
    paginateQuery: PaginationQueryDto,
    repository: Repository<T>,
    options?: any,
  ): Promise<Paginated<T>> {
    const { page = PAGE, limit = LIMIT } = paginateQuery;
    const results = await repository.find({
      ...options,
      skip: (page - 1) * limit,
      take: limit,
    });
    const baseURL =
      this.request.protocol + '://' + this.request.headers.host + '/';
    const newURL = new URL(this.request.url, baseURL);
    const totalItems = await repository.count();
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
    return finalResponse;
  }
}
