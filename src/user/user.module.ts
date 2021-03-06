import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from '~/config/environment.constant';
import { User, UserSchema } from './schema/user.schema';
import { UserService } from './service/user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: User.name,
          schema: UserSchema,
        },
      ],
      DATABASE_CONNECTION_NAME.MAIN
    ),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
