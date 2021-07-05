import { ValidationPipe, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { exceptionFactory } from '~/common/error';
import { HttpExceptionFilter } from '~/common/filter/http-exception.filter';
import configuration from '~/config/environment';
import { UsersModule } from '~/user/user.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    DatabaseModule,
    UsersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useFactory: () => {
        return new ValidationPipe({
          exceptionFactory,
          whitelist: true,
        });
      },
    },
  ],
})
export class AppModule {}
