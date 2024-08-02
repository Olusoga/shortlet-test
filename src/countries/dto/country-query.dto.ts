import { ApiPropertyOptional } from '@nestjs/swagger';

export class CountryQueryDto {
  @ApiPropertyOptional({ description: 'Filter by region' })
  region?: string;

  @ApiPropertyOptional({ description: 'Sort by field' })
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  page?: number;

  @ApiPropertyOptional({ description: 'Number of items per page', default: 10 })
  limit?: number;
}
