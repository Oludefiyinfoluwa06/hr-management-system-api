import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../../utils/enums.utils';
import { ROLES_KEY } from '../decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const authorizedRoles = this.reflector.getAllAndOverride<Roles[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const user = context.switchToHttp().getRequest().user;
    const hasAuthorizedRole = authorizedRoles.some(
      (role) => user.role === role,
    );
    return hasAuthorizedRole;
  }
}
