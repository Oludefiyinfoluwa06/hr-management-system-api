import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Company extends Document {
  @Prop()
  name: string;

  @Prop({ required: true })
  companyId: string;

  @Prop()
  industry: string;

  @Prop()
  founded: string;

  @Prop()
  size: string;

  @Prop()
  location: string;

  @Prop()
  website: string;

  @Prop()
  description: string;

  @Prop()
  mission: string;

  @Prop({ default: null })
  logoUrl: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
