import { Module } from '@nestjs/common';
import { CacheModule, CacheModuleOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from 'src/modules/redis/redis.service';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync<CacheModuleOptions>({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: require('cache-manager-redis-store'),
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
        auth_pass: configService.get<string>('REDIS_PASSWORD'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
