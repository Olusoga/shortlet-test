import { Injectable, Inject,  } from '@nestjs/common';
import { Cache,  } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async set(key: string, value: string, ttl: number) {
    await this.cacheManager.set(key, value, ttl);
  }

  async get(key: string): Promise<string> {
    return await this.cacheManager.get(key);
  }

  async del(key: string) {
    await this.cacheManager.del(key);
  }
}
