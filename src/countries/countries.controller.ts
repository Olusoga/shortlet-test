import { Controller, Get, Param, Query } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountryDetailsDto } from './dto/country-details.dto';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  async getCountries(@Query() query) {
    const countries = await this.countriesService.fetchAllCountries(query);

    return countries;
  }

  @Get(':name')
  async getCountryByName(
    @Param('name') name: string,
  ): Promise<CountryDetailsDto> {
    return this.countriesService.getCountryByName(name);
  }
}
