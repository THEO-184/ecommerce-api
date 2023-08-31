import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    return data ? req.user[data] : req.user;
  },
);

export default GetUser;
