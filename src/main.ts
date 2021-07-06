import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.useLogger(app.get(Logger));
  app.enableCors();
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('port') || 3000);
}

bootstrap();
