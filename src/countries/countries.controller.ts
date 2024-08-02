import { Controller, Get, Param, Query } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountryDetailsDto } from './dto/country-details.dto';
import { RedisService } from 'src/redis/redis.service';

@Controller('countries')
export class CountriesController {
  constructor(
    private readonly countriesService: CountriesService,
    private readonly redisService: RedisService,) {}

  @Get()
  async getCountries(@Query() query) {
    const cacheKey = `countries_${JSON.stringify(query)}`;
    const cachedData = await this.redisService.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const countries = await this.countriesService.fetchAllCountries(query);
    await this.redisService.set(cacheKey, JSON.stringify(countries), 3600); // Cache for 1 hour
    return countries;
  }

  @Get(':name')
  async getCountryByName(
    @Param('name') name: string,
  ): Promise<CountryDetailsDto> {
    const cacheKey = `country_${name}`;
    const cachedData = await this.redisService.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const country = await this.countriesService.getCountryByName(name);
    await this.redisService.set(cacheKey, JSON.stringify(country), 3600);
    return country;
  }
}
