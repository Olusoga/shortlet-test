import { Module } from '@nestjs/common';
import { axiosProvider } from './axios.provider';

@Module({
  providers: [axiosProvider],
  exports: [axiosProvider],
})
export class AxiosModule {}
