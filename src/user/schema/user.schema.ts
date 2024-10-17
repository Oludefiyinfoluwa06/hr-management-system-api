import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Roles } from '../../utils/enums.utils';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  companyName: string;

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  role: Roles;

  @Prop({ required: true })
  companyId: string;

  @Prop({ default: null })
  otp: number;

  @Prop({ default: null })
  otpExpires: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
