import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../../../shared/utils/common-enums';

export class ResToggleFavoriteDto {
  @ApiProperty()
  userId: number;
  @ApiProperty()
  productVariantId: number;
  @ApiProperty()
  status: Status;
}
