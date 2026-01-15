import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRequest } from '../../auth/interfaces/auth.interface';

export const GetUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserRequest => {
    const request = ctx.switchToHttp().getRequest<{ user: UserRequest }>();
    return request.user;
  },
);
