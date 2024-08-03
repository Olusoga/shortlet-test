import { Controller, Get, Param, Query } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountryDetailsDto } from './dto/country-details.dto';
import { RedisService } from '../redis/redis.service';
import { CustomLogger } from '../customLogger/custom_logger.service';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('countries')
@Controller('api/countries')
export class CountriesController {
  constructor(
    private readonly logger: CustomLogger,
    private readonly countriesService: CountriesService,
    private readonly redisService: RedisService,
  ) {}

  @ApiOperation({ summary: 'Get a list of countries' })
  @ApiQuery({
    name: 'region',
    required: false,
    description: 'Filter by region',
  })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort by field' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    schema: { default: 1 },
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    schema: { default: 10 },
  })
  @ApiResponse({ status: 200, description: 'List of countries' })
  @Get()
  async getCountries(@Query() query) {
    this.logger.log(`Received request for countries, ${JSON.stringify(query)}`);
    const countries = await this.countriesService.fetchAllCountries(query);
    this.logger.log('Responding with countries data');
    return countries;
  }

  @Get('regions')
  @ApiOperation({ summary: 'Get a list of regions' })
  @ApiResponse({ status: 200, description: 'List of regions' })
  async getRegions() {
    this.logger.log('Received request for regions');
    const regions = await this.countriesService.fetchRegions();
    this.logger.log('Responding with regions data');
    return regions;
  }

  @Get('languages')
  @ApiOperation({ summary: 'Get a list of languages' })
  @ApiResponse({ status: 200, description: 'List of languages' })
  async getLanguages() {
    this.logger.log('Received request for languages');
    const languages = await this.countriesService.fetchLanguages();
    this.logger.log('Responding with languages data');
    return languages;
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get statistics about countries' })
  @ApiResponse({ status: 200, description: 'Statistics about countries' })
  async getStatistics() {
    this.logger.log('Received request for statistics');
    const statistics = await this.countriesService.fetchStatistics();
    this.logger.log('Responding with statistics data');
    return statistics;
  }

  @Get(':name')
  @ApiOperation({ summary: 'Get details of a country by name' })
  @ApiParam({
    name: 'name',
    required: true,
    description: 'Name of the country',
  })
  @ApiResponse({
    status: 200,
    description: 'Details of the country',
    type: CountryDetailsDto,
  })
  async getCountryByName(
    @Param('name') name: string,
  ): Promise<CountryDetailsDto> {
    this.logger.log(`Received request for country: ${name}`);
    const country = await this.countriesService.getCountryByName(name);
    this.logger.log(`Responding with data for country: ${name}`);
    return country;
  }
}
