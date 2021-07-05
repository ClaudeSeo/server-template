import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import * as helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.use(helmet());
  app.use(compression());
  app.enableCors();
  await app.listen(configService.get<number>('port') || 3000);
}

bootstrap();
