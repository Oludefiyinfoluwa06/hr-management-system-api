import { Roles } from './enums.utils';

export type User = {
  _id: any;
  userName: string;
  email: string;
  role: Roles;
  otp: null | number;
  otpExpires: null | Date;
};
