import { Injectable } from '@nestjs/common';
import { CustomLogger } from '../customLogger/custom_logger.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class CacheService {
  constructor(
    private readonly logger: CustomLogger,
    private readonly redisService: RedisService,
  ){}

  public async getCachedData(
    cacheKey: string,
    fetchFunction: () => Promise<any>,
  ): Promise<any> {
    const cachedData = await this.redisService.get(cacheKey);
    if (cachedData) {
      this.logger.log(`Cache hit for key: ${cacheKey}`);
      return JSON.parse(cachedData);
    }
    this.logger.log(`Cache miss for key: ${cacheKey}`);
    const data = await fetchFunction();
    await this.redisService.set(cacheKey, JSON.stringify(data), 3600); 
    return data;
  }

  public generateCacheKey(prefix: string, params?: any): string {
    const paramsString = params ? `_${JSON.stringify(params)}` : '';
    return `${prefix}${paramsString}`;
  }
}
