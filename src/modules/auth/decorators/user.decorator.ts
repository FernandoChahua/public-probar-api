import { createParamDecorator } from '@nestjs/common';
import { UserDto } from '../dto/user.dto';

export const GetUser = createParamDecorator(
  (data, request): UserDto => request.user,
);
