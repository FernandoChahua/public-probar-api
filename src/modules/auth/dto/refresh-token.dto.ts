import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty()
  token: string;
  @ApiProperty()
  refreshToken: string;
}
