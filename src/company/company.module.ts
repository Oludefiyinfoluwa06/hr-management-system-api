import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { Company, CompanySchema } from './schema/company.schema';
import { User, UserSchema } from '../user/schema/user.schema';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: Company.name, schema: CompanySchema },
    ])
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
