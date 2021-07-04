import { writeFileSync } from 'fs';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('server-template')
    .setDescription('Server Template')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  writeFileSync('./dist/spec.json', JSON.stringify(document));
  await app.close();
}

bootstrap();
