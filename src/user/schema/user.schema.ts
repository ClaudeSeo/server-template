import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CreateDocument } from '~/types';

@Schema({
  timestamps: true,
  read: 'secondaryPreferred',
})
export class User {
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
export type CreateUser = CreateDocument<User, 'createdAt' | 'updatedAt'>;
export const UserSchema = SchemaFactory.createForClass(User);
