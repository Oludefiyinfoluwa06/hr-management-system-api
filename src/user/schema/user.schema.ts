import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Roles } from '../../utils/enums.utils';

@Schema()
export class User extends Document {
  @Prop({ default: null })
  companyName: string;

  @Prop()
  userName: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  role: Roles;

  @Prop({ default: null })
  companyId: string;

  @Prop({ default: null })
  otp: number;

  @Prop({ default: null })
  otpExpires: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
