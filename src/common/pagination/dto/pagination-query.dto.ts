import { IsOptional, IsPositive, IsString } from 'class-validator';

export const PAGE = 1;
export const LIMIT = 5;

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  page?: number = PAGE;

  @IsOptional()
  @IsPositive()
  limit?: number = LIMIT;

  @IsOptional()
  @IsString()
  filter?: string = '';
}
