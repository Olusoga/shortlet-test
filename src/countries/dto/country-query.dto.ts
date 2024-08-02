// src/countries/dto/country-query.dto.ts
import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class CountryQueryDto {
  @IsOptional()
  @IsString()
  readonly region?: string;

  @IsOptional()
  @IsString()
  readonly sortBy?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  readonly page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  readonly limit?: number;
}
