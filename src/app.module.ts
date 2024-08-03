import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
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
import { RedisService } from './redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { CachService } from './utils/cache_utils';
import { UtilsCacheModule } from './utils/cach_utils.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
    UtilsCacheModule,
    CustomLoggerModule,
    AxiosModule,
    RateLimitingModule,
    ConfigModule,
    CountriesModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    RedisService,
    CachService,
    ConfigService,
    CountriesService,
    HttpService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
