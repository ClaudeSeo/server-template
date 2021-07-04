import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CreateDocument } from '~/types';

@Schema({
  timestamps: true,
  read: 'secondaryPreferred',
})
export class User {
  @Prop()
  _id: Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export type UserDocument = User & Document;
export type CreateUser = CreateDocument<
  User,
  '_id' | 'createdAt' | 'updatedAt'
>;

export const UserSchema = SchemaFactory.createForClass(User);
