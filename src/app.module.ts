import { ValidationPipe, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { omit } from 'lodash';
import { LoggerModule } from 'nestjs-pino';
import { exceptionFactory } from '~/common/error';
import { HttpExceptionFilter } from '~/common/filter/http-exception.filter';
import { AuthModule } from './auth/auth.module';
import configuration from './config/environment';
import { ENV } from './config/environment.constant';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        pinoHttp: {
          prettyPrint: config.get('env') === ENV.DEVELOPMENT,
          serializers: {
            req(req) {
              return {
                ...req,
                body: omit(req.raw.body, ['password']),
              };
            },
          },
        },
      }),
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
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
