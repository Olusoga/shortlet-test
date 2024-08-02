import { Provider } from '@nestjs/common';
import axios from 'axios';

export const AXIOS_INSTANCE_TOKEN = 'AXIOS_INSTANCE_TOKEN';

export const axiosProvider: Provider = {
  provide: AXIOS_INSTANCE_TOKEN,
  useValue: axios.create({
    baseURL: 'https://restcountries.com/v3.1',
  }),
};
