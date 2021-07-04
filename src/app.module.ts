import { ValidationPipe, Module } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpExceptionFilter } from '~/filter/http-exception.filter';
import { exceptionFactory } from '~/component/error';
import configuration from '~/config/environment';
import { DATABASE_CONNECTION_NAME } from '~/config/environment.constant';
import { UsersModule } from '~/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      connectionName: DATABASE_CONNECTION_NAME.MAIN,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('mainDatabase'),
      }),
    }),
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
