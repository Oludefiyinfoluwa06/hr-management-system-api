import { Injectable } from '@nestjs/common';
import { EmployeeDto } from './dto/employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  create(employeeDto: EmployeeDto) {
    return 'This action adds a new employee';
  }

  findAll() {
    return `This action returns all employee`;
  }

  findOne(id: string) {
    return `This action returns a ${id} employee`;
  }

  update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a ${id} employee`;
  }

  remove(id: string) {
    return `This action removes a ${id} employee`;
  }
}
