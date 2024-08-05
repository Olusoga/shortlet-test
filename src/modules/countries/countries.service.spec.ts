import { Test, TestingModule } from '@nestjs/testing';
import { AxiosInstance } from 'axios';
import { AXIOS_INSTANCE_TOKEN } from '../../common/axios/axios.provider';
import { CountriesService } from '../../modules/countries/countries.service';
import { CountryDetailsDto } from '../../modules/countries/dto/country-details.dto';
import { CountryQueryDto } from '../../modules/countries/dto/country-query.dto';
import { CustomLogger } from '../../modules/customLogger/custom_logger.service';
import { RedisService } from '../../modules/redis/redis.service';
import { CacheService } from '../../modules/utils/cache_utils';


describe('CountriesService', () => {
  let service: CountriesService;
  let logger: CustomLogger;
  let redisService: RedisService;
  let cacheService: CacheService;
  let http: AxiosInstance;

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
          provide: CacheService,
          useValue: {
            getCachedData: jest.fn(),
            generateCacheKey: jest.fn(),
          },
        },
        {
          provide: AXIOS_INSTANCE_TOKEN,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CountriesService>(CountriesService);
    logger = module.get<CustomLogger>(CustomLogger);
    redisService = module.get<RedisService>(RedisService);
    cacheService = module.get<CacheService>(CacheService);
    http = module.get<AxiosInstance>(AXIOS_INSTANCE_TOKEN);
  });

  describe('fetchAllCountries', () => {
    it('should return cached data if available', async () => {
      const query: CountryQueryDto = { region: 'Asia', sortBy: 'name', page: 1, limit: 10 };
      const cacheKey = 'countries_' + JSON.stringify(query);
      const cachedData = {
        total: 1,
        page: 1,
        limit: 10,
        data: [{ name: 'Country1', population: 1000000 }],
      };

      jest.spyOn(cacheService, 'generateCacheKey').mockReturnValue(cacheKey);
      jest.spyOn(cacheService, 'getCachedData').mockResolvedValueOnce(cachedData);

      const result = await service.fetchAllCountries(query);

      expect(result).toEqual(cachedData);
      expect(cacheService.generateCacheKey).toHaveBeenCalledWith('countries', query);
      expect(cacheService.getCachedData).toHaveBeenCalledWith(cacheKey, expect.any(Function));
    });

    it('should fetch and process data if not cached', async () => {
      const query: CountryQueryDto = { region: 'Asia', sortBy: 'name', page: 1, limit: 10 };
      const cacheKey = 'countries_' + JSON.stringify(query);
      const countriesData = [{ name: { common: 'Country1' }, region: 'Asia', population: 1000000 }];

      jest.spyOn(cacheService, 'generateCacheKey').mockReturnValue(cacheKey);
      jest.spyOn(cacheService, 'getCachedData').mockImplementation(async (_, fetchFunction) => {
        return await fetchFunction();
      });
      jest.spyOn(http, 'get').mockResolvedValue({ data: countriesData });

      const result = await service.fetchAllCountries(query);

      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.data[0].name.common).toBe('Country1');
    });
  });

  describe('getCountryByName', () => {
    it('should return cached data if available', async () => {
      const name = 'country1';
      const cacheKey = 'country_' + JSON.stringify({ name });
      const cachedData: CountryDetailsDto = {
        name: 'Country1',
        population: 1000000,
        area: 50000,
        languages: 'English',
        borders: ['Border1', 'Border2'],
      };

      jest.spyOn(cacheService, 'generateCacheKey').mockReturnValue(cacheKey);
      jest.spyOn(cacheService, 'getCachedData').mockResolvedValueOnce(cachedData);

      const result = await service.getCountryByName(name);

      expect(result).toEqual(cachedData);
      expect(cacheService.generateCacheKey).toHaveBeenCalledWith('country', { name });
      expect(cacheService.getCachedData).toHaveBeenCalledWith(cacheKey, expect.any(Function));
    });

    it('should fetch and return country details if not cached', async () => {
      const name = 'country1';
      const cacheKey = 'country_' + JSON.stringify({ name });
      const countriesData = [{ name: { common: 'Country1' }, population: 1000000, area: 50000, languages: { en: 'English' }, borders: ['Border1', 'Border2'] }];

      jest.spyOn(cacheService, 'generateCacheKey').mockReturnValue(cacheKey);
      jest.spyOn(cacheService, 'getCachedData').mockImplementation(async (_, fetchFunction) => {
        return await fetchFunction();
      });
      jest.spyOn(http, 'get').mockResolvedValue({ data: countriesData });

      const result = await service.getCountryByName(name);

      expect(result.name).toBe('Country1');
      expect(result.population).toBe(1000000);
      expect(result.area).toBe(50000);
      expect(result.languages).toBe('English');
      expect(result.borders).toEqual(['Border1', 'Border2']);
    });
  });

  describe('fetchRegions', () => {
    it('should return cached data if available', async () => {
      const cacheKey = 'regions';
      const cachedData = { Africa: { countries: [], totalPopulation: 0 } };

      jest.spyOn(cacheService, 'generateCacheKey').mockReturnValue(cacheKey);
      jest.spyOn(cacheService, 'getCachedData').mockResolvedValueOnce(cachedData);

      const result = await service.fetchRegions();

      expect(result).toEqual(cachedData);
      expect(cacheService.generateCacheKey).toHaveBeenCalledWith('regions');
      expect(cacheService.getCachedData).toHaveBeenCalledWith(cacheKey, expect.any(Function));
    });

    it('should fetch and return regions data if not cached', async () => {
      const cacheKey = 'regions';
      const countriesData = [{ name: { common: 'Country1' }, region: 'Asia', population: 1000000, languages: { en: 'English' } }];

      jest.spyOn(cacheService, 'generateCacheKey').mockReturnValue(cacheKey);
      jest.spyOn(cacheService, 'getCachedData').mockImplementation(async (_, fetchFunction) => {
        return await fetchFunction();
      });
      jest.spyOn(service, 'fetchCountriesByRegion').mockResolvedValue(countriesData);

      const result = await service.fetchRegions();

      expect(result.Asia).toBeDefined();
      expect(result.Asia.totalPopulation).toBe(1000000);
    });
  });

  describe('fetchLanguages', () => {
    it('should return cached data if available', async () => {
      const cacheKey = 'languages';
      const cachedData = { English: { countries: [], totalSpeakers: 0 } };

      jest.spyOn(cacheService, 'generateCacheKey').mockReturnValue(cacheKey);
      jest.spyOn(cacheService, 'getCachedData').mockResolvedValueOnce(cachedData);

      const result = await service.fetchLanguages();

      expect(result).toEqual(cachedData);
      expect(cacheService.generateCacheKey).toHaveBeenCalledWith('languages');
      expect(cacheService.getCachedData).toHaveBeenCalledWith(cacheKey, expect.any(Function));
    });

    it('should fetch and return languages data if not cached', async () => {
      const cacheKey = 'languages';
      const countriesData = [
        { name: { common: 'Country1' }, population: 1000000, languages: { en: 'English' } },
        { name: { common: 'Country2' }, population: 500000, languages: { en: 'English' } },
      ];
    
      jest.spyOn(cacheService, 'generateCacheKey').mockReturnValue(cacheKey);
      jest.spyOn(cacheService, 'getCachedData').mockImplementation(async (_, fetchFunction) => {
        return await fetchFunction();
      });
      jest.spyOn(http, 'get').mockResolvedValue({ data: countriesData });
    
      const result = await service.fetchLanguages(); 
      expect(result.en).toBeDefined();
      expect(result.en.totalSpeakers).toBe(1500000);
    });
  });

  describe('fetchStatistics', () => {
    it('should return cached data if available', async () => {
      const cacheKey = 'statistics';
      const cachedData = {
        totalCountries: 1,
        largestCountry: { name: { common: 'Country1' }, area: 50000 },
        smallestCountry: { name: { common: 'Country1' }, population: 1000000 },
        mostSpokenLanguage: { language: 'English', speakers: 1000000 },
      };

      jest.spyOn(cacheService, 'generateCacheKey').mockReturnValue(cacheKey);
      jest.spyOn(cacheService, 'getCachedData').mockResolvedValueOnce(cachedData);

      const result = await service.fetchStatistics();

      expect(result).toEqual(cachedData);
      expect(cacheService.generateCacheKey).toHaveBeenCalledWith('statistics');
      expect(cacheService.getCachedData).toHaveBeenCalledWith(cacheKey, expect.any(Function));
    });

    it('should fetch and return statistics data if not cached', async () => {
      const cacheKey = 'statistics';
      const countriesData = [{ name: { common: 'Country1' }, population: 1000000, area: 50000, languages: { en: 'English' } }];

      jest.spyOn(cacheService, 'generateCacheKey').mockReturnValue(cacheKey);
      jest.spyOn(cacheService, 'getCachedData').mockImplementation(async (_, fetchFunction) => {
        return await fetchFunction();
      });
      jest.spyOn(http, 'get').mockResolvedValue({ data: countriesData });

      const result = await service.fetchStatistics();

      expect(result.totalCountries).toBe(1);
      expect(result.largestCountry.name.common).toBe('Country1');
      expect(result.mostSpokenLanguage.language).toBe('en');
    });
  });
});
