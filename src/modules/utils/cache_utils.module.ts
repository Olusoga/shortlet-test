import { Module } from '@nestjs/common';
import { CustomLoggerModule } from '../customLogger/custom_logger.module';
import { RedisModule } from '../redis/redis.module';
import { CacheService } from './cache_utils';

@Module({
  imports: [CustomLoggerModule, RedisModule],
  providers: [CacheService],
  exports: [CacheService],
})
export class UtilsCacheModule {}
