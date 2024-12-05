import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { Model } from 'mongoose';
import { EmployeeDto } from './dto/employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { User } from '../user/schema/user.schema';
import { Employee } from './schema/employee.schema';
@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name) private readonly employeeModel: Model<Employee>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ){}

  async create(employeeDto: EmployeeDto, authUser: any) {
    const existingEmployee = await this.employeeModel.findOne({
      emailAddress: employeeDto.emailAddress,
    });

    if (existingEmployee) {
      throw new ConflictException('Email address already exists');
    }

    const company = await this.userModel.findOne({ companyId: authUser.companyId });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

    if (new Date(employeeDto.dateOfBirth) > eighteenYearsAgo) {
      throw new BadRequestException('Employee must be at least 18 years old');
    }

    const employmentStartDate = new Date(employeeDto.employmentStartDate);
    const currentDate = new Date();

    if (employmentStartDate > currentDate) {
      throw new BadRequestException('Enter a valid employment start date');
    }

    return await this.employeeModel.create({ ...employeeDto, companyId: authUser.companyId });
  }

  async findAll(authUser: any, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [results, totalItems] = await Promise.all([
      this.employeeModel.find({ companyId: authUser.companyId }).skip(skip).limit(limit),
      this.employeeModel.countDocuments(),
    ]);

    return {
      results,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    };
  }

  async findOne(id: string) {
    const employee = await this.employeeModel.findById(id);

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.employeeModel.findById(id);

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return await this.employeeModel.findByIdAndUpdate(id, updateEmployeeDto, {
      new: true,
    });
  }

  async remove(id: string) {
    return await this.employeeModel.findByIdAndDelete(id);
  }
}
