import { Module } from '@nestjs/common';
import { CachService } from './cache_utils';
import { CustomLoggerModule } from '../customLogger/custom_logger.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [CustomLoggerModule, RedisModule],
  providers: [CachService],
  exports: [CachService],
})
export class UtilsCacheModule {}
