import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeDto } from './dto/employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { UserRoles } from '../auth/decorators/role.decorator';
import { Roles } from '../utils/enums.utils';
import { RolesGuard } from '../auth/guard/roles.guard';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { CreatePasswordDto } from './dto/create-password.dto';
import { LoginDto } from './dto/login.dto';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @UserRoles(Roles.EMPLOYER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() employeeDto: EmployeeDto, @AuthUser() authUser: any) {
    return this.employeeService.create(employeeDto, authUser);
  }

  @Post('create-password')
  createPassword(@Body() createPasswordDto: CreatePasswordDto) {
    return this.employeeService.createPassword(createPasswordDto);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() loginDto: LoginDto) {
    return this.employeeService.login(loginDto);
  }

  @UserRoles(Roles.EMPLOYER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@AuthUser() authUser: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.employeeService.findAll(authUser, page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @UserRoles(Roles.EMPLOYER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(id);
  }
}
