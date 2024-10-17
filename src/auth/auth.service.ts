import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { User } from '../utils/types.utils';
import { RequestOtpDto } from './dto/request-otp.dto';
import { Roles } from '../utils/enums.utils';
import { UserDto } from '../user/dto/user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private readonly mailService: MailerService,
  ) {}
  async validateUser(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }

    return null;
  }

  async login(user: User) {
    const payload = {
      email: user.email,
      sub: {
        _id: user._id,
        userName: user.userName,
      },
    };

    return {
      user: {
        ...user,
      },
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: 3600,
      }),
      message: 'Login successful',
    };
  }

  async register(userDto: UserDto) {
    if (userDto.role === Roles.EMPLOYER) {
      return {
        user: await this.userService.createUser(userDto),
        message: 'Registration successful',
      };
    }
  }

  async requestOtp(requestOtpDto: RequestOtpDto) {
    let user: User;

    if (requestOtpDto.role === Roles.EMPLOYER) {
      user = await this.userService.findUserByEmail(requestOtpDto.email);
    }

    if (!user) {
      throw new NotFoundException('This email does not exist');
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpires = new Date(Date.now() + 2 * 60 * 60 * 1000);

    const updateResult = await this.userService.updateUser(
      user._id.toString(),
      { otp, otpExpires },
    );

    if (updateResult.success === false) {
      throw new BadRequestException(
        'An error occurred while saving OTP. Try again',
      );
    }

    const message = `
      <html>
        <div>
          <h2>One-time password</h2>
          <p>This is the one-time password you requested</p>
          <h1 style="margin-top: 20px; margin-bottom: 20px;">${otp}</h1>
          <p>It expires in 2 hours</p>
        </div>
      </html>
    `;

    this.mailService.sendMail({
      from: `Olude Fiyinfoluwa <${process.env.EMAIL_USERNAME}>`,
      to: requestOtpDto.email,
      subject: 'OTP Request',
      html: message,
    });

    return {
      message: 'OTP sent successfully. Check your email',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    let user: User;

    if (resetPasswordDto.role === Roles.EMPLOYER) {
      user = await this.userService.findUserByEmail(resetPasswordDto.email);
    }

    const currentTime = new Date();
    const otpExpires = new Date(user.otpExpires);

    if (
      user.otp === Number(resetPasswordDto.otp) &&
      currentTime <= otpExpires
    ) {
      const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 10);

      await this.userService.updateUser(user._id.toString(), {
        password: hashedPassword,
        otp: null,
        otpExpires: null,
      });

      return {
        message: 'Your password has been reset successfully',
      };
    } else {
      throw new BadRequestException({ message: 'Invalid or expired OTP' });
    }
  }

  async getUser(id: string) {
    return await this.userService.findUserById(id);
  }
}
