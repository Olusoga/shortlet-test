import { Module } from '@nestjs/common';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';
import { HttpService } from '@nestjs/axios';
import { AxiosModule } from '../../common/axios/axios.module';
import { RedisService } from 'src/modules/redis/redis.service';
import { CustomLoggerModule } from 'src/modules/customLogger/custom_logger.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheService } from '../utils/cache_utils';
import { UtilsCacheModule } from 'src/modules/utils/cache_utils.module';


@Module({
  imports: [AxiosModule,UtilsCacheModule, CustomLoggerModule, ConfigModule],
  providers: [CountriesService,CacheService, ConfigService, HttpService, RedisService],
  controllers: [CountriesController],
})
export class CountriesModule {}
