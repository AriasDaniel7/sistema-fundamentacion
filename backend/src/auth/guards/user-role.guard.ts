import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles = this.reflector.get('roles', context.getHandler());

    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    console.log(user);

    if (!user) {
      throw new BadRequestException('No se ha encontrado el usuario');
    }

    return true;
  }
}
