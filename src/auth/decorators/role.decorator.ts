import { SetMetadata } from '@nestjs/common';
import { Roles } from '../../utils/enums.utils';

export const ROLES_KEY = 'roles';
export const UserRoles = (...roles: [Roles, ...Roles[]]) =>
  SetMetadata(ROLES_KEY, roles);
