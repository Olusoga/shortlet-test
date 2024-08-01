import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    this.logger.log('info', 'Hello World!'); 
    this.logger.log('fatal', 'A fatal issue occurred')
    return this.appService.getHello();
  }
  logError() {
    this.logger.error('An error occurred');
  }

  logWarning() {
    this.logger.warn('This is a warning');
  }

  logDebug() {
    this.logger.debug('Debugging info');
  }

  logVerbose() {
    this.logger.verbose('Verbose logging');
  }
}
