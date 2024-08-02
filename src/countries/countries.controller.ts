import { Controller, Get, Param, Query } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountryDetailsDto } from './dto/country-details.dto';
import { RedisService } from 'src/redis/redis.service';

@Controller('api')
export class CountriesController {
  constructor(
    private readonly countriesService: CountriesService,
    private readonly redisService: RedisService,) {}

  @Get('countries')
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

  @Get('/countries/regions')
  async getRegions() {
    const cacheKey = `regions`;
    const cachedData = await this.redisService.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const regions = await this.countriesService.fetchRegions();
    await this.redisService.set(cacheKey, JSON.stringify(regions), 3600); 
    return regions;
  }

  @Get('/countries/languages')
  async getLanguages() {
    return this.countriesService.fetchLanguages();
  }

  @Get('countries/statistics')
  async getStatistics() {
    return this.countriesService.fetchStatistics();
  }

  @Get('/countries/:name')
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
