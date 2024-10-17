import { Roles } from './enums.utils';

export type User = {
  _id: any;
  companyName: string;
  userName: string;
  email: string;
  role: Roles;
  companyId: string;
  otp: null | number;
  otpExpires: null | Date;
};
