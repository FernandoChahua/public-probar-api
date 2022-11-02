import { SetMetadata } from '@nestjs/common';
import { Role } from '../entities/user.entity';
export const AuthRoles = (...roles: Role[]) => SetMetadata('auth_roles', roles);
