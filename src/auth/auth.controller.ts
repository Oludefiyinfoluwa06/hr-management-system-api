import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { User } from '../utils/types.utils';
import { UserDto } from '../user/dto/user.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Request() req: { user: User }) {
    return await this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() userDto: UserDto) {
    return await this.authService.register(userDto);
  }

  @Post('request-otp')
  async requestOtp(@Body() requestOtpDto: RequestOtpDto) {
    return await this.authService.requestOtp(requestOtpDto);
  }

  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
  }
}
