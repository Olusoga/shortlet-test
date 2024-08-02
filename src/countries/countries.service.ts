import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { AXIOS_INSTANCE_TOKEN } from 'src/common/axios/axios.provider';
import { CountryQueryDto } from './dto/country-query.dto';


@Injectable()
export class CountriesService {
   
    constructor( @Inject(AXIOS_INSTANCE_TOKEN) private readonly http: AxiosInstance,
) {}

    async fetchAllCountries(query: CountryQueryDto) {

        const { region, sortBy, page = 1, limit = 10 } = query;
        try {
            const response = await this.http.get('/all');
            let countries = response.data;
      
            // Filtering by region
            if (region) {
              countries = countries.filter((country) =>
                country.region.toLowerCase() === region.toLowerCase(),
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
      }

