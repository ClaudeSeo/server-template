import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, Model } from 'mongoose';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';
import { CreateUserDto, CreateUserResponse, GetUserListResponse } from './dto';
import { User, UserDocument, CreateUser } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectPinoLogger(UserService.name) private readonly logger: PinoLogger
  ) {}

  async create(dto: CreateUserDto): Promise<CreateUserResponse> {
    const user = await this.userModel.create<CreateUser>({
      ...dto,
    });

    return {
      _id: user._id.toString(),
    };
  }

  async findAll(): Promise<GetUserListResponse> {
    const items = await this.userModel
      .find()
      .select({
        _id: 1,
        name: 1,
        email: 1,
      })
      .lean()
      .exec();

    return {
      items: items.map(user => {
        return {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      }),
    };
  }

  async find(_id: string | Types.ObjectId) {
    return this.userModel
      .findOne({
        _id,
      })
      .lean()
      .exec();
  }
}
