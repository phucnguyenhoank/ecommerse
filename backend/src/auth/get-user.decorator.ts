import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface UserPayload {
  id: number;
  username: string;
  email: string;
}

export const GetUser = createParamDecorator<UserPayload>(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserPayload;
  },
); 