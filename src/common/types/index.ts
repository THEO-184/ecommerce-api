import { IJwtPayload } from 'src/auth/interfaces';

declare module 'express' {
  interface Request {
    user: IJwtPayload;
  }
}
