import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Status } from '../../../shared/utils/common-enums';

export class GetBrandDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  urlLogoLink;
  @ApiProperty()
  status: Status;
  @ApiProperty()
  createdAt: Date;
}

export class UpdateBrandDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  urlLogoLink: string;
}

export class SaveBrandDto extends OmitType(UpdateBrandDto, [
  'id',
  'urlLogoLink',
]) {}


export class FilterRequest {
  @ApiProperty({
    name: 'title',
    description: 'Título de la marca para filtro.',
    example: 'Marca 1',
  })
  @IsOptional()
  @Type(() => String)
  title?: string
}