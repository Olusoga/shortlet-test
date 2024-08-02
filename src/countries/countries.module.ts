import { Module } from '@nestjs/common';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';
import { HttpService } from '@nestjs/axios';
import { AxiosModule } from '../common/axios/axios.module';
import { RedisService } from 'src/redis/redis.service';
import { CustomLoggerModule } from 'src/customLogger/custom_logger.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [AxiosModule, CustomLoggerModule, ConfigModule],
  providers: [CountriesService, ConfigService, HttpService, RedisService],
  controllers: [CountriesController],
})
export class CountriesModule {}
