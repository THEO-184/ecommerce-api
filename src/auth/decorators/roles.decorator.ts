import { SetMetadata } from '@nestjs/common';
import { UserEnum } from '@prisma/client';

export const ROLES_KEY = 'type';
export const Roles = (...roles: UserEnum[]) => SetMetadata(ROLES_KEY, roles);
