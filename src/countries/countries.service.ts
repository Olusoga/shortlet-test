import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { AXIOS_INSTANCE_TOKEN } from 'src/common/axios/axios.provider';
import { CountryQueryDto } from './dto/country-query.dto';
import { CountryDetailsDto } from './dto/country-details.dto';

@Injectable()
export class CountriesService {
  constructor(
    @Inject(AXIOS_INSTANCE_TOKEN) private readonly http: AxiosInstance,
  ) {}

  async fetchAllCountries(query: CountryQueryDto) {
    const { region, sortBy, page = 1, limit = 10 } = query;
    try {
      const response = await this.http.get('/all');
      let countries = response.data;

      // Filtering by region
      if (region) {
        countries = countries.filter(
          (country) => country.region.toLowerCase() === region.toLowerCase(),
        );
      }

      // Sorting
      if (sortBy) {
        countries = countries.sort((a, b) => {
          if (a[sortBy] < b[sortBy]) return -1;
          if (a[sortBy] > b[sortBy]) return 1;
          return 0;
        });
      }

      // Pagination
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedCountries = countries.slice(start, end);

      return {
        total: countries.length,
        page,
        limit,
        data: paginatedCountries,
      };
    } catch (error) {
      throw new HttpException(
        'Error fetching countries data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCountryByName(name: string): Promise<CountryDetailsDto> {
    try {
      const response = await this.http.get(`/name/${name}`);
      const country = response.data[0];

      if (!country) {
        throw new HttpException('Country not found', HttpStatus.NOT_FOUND);
      }

      return {
        name: country.name.common,
        population: country.population,
        area: country.area,
        languages: Object.values(country.languages).join(', '),
        borders: country.borders || [],
      };
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new HttpException('Country not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Error fetching country details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async fetchRegions(): Promise<any> {
    const countries = await this.fetchAllCountries({});
    const regions = {};

    countries.data.forEach((country) => {
      const region = country.region || 'Unknown';
      if (!regions[region]) {
        regions[region] = { countries: [], totalPopulation: 0 };
      }
      const countryInfo = {
        name: country.name.common,
        population: country.population,
        languages: country.languages,
      };
      regions[region].countries.push(countryInfo);
      regions[region].totalPopulation += country.population;
    });

    return regions;
  }

}
