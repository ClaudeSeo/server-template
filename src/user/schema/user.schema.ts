import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, UpdateQuery } from 'mongoose';
import { CreateDocument } from '~/types';

@Schema({
  timestamps: true,
  read: 'secondaryPreferred',
})
export class User {
  /** 유저 ID */
  _id: Types.ObjectId;

  /** 이름 */
  @Prop()
  name: string;

  /** 이메일  */
  @Prop()
  email: string;

  /** 비밀번호 */
  @Prop({
    select: false,
  })
  password: string;

  /** 수정일 */
  updatedAt: Date;

  /** 생성일 */
  createdAt: Date;
}

export type UserDocument = User & Document;
export type CreateUserQuery = CreateDocument<
  User,
  '_id' | 'createdAt' | 'updatedAt'
>;

export type UpdateUserQuery = UpdateQuery<User>;

export const UserSchema = SchemaFactory.createForClass(User);
