import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, format, transports, addColors } from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as fs from 'fs';
import * as path from 'path';

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    verbose: 5,
    debug: 6,
    silly: 7,
  },
  colors: {
    fatal: 'magenta',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'cyan',
    verbose: 'blue',
    debug: 'blue',
    silly: 'magenta',
  },
};

addColors(customLevels.colors);

const logDir = path.join(__dirname, '..', '..', 'logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const winstonLogger = createLogger({
  levels: customLevels.levels,
  level: 'silly',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.printf(({ timestamp, level, message, ...meta }) => {
      let logMessage = `${timestamp} [${level}] ${message}`;
      if (meta.stack) {
        logMessage += `\n${meta.stack}`;
      }
      return logMessage;
    }),
    format.colorize({ all: true }),
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        nestWinstonModuleUtilities.format.nestLike(),
      ),
    }),
    new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    new transports.File({ filename: path.join(logDir, 'combined.log') }),
  ],
});

@Injectable()
export class CustomLogger implements LoggerService {
  private readonly logger = winstonLogger;

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace: string) {
    this.logger.error(message, { trace });
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}
