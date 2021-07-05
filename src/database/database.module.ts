import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import databaseConfiguration from '~/config/database-environment';
import { DATABASE_CONNECTION_NAME } from '~/config/environment.constant';

@Module({
  imports: [
    ConfigModule.forFeature(databaseConfiguration),
    MongooseModule.forRootAsync({
      connectionName: DATABASE_CONNECTION_NAME.MAIN,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('main'),
    }),
  ],
})
export class DatabaseModule {}
