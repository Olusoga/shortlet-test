import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './utils/logging';
import { CustomLoggerModule } from './customLogger/custom_logger.module';

import { RateLimitingModule } from './security/rate-limiting/rate-limiting.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [CustomLoggerModule,RateLimitingModule, ConfigModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
