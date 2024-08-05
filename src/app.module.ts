import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './modules/utils/logging';
import { CustomLoggerModule } from './modules/customLogger/custom_logger.module';
import { RateLimitingModule } from './security/rate-limiting/rate-limiting.module';
import { ConfigModule } from './config/config.module';
import { CountriesService } from './modules/countries/countries.service';
import { CountriesModule } from './modules/countries/countries.module';
import { HttpModule, HttpService } from '@nestjs/axios';
import { AxiosModule } from './common/axios/axios.module';
import { RedisService } from './modules/redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { CacheService } from './modules/utils/cache_utils';
import { UtilsCacheModule } from './modules/utils/cache_utils.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [PrometheusModule.register(),
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
    CacheService,
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
