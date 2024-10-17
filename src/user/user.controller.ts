import { Controller } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  async findUserByEmail(email: string) {
    return await this.userService.findUserByEmail(email);
  }

  async findUserById(id: string) {
    return await this.userService.findUserById(id);
  }
}
