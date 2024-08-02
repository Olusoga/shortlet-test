import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { AXIOS_INSTANCE_TOKEN } from 'src/common/axios/axios.provider';
import { CountryQueryDto } from './dto/country-query.dto';
import { CountryDetailsDto } from './dto/country-details.dto';
import { CustomLogger } from 'src/customLogger/custom_logger.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class CountriesService {
  constructor(
  private readonly logger: CustomLogger,
  private readonly redisService: RedisService,
  @Inject(AXIOS_INSTANCE_TOKEN) private readonly http: AxiosInstance,
  ) {}

  private async fetchData(endpoint: string): Promise<any[]> {
    try {
    const response = await this.http.get(endpoint);
    this.logger.log(`Successfully fetched data from ${endpoint}`);
    return response.data;
    } catch (error) {
    this.logger.error(`Failed to fetch data from ${endpoint}`, error.message);
    throw new HttpException('Failed to fetch data', HttpStatus.BAD_REQUEST);
    }
  }


  private async getCachedData(
    cacheKey: string,
    fetchFunction: () => Promise<any>,
  ): Promise<any> {
    const cachedData = await this.redisService.get(cacheKey);
    if (cachedData) {
    this.logger.log(`Cache hit for key: ${cacheKey}`);
    return JSON.parse(cachedData);
    }
    this.logger.log(`Cache miss for key: ${cacheKey}`);
    const data = await fetchFunction();
    await this.redisService.set(cacheKey, JSON.stringify(data), 3600); 
    return data;
  }


  async fetchAllCountries(query: CountryQueryDto) {
    const { region, sortBy, page = 1, limit = 10 } = query;
    const cacheKey = `countries_${JSON.stringify(query)}`;

    return this.getCachedData(cacheKey, async () => {
    try {
    const countries = await this.fetchData('/all');

    // Filtering by region
    const filteredCountries = region
    ? countries.filter((country) => 
    country.region.toLowerCase() === region.toLowerCase(),
    )
    : countries;

    // Sorting
    const sortedCountries = sortBy
    ? filteredCountries.sort((a, b) =>
        a[sortBy] < b[sortBy] ? -1 : a[sortBy] > b[sortBy] ? 1 : 0,
      )
    : filteredCountries;

    // Pagination
    const paginatedCountries = sortedCountries.slice(
    (page - 1) * limit,
    page * limit,
    );

    this.logger.log(
      `Fetched and processed countries data with query: ${JSON.stringify(query)}`,
    );
    return {
      total: sortedCountries.length,
      page,
      limit,
      data: paginatedCountries,
    };
      } catch (error) {
      this.logger.error('Error fetching countries data', error.message);
      throw new HttpException(
      'Error fetching countries data',
      HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  });
}


  async getCountryByName(name: string): Promise<CountryDetailsDto> {
    const cacheKey = `country_${name}`;

    return this.getCachedData(cacheKey, async () => {
      try {
      const countries = await this.fetchData(`/name/${name}`);
      const country = countries[0];

      if (!country) {
        this.logger.warn(`Country not found: ${name}`);
        throw new HttpException('Country not found', HttpStatus.NOT_FOUND);
      }

      this.logger.log(`Fetched details for country: ${name}`);
      return {
        name: country.name.common,
        population: country.population,
        area: country.area,
        languages: Object.values(country.languages).join(', '),
        borders: country.borders || [],
        };
      } catch (error) {
        this.logger.error(
          `Error fetching country details for ${name}`,
          error.message,
        );
        if (error.response && error.response.status === 404) {
          throw new HttpException('Country not found', HttpStatus.NOT_FOUND);
        }
        throw new HttpException(
          'Error fetching country details',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });
  }

  
  private async fetchCountriesByRegion(region: string): Promise<any[]> {
    const cacheKey = `region_${region}`;

    return this.getCachedData(cacheKey, async () => {
    const countries = await this.fetchData(`/region/${region}`);
    this.logger.log(
      `Fetched ${countries.length} countries for region ${region}`,
      );
      return countries;
    });
  }


  async fetchRegions(): Promise<any> {
    const cacheKey = 'regions';

    return this.getCachedData(cacheKey, async () => {
      const regionsList = [
        'Africa',
        'Americas',
        'Asia',
        'Europe',
        'Oceania',
        'Antarctic',
        'Caribbean',
      ];
      const regions = {};

      for (const region of regionsList) {
      const countries = await this.fetchCountriesByRegion(region);
      regions[region] = {
        countries: countries.map((country) => ({
        name: country.name.common,
        population: country.population,
        languages: country.languages,
        })),
        totalPopulation: countries.reduce(
        (sum, country) => sum + country.population,
          0,
         ),
      };
        this.logger.log(`Processed region: ${region}`);
    }

      return regions;

    });
  }


  async fetchLanguages(): Promise<any> {
    const cacheKey = 'languages';

    return this.getCachedData(cacheKey, async () => {
    const countries = await this.fetchData('/all');
    const languages = {};

      countries.forEach((country) => {
      const countryLanguages = country.languages || {};
      Object.keys(countryLanguages).forEach((language) => {
      if (!languages[language]) {
        languages[language] = { countries: [], totalSpeakers: 0 };
      }
      languages[language].countries.push({
      name: country.name.common,
      population: country.population,
      });
      languages[language].totalSpeakers += country.population;
      });
    });

      this.logger.log('Fetched and processed languages data');
      return languages;
    });
  }

  
  async fetchStatistics(): Promise<any> {
    const cacheKey = 'statistics';

    return this.getCachedData(cacheKey, async () => {
      const countries = await this.fetchData('/all');
      const totalCountries = countries.length;
      let largestCountry = countries[0];
      let smallestCountry = countries[0];
      const languageSpeakers = {};

      countries.forEach((country) => {
        if (country.area > largestCountry.area) largestCountry = country;
        if (country.population < smallestCountry.population)
          smallestCountry = country;

        const countryLanguages = country.languages || {};
        Object.keys(countryLanguages).forEach((language) => {
          if (!languageSpeakers[language]) {
            languageSpeakers[language] = 0;
          }
          languageSpeakers[language] += country.population;
        });
      });

      const mostSpokenLanguage = Object.keys(languageSpeakers).reduce(
        (acc, language) =>
          languageSpeakers[language] > acc.speakers
            ? { language, speakers: languageSpeakers[language] }
            : acc,
        { language: '', speakers: 0 },
      );

      this.logger.log('Fetched and processed statistics data');
      return {
        totalCountries,
        largestCountry,
        smallestCountry,
        mostSpokenLanguage,
      };
    });
  }
}
