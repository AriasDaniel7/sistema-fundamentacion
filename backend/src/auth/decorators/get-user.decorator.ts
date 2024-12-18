import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  const user = request.user;

  if (!user) {
    throw new InternalServerErrorException('No se pudo obtener el usuario');
  }

  return !data ? user : user[data];
});
