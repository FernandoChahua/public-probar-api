import { ApiProperty } from '@nestjs/swagger';

export class SigninDto {
  @ApiProperty({ description: 'Nombre de Usuario' })
  username: string;
  @ApiProperty()
  password: string;
}
