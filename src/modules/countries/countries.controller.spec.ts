import { TestingModule, Test } from "@nestjs/testing";
import { CountriesController } from "../../modules/countries/countries.controller";
import { CountriesService } from "../../modules/countries/countries.service";
import { CountryDetailsDto } from "../../modules/countries/dto/country-details.dto";
import { CustomLogger } from "../../modules/customLogger/custom_logger.service";
import { RedisService } from "../../modules/redis/redis.service";

describe('CountriesController', () => {
  let controller: CountriesController;
  let countriesService: CountriesService;
  let logger: CustomLogger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountriesController],
      providers: [
        {
          provide: CountriesService,
          useValue: {
            fetchAllCountries: jest.fn(),
            fetchRegions: jest.fn(),
            fetchLanguages: jest.fn(),
            fetchStatistics: jest.fn(),
            getCountryByName: jest.fn(),
          },
        },
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
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<CountriesController>(CountriesController);
    countriesService = module.get<CountriesService>(CountriesService);
    logger = module.get<CustomLogger>(CustomLogger);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCountries', () => {
    it('should return a list of countries', async () => {
      const query = { region: 'Asia', sortBy: 'name', page: 1, limit: 10 };
      const countriesData = { total: 1, page: 1, limit: 10, data: [{ name: 'Country1', region: 'Asia' }] };
      jest.spyOn(countriesService, 'fetchAllCountries').mockResolvedValueOnce(countriesData);

      const result = await controller.getCountries(query);

      expect(result).toEqual(countriesData);
      expect(countriesService.fetchAllCountries).toHaveBeenCalledWith(query);
      expect(logger.log).toHaveBeenCalledWith(`Received request for countries, ${JSON.stringify(query)}`);
      expect(logger.log).toHaveBeenCalledWith('Responding with countries data');
    });
  });

  describe('getRegions', () => {
    it('should return a list of regions', async () => {
      const regionsData = { Africa: {}, Asia: {} };
      jest.spyOn(countriesService, 'fetchRegions').mockResolvedValueOnce(regionsData);

      const result = await controller.getRegions();

      expect(result).toEqual(regionsData);
      expect(countriesService.fetchRegions).toHaveBeenCalled();
      expect(logger.log).toHaveBeenCalledWith('Received request for regions');
      expect(logger.log).toHaveBeenCalledWith('Responding with regions data');
    });
  });

  describe('getLanguages', () => {
    it('should return a list of languages', async () => {
      const languagesData = { English: { countries: [], totalSpeakers: 0 } };
      jest.spyOn(countriesService, 'fetchLanguages').mockResolvedValueOnce(languagesData);

      const result = await controller.getLanguages();

      expect(result).toEqual(languagesData);
      expect(countriesService.fetchLanguages).toHaveBeenCalled();
      expect(logger.log).toHaveBeenCalledWith('Received request for languages');
      expect(logger.log).toHaveBeenCalledWith('Responding with languages data');
    });
  });

  describe('getStatistics', () => {
    it('should return statistics about countries', async () => {
      const statisticsData = { totalCountries: 1, largestCountry: {}, smallestCountry: {}, mostSpokenLanguage: {} };
      jest.spyOn(countriesService, 'fetchStatistics').mockResolvedValueOnce(statisticsData);

      const result = await controller.getStatistics();

      expect(result).toEqual(statisticsData);
      expect(countriesService.fetchStatistics).toHaveBeenCalled();
      expect(logger.log).toHaveBeenCalledWith('Received request for statistics');
      expect(logger.log).toHaveBeenCalledWith('Responding with statistics data');
    });
  });

  describe('getCountryByName', () => {
    it('should return country details by name', async () => {
      const countryName = 'Country1';
      const countryData: CountryDetailsDto = {
        name: 'Country1',
        population: 1000000,
        area: 50000,
        languages: 'English',
        borders: ['Country2', 'Country3'],
      };
      jest.spyOn(countriesService, 'getCountryByName').mockResolvedValueOnce(countryData);

      const result = await controller.getCountryByName(countryName);

      expect(result).toEqual(countryData);
      expect(countriesService.getCountryByName).toHaveBeenCalledWith(countryName);
      expect(logger.log).toHaveBeenCalledWith(`Received request for country: ${countryName}`);
      expect(logger.log).toHaveBeenCalledWith(`Responding with data for country: ${countryName}`);
    });
  });
});