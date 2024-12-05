import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@AuthUser() authUser: any, @Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(authUser, createCompanyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findOne(@AuthUser() authUser: any) {
    return this.companyService.findOne(authUser);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  update(
    @AuthUser() authUser: any,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companyService.update(authUser, updateCompanyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  remove(@AuthUser() authUser: any) {
    return this.companyService.remove(authUser);
  }
}
