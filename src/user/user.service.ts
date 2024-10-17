import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User } from './schema/user.schema';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async findUserByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async findUserById(id: string) {
    return await this.userModel.findById(id);
  }

  async createUser(userDto: UserDto) {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const companyId = uuidv4();

    const user = await this.userModel.create({
      companyName: userDto.companyName,
      userName: userDto.userName,
      email: userDto.email,
      password: hashedPassword,
      role: userDto.role,
      companyId,
    });

    const { password, ...result } = user.toObject();
    return result;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      {
        new: true,
      },
    );

    if (!updatedUser) {
      throw new BadRequestException('User details could not be updated');
    }

    return {
      updatedUser,
      message: 'User details updated successfully',
      success: true,
    };
  }
}
