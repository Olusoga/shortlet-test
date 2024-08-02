import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis

  onModuleInit() {
    this.client = new Redis({
      host: 'localhost',   
      port: 6379,          
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
