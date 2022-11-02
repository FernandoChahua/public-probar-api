import { ApiProperty } from '@nestjs/swagger';

export class PaginationResultInterface<PaginationEntity> {
  @ApiProperty()
  results: PaginationEntity[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  total_pages: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}
