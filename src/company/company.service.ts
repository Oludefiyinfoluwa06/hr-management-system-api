import { Injectable, NotFoundException } from '@nestjs/common';
import { Company } from './schema/company.schema';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from '../user/user.service';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
    private userService: UserService,
  ) {}

  async create(authUser: any, createCompanyDto: CreateCompanyDto) {
    const user = await this.userService.findUserById(authUser.userId);

    return await this.companyModel.create({
      companyId: user.companyId,
      ...createCompanyDto,
    });
  }

  async findOne(authUser: any) {
    const user = await this.userService.findUserById(authUser.userId);

    const company = await this.companyModel.findOne({ companyId: user.companyId });

    return company;
  }

  async update(authUser: any, updateCompanyDto: UpdateCompanyDto) {
    const user = await this.userService.findUserById(authUser.userId);

    const company = await this.companyModel.findOneAndUpdate(
      { companyId: user.companyId },
      updateCompanyDto,
      { new: true }
    );

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  async remove(authUser: any) {
    const user = await this.userService.findUserById(authUser.userId);

    const company = await this.companyModel.findOneAndDelete({ companyId: user.companyId });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }
}
