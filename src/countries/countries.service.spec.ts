import { Test, TestingModule } from '@nestjs/testing';
import { CountriesService } from './countries.service';
import { CustomLogger } from '../customLogger/custom_logger.service';
import { RedisService } from '../redis/redis.service';
import { AXIOS_INSTANCE_TOKEN } from '../common/axios/axios.provider';
import { HttpException } from '@nestjs/common';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CountriesService', () => {
  let service: CountriesService;
  let logger: CustomLogger;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountriesService,
        {
          provide: CustomLogger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
        {
          provide: AXIOS_INSTANCE_TOKEN,
          useValue: mockedAxios,
        },
      ],
    }).compile();

    service = module.get<CountriesService>(CountriesService);
    logger = module.get<CustomLogger>(CustomLogger);
    redisService = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchData', () => {
    it('should fetch data successfully', async () => {
      const endpoint = '/all';
      const responseData = [{ name: 'Country1' }, { name: 'Country2' }];
      mockedAxios.get.mockResolvedValueOnce({ data: responseData });

      const result = await service['fetchData'](endpoint);

      expect(result).toEqual(responseData);
      expect(logger.log).toHaveBeenCalledWith(`Successfully fetched data from ${endpoint}`);
    });

    it('should throw an error if fetching data fails', async () => {
      const endpoint = '/all';
      mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

      await expect(service['fetchData'](endpoint)).rejects.toThrow(HttpException);
      expect(logger.error).toHaveBeenCalledWith(`Failed to fetch data from ${endpoint}`, 'Network Error');
    });
});

describe('getCachedData', () => {
  it('should return cached data if available', async () => {
    const cacheKey = 'test_key';
    const cachedData = { data: 'cached' };
    jest.spyOn(redisService, 'get').mockResolvedValueOnce(JSON.stringify(cachedData));

    const result = await service['getCachedData'](cacheKey, jest.fn());

    expect(result).toEqual(cachedData);
    expect(logger.log).toHaveBeenCalledWith(`Cache hit for key: ${cacheKey}`);
  });
  it('should fetch data and cache it if not available', async () => {
    const cacheKey = 'test_key';
    const fetchData = jest.fn().mockResolvedValueOnce({ data: 'fetched' });
    jest.spyOn(redisService, 'get').mockResolvedValueOnce(null);
    jest.spyOn(redisService, 'set').mockResolvedValueOnce(null);

    const result = await service['getCachedData'](cacheKey, fetchData);

    expect(result).toEqual({ data: 'fetched' });
    expect(fetchData).toHaveBeenCalled();
    expect(redisService.set).toHaveBeenCalledWith(cacheKey, JSON.stringify({ data: 'fetched' }), 3600);
    expect(logger.log).toHaveBeenCalledWith(`Cache miss for key: ${cacheKey}`);
  });
});

describe('fetchAllCountries', () => {
  it('should fetch and process countries data successfully', async () => {
    const query = { region: 'Asia', sortBy: 'name', page: 1, limit: 10 };
    const endpoint = '/all';
    const responseData = [
      { name: 'Country1', region: 'Asia' },
      { name: 'Country2', region: 'Europe' },
    ];
    const expectedFilteredData = [{ name: 'Country1', region: 'Asia' }];
    mockedAxios.get.mockResolvedValueOnce({ data: responseData });
    jest.spyOn(redisService, 'get').mockResolvedValueOnce(null);
    jest.spyOn(redisService, 'set').mockResolvedValueOnce(null);

    const result = await service.fetchAllCountries(query);

    expect(result).toEqual({
      total: 1,
      page: 1,
      limit: 10,
      data: expectedFilteredData,
    });
    expect(logger.log).toHaveBeenCalledWith(
      `Fetched and processed countries data with query: ${JSON.stringify(query)}`,
    );
  });

  it('should return cached data if available', async () => {
    const query = { region: 'Asia', sortBy: 'name', page: 1, limit: 10 };
    const cachedData = {
      total: 1,
      page: 1,
      limit: 10,
      data: [{ name: 'Country1', region: 'Asia' }],
    };
    jest.spyOn(redisService, 'get').mockResolvedValueOnce(JSON.stringify(cachedData));

    const result = await service.fetchAllCountries(query);

    expect(result).toEqual(cachedData);
    expect(logger.log).toHaveBeenCalledWith(`Cache hit for key: countries_${JSON.stringify(query)}`);
  });

  it('should throw an error if fetching data fails', async () => {
    const query = { region: 'Asia', sortBy: 'name', page: 1, limit: 10 };
    const endpoint = '/all';
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));
    jest.spyOn(redisService, 'get').mockResolvedValueOnce(null);

    await expect(service.fetchAllCountries(query)).rejects.toThrow(HttpException);
    expect(logger.error).toHaveBeenCalledWith('Failed to fetch data from /all', 'Network Error');
  });
});

describe('getCountryByName', () => {
  it('should fetch country details successfully', async () => {
    const name = 'country1';
    const endpoint = `/name/${name}`;
    const responseData = [
      {
        name: { common: 'Country1' },
        population: 1000000,
        area: 50000,
        languages: { en: 'English' },
        borders: ['Border1', 'Border2'],
      },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: responseData });
    jest.spyOn(redisService, 'get').mockResolvedValueOnce(null);
    jest.spyOn(redisService, 'set').mockResolvedValueOnce(null);

    const result = await service.getCountryByName(name);

    expect(result).toEqual({
      name: 'Country1',
      population: 1000000,
      area: 50000,
      languages: 'English',
      borders: ['Border1', 'Border2'],
    });
    expect(logger.log).toHaveBeenCalledWith(`Fetched details for country: ${name}`);
  });

  it('should return cached data if available', async () => {
    const name = 'country1';
    const cachedData = {
      name: 'Country1',
      population: 1000000,
      area: 50000,
      languages: 'English',
      borders: ['Border1', 'Border2'],
    };

    const cacheKey = service.generateCacheKey('country', { name });

    jest.spyOn(redisService, 'get').mockResolvedValueOnce(JSON.stringify(cachedData));
    jest.spyOn(logger, 'log');

    const result = await service.getCountryByName(name);

    expect(result).toEqual(cachedData);
    expect(logger.log).toHaveBeenCalledWith(`Cache hit for key: ${cacheKey}`);
  });

  it('should throw an internal server error if fetching country details fails', async () => {
    const name = 'country1';
    const endpoint = `/name/${name}`;
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));
    jest.spyOn(redisService, 'get').mockResolvedValueOnce(null);

    await expect(service.getCountryByName(name)).rejects.toThrow(HttpException);
    expect(logger.error).toHaveBeenCalledWith(
      `Failed to fetch data from ${endpoint}`,
      'Network Error',
    );
  });
});

describe('fetchCountriesByRegion', () => {
  it('should fetch countries by region and cache the result', async () => {
    const region = 'Europe';
    const countries = [{ name: { common: 'Country1' } }, { name: { common: 'Country2' } }];
    const endpoint = `/region/${region}`;
    mockedAxios.get.mockResolvedValueOnce({ data: countries });
    jest.spyOn(redisService, 'get').mockResolvedValueOnce(null);
    jest.spyOn(redisService, 'set').mockResolvedValueOnce(null);

    const result = await service['fetchCountriesByRegion'](region);
    const cacheKey = service.generateCacheKey('region', { region });
    expect(mockedAxios.get).toHaveBeenCalledWith(endpoint);
    expect(result).toEqual(countries);
    expect(redisService.set).toHaveBeenCalledWith(
      cacheKey,
      JSON.stringify(countries),
      3600,
    );
    
    expect(logger.log).toHaveBeenCalledWith(
      `Fetched ${countries.length} countries for region ${region}`,
    );
  });

  it('should return cached data if available', async () => {
    const region = 'Europe';
    const cacheKey = service.generateCacheKey('region', { region });
    const cachedData = [{ name: { common: 'Country1' } }, { name: { common: 'Country2' } }];
    jest.spyOn(redisService, 'get').mockResolvedValueOnce(JSON.stringify(cachedData));

    const result = await service['fetchCountriesByRegion'](region);

    expect(result).toEqual(cachedData);
    expect(logger.log).toHaveBeenCalledWith(`Cache hit for key: ${cacheKey}`);
  });

  it('should throw an error if fetching data fails', async () => {
    const region = 'Europe';
    const endpoint = `/region/${region}`;
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));
    jest.spyOn(redisService, 'get').mockResolvedValueOnce(null);

    await expect(service['fetchCountriesByRegion'](region)).rejects.toThrow(HttpException);
    expect(logger.error).toHaveBeenCalledWith(
      `Failed to fetch data from ${endpoint}`,
      'Network Error',
    );
  });
});

describe('fetchRegions', () => {
  it('should fetch regions and cache the result', async () => {
    const regionsList = [
      'Africa',
      'Americas',
      'Asia',
      'Europe',
      'Oceania',
      'Antarctic',
      'Caribbean',
    ];
    const mockCountries = (region: string) => [
      { name: { common: `Country1_${region}` }, population: 1000000, languages: { en: 'English' } },
      { name: { common: `Country2_${region}` }, population: 2000000, languages: { en: 'English' } },
    ];

    jest.spyOn(service, 'fetchCountriesByRegion' as any).mockImplementation(async (region: string) => {
      return mockCountries(region);
    });

    jest.spyOn(redisService, 'get').mockResolvedValueOnce(null);
    jest.spyOn(redisService, 'set').mockResolvedValueOnce(null);

    const result = await service.fetchRegions();

    const expectedRegions = regionsList.reduce((acc, region) => {
      const countries = mockCountries(region);
      acc[region] = {
        countries: countries.map((country) => ({
          name: country.name.common,
          population: country.population,
          languages: country.languages,
        })),
        totalPopulation: countries.reduce((sum, country) => sum + country.population, 0),
      };
      return acc;
    }, {});

    expect(result).toEqual(expectedRegions);
    expect(redisService.set).toHaveBeenCalledWith(
      'regions',
      JSON.stringify(expectedRegions),
      3600,
    );
    regionsList.forEach((region) => {
      expect(logger.log).toHaveBeenCalledWith(`Processed region: ${region}`);
    });
  });

  it('should return cached data if available', async () => {
    const cachedData = {
      Africa: {
        countries: [
          { name: 'Country1_Africa', population: 1000000, languages: { en: 'English' } },
          { name: 'Country2_Africa', population: 2000000, languages: { en: 'English' } },
        ],
        totalPopulation: 3000000,
      },
      Europe: {
        countries: [
          { name: 'Country1_Europe', population: 1000000, languages: { en: 'English' } },
          { name: 'Country2_Europe', population: 2000000, languages: { en: 'English' } },
        ],
        totalPopulation: 3000000,
      },
    };
    jest.spyOn(redisService, 'get').mockResolvedValueOnce(JSON.stringify(cachedData));

    const result = await service.fetchRegions();

    expect(result).toEqual(cachedData);
    expect(logger.log).toHaveBeenCalledWith('Cache hit for key: regions');
  });
});
describe('fetchLanguages', () => {
  it('should fetch and process languages data successfully', async () => {
    const countries = [
      {
        name: { common: 'Country1' },
        population: 1000000,
        languages: { en: 'English', es: 'Spanish' },
      },
      {
        name: { common: 'Country2' },
        population: 500000,
        languages: { en: 'English' },
      },
    ];
    const expectedLanguages = {
      en: {
        countries: [
          { name: 'Country1', population: 1000000 },
          { name: 'Country2', population: 500000 },
        ],
        totalSpeakers: 1500000,
      },
      es: {
        countries: [{ name: 'Country1', population: 1000000 }],
        totalSpeakers: 1000000,
      },
    };

    jest.spyOn(service, 'fetchData' as any).mockResolvedValueOnce(countries);
    jest.spyOn(redisService, 'get').mockResolvedValueOnce(null);
    jest.spyOn(redisService, 'set').mockResolvedValueOnce(null);

    const result = await service.fetchLanguages();

    expect(result).toEqual(expectedLanguages);
    expect(logger.log).toHaveBeenCalledWith('Fetched and processed languages data');
  });

  it('should return cached data if available', async () => {
    const cachedData = {
      en: {
        countries: [
          { name: 'Country1', population: 1000000 },
          { name: 'Country2', population: 500000 },
        ],
        totalSpeakers: 1500000,
      },
      es: {
        countries: [{ name: 'Country1', population: 1000000 }],
        totalSpeakers: 1000000,
      },
    };
    jest.spyOn(redisService, 'get').mockResolvedValueOnce(JSON.stringify(cachedData));

    const result = await service.fetchLanguages();

    expect(result).toEqual(cachedData);
    expect(logger.log).toHaveBeenCalledWith('Cache hit for key: languages');
  });

  it('should not log out in the test', async () => {
    jest.spyOn(service, 'fetchData' as any).mockResolvedValueOnce([]);
    jest.spyOn(redisService, 'get').mockResolvedValueOnce(null);
    jest.spyOn(redisService, 'set').mockResolvedValueOnce(null);
    const originalLog = console.log;
    console.log = jest.fn();

    await service.fetchLanguages();

    expect(console.log).not.toHaveBeenCalled();
    console.log = originalLog; 
  });
});

describe('fetchStatistics', () => {
  it('should fetch and process statistics data successfully', async () => {
    const countries = [
      {
        name: { common: 'Country1' },
        population: 1000000,
        area: 50000,
        languages: { en: 'English', es: 'Spanish' },
      },
      {
        name: { common: 'Country2' },
        population: 500000,
        area: 100000,
        languages: { en: 'English' },
      },
      {
        name: { common: 'Country3' },
        population: 2000000,
        area: 75000,
        languages: { fr: 'French' },
      },
    ];
    const expectedStatistics = {
      totalCountries: 3,
      largestCountry: countries[1],
      smallestCountry: countries[1],
      mostSpokenLanguage: {
        language: 'fr',
        speakers: 2000000,
      },
    };

    jest.spyOn(service, 'fetchData' as any).mockResolvedValueOnce(countries);
    jest.spyOn(redisService, 'get').mockResolvedValueOnce(null);
    jest.spyOn(redisService, 'set').mockResolvedValueOnce(null);

    const result = await service.fetchStatistics();

    expect(result).toEqual(expectedStatistics);
    expect(logger.log).toHaveBeenCalledWith('Fetched and processed statistics data');
  });

  it('should return cached data if available', async () => {
    const cachedData = {
      totalCountries: 3,
      largestCountry: {
        name: { common: 'Country2' },
        population: 500000,
        area: 100000,
        languages: { en: 'English' },
      },
      smallestCountry: {
        name: { common: 'Country2' },
        population: 500000,
        area: 100000,
        languages: { en: 'English' },
      },
      mostSpokenLanguage: {
        language: 'en',
        speakers: 1500000,
      },
    };
    jest.spyOn(redisService, 'get').mockResolvedValueOnce(JSON.stringify(cachedData));

    const result = await service.fetchStatistics();

    expect(result).toEqual(cachedData);
    expect(logger.log).toHaveBeenCalledWith('Cache hit for key: statistics');
  });


  it('should not log out in the test', async () => {
    jest.spyOn(service, 'fetchData' as any).mockResolvedValueOnce([]);
    jest.spyOn(redisService, 'get').mockResolvedValueOnce(null);
    jest.spyOn(redisService, 'set').mockResolvedValueOnce(null);
    const originalLog = console.log;
    console.log = jest.fn();

    await service.fetchStatistics();

    expect(console.log).not.toHaveBeenCalled();
    console.log = originalLog; 
  });
});
});