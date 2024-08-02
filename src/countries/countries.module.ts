import { Module } from '@nestjs/common';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';
import { HttpService } from '@nestjs/axios';
import { AxiosModule } from '../common/axios/axios.module';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [AxiosModule],
  providers: [CountriesService, HttpService, RedisService],
  controllers: [CountriesController],
})
export class CountriesModule {}
