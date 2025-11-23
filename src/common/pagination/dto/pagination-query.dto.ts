import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export const PAGE = 1;
export const LIMIT = 5;

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    default: PAGE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number = PAGE;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    default: LIMIT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  limit?: number = LIMIT;

  @ApiPropertyOptional({
    description: 'Keyword for searching (e.g., job title, company name)',
  })
  @IsOptional()
  @IsString()
  filter?: string = '';
}
