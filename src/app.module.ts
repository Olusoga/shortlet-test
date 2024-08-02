import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './utils/logging';
import { CustomLoggerModule } from './customLogger/custom_logger.module';

import { RateLimitingModule } from './security/rate-limiting/rate-limiting.module';
import { ConfigModule } from './config/config.module';
import { CountriesService } from './countries/countries.service';
import { CountriesModule } from './countries/countries.module';
import { HttpModule, HttpService } from '@nestjs/axios';
import { AxiosModule } from './common/axios/axios.module';

@Module({
  imports: [
    CustomLoggerModule,
    AxiosModule,
    RateLimitingModule,
    ConfigModule,
    CountriesModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService, CountriesService, HttpService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
