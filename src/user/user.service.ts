import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/user-create.dto';
import { User, UserDocument, CreateUser } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  async create(dto: CreateUserDto): Promise<{ _id: string }> {
    const user = await this.userModel.create<CreateUser>({
      ...dto,
    });

    return {
      _id: user._id.toString(),
    };
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().lean().exec();
  }
}
