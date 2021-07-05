import { writeFileSync } from 'fs';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

require('pkginfo')(module);

async function bootstrap() {
  const { name, version, description } = module.exports;
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle(name)
    .setDescription(description)
    .setVersion(version)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  writeFileSync('./dist/spec.json', JSON.stringify(document));
  await app.close();
}

bootstrap();
