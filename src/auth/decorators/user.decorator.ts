import { IJwtPayload } from 'src/auth/interfaces';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

const GetUser = createParamDecorator(
  (key: keyof IJwtPayload | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    return key ? req.user[key] : req.user;
  },
);

export default GetUser;
