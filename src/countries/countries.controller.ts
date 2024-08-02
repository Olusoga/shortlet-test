import { Controller, Get, Query } from '@nestjs/common';
import { CountriesService } from './countries.service';

@Controller('countries')
export class CountriesController {
    constructor(private readonly countriesService: CountriesService) {}

@Get('countries')
async getCountries(@Query() query) {
const countries = await this.countriesService.fetchAllCountries(query);
 
return countries;
  }
}
