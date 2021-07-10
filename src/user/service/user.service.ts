import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { NotFoundError, UniqueError } from '~/common/error';
import { CreateUserDto, CreateUserResponse, GetUserListResponse } from '../dto';
import { CreateUserQuery, User, UserDocument } from '../schema/user.schema';
import { PASSWORD_SALT_ROUNDS } from '../user.constant';
import { DUPLICATED_USER, NOT_FOUND_USER } from '../user.message';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectPinoLogger(UserService.name) private readonly logger: PinoLogger
  ) {}

  async encryptPassword(password: string): Promise<string> {
    return bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
  }

  async create(dto: CreateUserDto): Promise<CreateUserResponse> {
    await this.existsUser(dto.email);
    const encPassword = await this.encryptPassword(dto.password);
    const user = await this.userModel.create<CreateUserQuery>({
      name: dto.name,
      email: dto.email,
      password: encPassword,
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

  async findById(_id: string) {
    const user = await this.userModel.findOne({ _id }).lean().exec();
    if (!user) {
      throw new NotFoundError(NOT_FOUND_USER);
    }

    return user;
  }

  async findByEmail(
    email: string,
    selectFields: { [key in keyof User]?: 0 | 1 } = {}
  ) {
    const user = await this.userModel
      .findOne({
        email,
      })
      .select(selectFields)
      .lean()
      .exec();

    if (!user) {
      throw new NotFoundError(NOT_FOUND_USER);
    }

    return user;
  }

  async existsUser(email: string): Promise<void> {
    const user = await this.userModel
      .findOne({ email })
      .select({ _id: 1 })
      .read('primary')
      .lean()
      .exec();

    if (user) {
      throw new UniqueError(DUPLICATED_USER);
    }
  }
}
