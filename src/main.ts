import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import * as helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: true });
  app.useLogger(app.get(Logger));
  app.use(helmet());
  app.use(compression());
  app.enableCors();

  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('port') || 3000);
}

bootstrap();
