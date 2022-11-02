import { ApiProperty } from '@nestjs/swagger';
import { instanceToPlain } from 'class-transformer';

export class SignupDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;

  toJSON() {
    return instanceToPlain(this);
  }
}
