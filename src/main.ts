import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLogger } from './customLogger/custom_logger.service';
import helmet from 'helmet';


async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(helmet());
  app.enableCors({
    origin: '*',
    methods: 'GET',
    credentials: true,
  });

  const customLogger = app.get(CustomLogger);
  app.useLogger(customLogger)
  await app.listen(3000);
}
bootstrap();
