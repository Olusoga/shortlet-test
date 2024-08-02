// axios.module.ts
import { Module } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

export const AXIOS_INSTANCE_TOKEN = 'AXIOS_INSTANCE_TOKEN';

@Module({
  providers: [
    {
      provide: AXIOS_INSTANCE_TOKEN,
      useValue: axios.create({
        baseURL: 'https://restcountries.com/v3.1',
      }),
    },
  ],
  exports: [AXIOS_INSTANCE_TOKEN],
})
export class AxiosModule {}
