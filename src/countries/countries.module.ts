import { Module } from '@nestjs/common';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';
import { HttpService } from '@nestjs/axios';
import { AxiosModule } from '../common/axios/axios.module';
import { RedisService } from 'src/redis/redis.service';
import { CustomLoggerModule } from 'src/customLogger/custom_logger.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CachService } from '../utils/cache_utils';
import { UtilsCacheModule } from 'src/utils/cach_utils.module';


@Module({
  imports: [AxiosModule,UtilsCacheModule, CustomLoggerModule, ConfigModule],
  providers: [CountriesService,CachService, ConfigService, HttpService, RedisService],
  controllers: [CountriesController],
})
export class CountriesModule {}
