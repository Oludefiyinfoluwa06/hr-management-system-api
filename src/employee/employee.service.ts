import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { Model } from 'mongoose';
import * as CryptoJS from 'crypto-js';
import * as bcrypt from 'bcryptjs';
import { EmployeeDto } from './dto/employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { User } from '../user/schema/user.schema';
import { Employee } from './schema/employee.schema';
import { CreatePasswordDto } from './dto/create-password.dto';
import { LoginDto } from './dto/login.dto';
@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name) private readonly employeeModel: Model<Employee>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private jwtService: JwtService,
    private readonly mailService: MailerService,
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

    const secretKey = process.env.CRYPTO_SECRET_KEY;

    const encryptedEmail = await CryptoJS.AES.encrypt(
      employeeDto.emailAddress,
      secretKey,
    ).toString();
    const encryptedCompanyId = await CryptoJS.AES.encrypt(
      authUser.companyId,
      secretKey,
    ).toString();

    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invitation Email</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
        </head>
        <body style="margin: 0; padding: 0; font-family: "Raleway", sans-serif; background-color: #f4f4f4;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff;">
            <tr>
              <td align="center" style="padding: 20px 10px; background-color: #2C3E50;">
                <h2 style="color: #ffffff; margin: 0;">Invitation from ${company.companyName} by ${company.userName}</h2>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px; color: #333333;">
                <h2 style="margin-top: 0;">Hello, ${employeeDto.firstName}</h2>
                <p style="font-size: 16px; line-height: 1.5;">We are happy to have you onboard. This is invitation for you to be a part of this company as an employee</p>
                <p style="font-size: 16px; line-height: 1.5;">Please register by clicking the button below:</p>
                <p style="text-align: center; margin: 30px 0;">
                  <a href='${process.env.CLIENT_URL}/employee/create-password?email=${encodeURIComponent(encryptedEmail)}&companyId=${encodeURIComponent(encryptedCompanyId)}' style="background-color: #2C3E50; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Register now</a>
                </p>
                <p style="font-size: 16px; line-height: 1.5; text-align: center;">Please ignore this email if you didn't request to be registered</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px; background-color: #f4f4f4; text-align: center; font-size: 14px; color: #888888;">
                <p style="margin: 0;">&copy; ${new Date().getFullYear()} HR Management System. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    this.mailService.sendMail({
      from: 'HR Management System <hrmanagementsystem@gmail.com>',
      to: employeeDto.emailAddress,
      subject: 'Invitation to register on HR Management System',
      html,
    });

    return await this.employeeModel.create({ ...employeeDto, companyId: authUser.companyId });
  }

  async createPassword(createPasswordDto: CreatePasswordDto) {
    const secretKey = process.env.CRYPTO_SECRET_KEY;

    const decodedEmail = decodeURIComponent(createPasswordDto.email);
    const decodedCompanyId = decodeURIComponent(createPasswordDto.companyId);

    const decryptedEmail = await CryptoJS.AES.decrypt(
      decodedEmail,
      secretKey,
    ).toString(CryptoJS.enc.Utf8);

    const decryptedCompanyId = await CryptoJS.AES.decrypt(
      decodedCompanyId,
      secretKey,
    ).toString(CryptoJS.enc.Utf8);

    const employee = await this.employeeModel.findOne({
      emailAddress: decryptedEmail,
      companyId: decryptedCompanyId,
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const hashedPassword = await bcrypt.hash(createPasswordDto.password, 10);

    return await this.employeeModel.findByIdAndUpdate(
      employee._id,
      { password: hashedPassword },
      {
        new: true,
      },
    );
  }

  async login(loginDto: LoginDto) {
    const employee = await this.employeeModel.findOne({
      emailAddress: loginDto.email,
    });

    if (!employee) {
      throw new UnauthorizedException('Email does not exist');
    }

    if (!employee.password) {
      throw new BadRequestException(
        'Check your email to create a password with link provided',
      );
    }

    const isPasswordMatch = await bcrypt.compare(
      loginDto.password,
      employee.password,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Incorrect password');
    }

    const { password, ...employeeWithoutPassword } = employee.toObject();

    const token = this.jwtService.sign({ id: employee._id });
    return {
      employee: employeeWithoutPassword,
      token,
    };
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
