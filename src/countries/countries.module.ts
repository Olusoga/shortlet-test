import { Module } from '@nestjs/common';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';
import { HttpService } from '@nestjs/axios';
import { AxiosModule, } from '../common/axios/axios.module';

@Module({
  imports : [AxiosModule],
  providers : [ CountriesService, HttpService],
  controllers: [CountriesController],
 
})
export class CountriesModule {}
