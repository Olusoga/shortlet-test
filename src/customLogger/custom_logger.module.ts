import { Module } from '@nestjs/common';
import { CustomLogger } from './custom_logger.service';

@Module({
  providers: [CustomLogger],
  exports: [CustomLogger],
})
export class CustomLoggerModule {}

