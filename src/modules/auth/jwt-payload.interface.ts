import { Role } from './entities/user.entity';

export interface IJwtPayload {
  id: number;
  username: string;
  role: Role;
  iat?: Date;
}
