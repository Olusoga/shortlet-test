import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis

  onModuleInit() {
    const redisHost = process.env.REDIS_HOST || '127.0.0.1';
    const redisPort = parseInt(process.env.REDIS_PORT, 10) || 6379;
    const redisPassword = process.env.REDIS_PASSWORD || ''

    this.client = new Redis({
      host: redisHost,
      port: redisPort,
      password: redisPassword,
    });

    this.client.on('error', (error) => {
      console.error('[ioredis] Unhandled error event:', error);
    });
  }

  onModuleDestroy() {
    this.client.quit();
  }

  async set(key: string, value: string, duration: number) {
    await this.client.set(key, value, 'EX', duration);
  }

  async get(key: string): Promise<string> {
    return await this.client.get(key);
  }

  async del(key: string) {
    await this.client.del(key);
  }
}
