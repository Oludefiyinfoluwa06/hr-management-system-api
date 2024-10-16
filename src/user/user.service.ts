import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from './schema/user.schema';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async findUser(email: string) {
    return await this.userModel.findOne({ email });
  }

  async createUser(userDto: UserDto) {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);

    const user = await this.userModel.create({
      userName: userDto.userName,
      email: userDto.email,
      password: hashedPassword,
      role: userDto.role,
    });

    const { password, ...result } = user.toObject();
    return result;
  }
}
