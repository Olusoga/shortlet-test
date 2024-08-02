import { Controller, Get, Param, Query } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountryDetailsDto } from './dto/country-details.dto';
import { RedisService } from '../redis/redis.service';
import { CustomLogger } from '../customLogger/custom_logger.service';

@Controller('api/countries')
export class CountriesController {
  constructor(
    private readonly logger: CustomLogger,
    private readonly countriesService: CountriesService,
    private readonly redisService: RedisService,) {}

    @Get()
    async getCountries(@Query() query) {
      this.logger.log(`Received request for countries, ${JSON.stringify(query)}`);
      const countries = await this.countriesService.fetchAllCountries(query);
      this.logger.log('Responding with countries data');
      return countries;
    }
  
    @Get('regions')
    async getRegions() {
      this.logger.log('Received request for regions');
      const regions = await this.countriesService.fetchRegions();
      this.logger.log('Responding with regions data');
      return regions;
    }
  
    @Get('languages')
    async getLanguages() {
      this.logger.log('Received request for languages');
      const languages = await this.countriesService.fetchLanguages();
      this.logger.log('Responding with languages data');
      return languages;
    }
  
    @Get('statistics')
    async getStatistics() {
      this.logger.log('Received request for statistics');
      const statistics = await this.countriesService.fetchStatistics();
      this.logger.log('Responding with statistics data');
      return statistics;
    }
  
    @Get(':name')
    async getCountryByName(@Param('name') name: string): Promise<CountryDetailsDto> {
      this.logger.log(`Received request for country: ${name}`);
      const country = await this.countriesService.getCountryByName(name);
      this.logger.log(`Responding with data for country: ${name}`);
      return country;
    }
  }
