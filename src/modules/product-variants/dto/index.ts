import { ApiProperty } from '@nestjs/swagger';
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
  urlLogo: string;
}

export class GetConfigARDto {
  @ApiProperty()
  urlLeftModel: string;

  @ApiProperty()
  urlRightModel: string;
}

export class GetProductDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
}

export class GetProductVariantDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  price: number;
  @ApiProperty()
  urlImage: string;
  @ApiProperty()
  urlPreviewModelAR: string;
  @ApiProperty()
  colorName: string;
  @ApiProperty()
  colorRGB: string;
  @ApiProperty()
  size: string;
  @ApiProperty()
  status: Status;
  @ApiProperty()
  brand: GetBrandDto;
  @ApiProperty()
  product: GetProductDto;
  @ApiProperty()
  configAR: GetConfigARDto;
  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  isFavorite: boolean;
}

export class GetProductVariantDetailDto {
  productVariants: GetProductVariantDto[];

  idSelected: number;
}

export class UpdateProductVariantDto {
  @ApiProperty({
    name: 'title',
    description: 'Título del producto.',
    example: 'Producto 1',
  })
  title: string;
  @ApiProperty({
    name: 'description',
    description: 'Descripción del producto.',
    example: 'Producto descripción 1.',
  })
  description: string;

  @ApiProperty({
    name: 'urlPreviewModelAR',
    description: 'Link para probar la zapatilla con realidad aumentada y Snap AR.',
    example: 'Link de filtro para probar zapatilla con realidad aumentada y Snap AR.',
  })
  urlPreviewModelAR: string;

  @ApiProperty({
    name: 'price',
    description: 'Precio promedio del producto.',
    example: 10.5,
  })
  price: number;

  @ApiProperty({
    name: 'colorName',
    description: 'Nombre del color de zapatilla',
    example: 'Azul',
  })
  colorName: string;
  @ApiProperty({
    name: 'colorRGB',
    description: 'Nombre del color en RGB',
    example: '#ffffff',
  })
  colorRGB: string;
  @ApiProperty({
    name: 'size',
    description: 'Tamaños disponibles del producto',
    example: '36,37,38,39,40',
  })
  size: string;
}

export class SaveProductVariantDto {
  @ApiProperty({
    name: 'title',
    description: 'Título del producto.',
    example: 'Producto 1',
  })
  title: string;
  @ApiProperty({
    name: 'description',
    description: 'Descripción del producto.',
    example: 'Producto descripción 1.',
  })
  description: string;
  @ApiProperty({
    name: 'urlPreviewModelAR',
    description: 'Link para probar la zapatilla con realidad aumentada y Snap AR.',
    example: 'Link de filtro para probar zapatilla con realidad aumentada y Snap AR.',
  })
  urlPreviewModelAR: string;
  @ApiProperty({
    name: 'price',
    description: 'Precio promedio del producto.',
    example: 10.5,
  })
  price: number;

  @ApiProperty({
    name: 'colorName',
    description: 'Nombre del color de zapatilla',
    example: 'Azul',
  })
  colorName: string;
  @ApiProperty({
    name: 'colorRGB',
    description: 'Nombre del color en RGB',
    example: '#ffffff',
  })
  colorRGB: string;
  @ApiProperty({
    name: 'size',
    description: 'Tamaños disponibles del producto',
    example: '36,37,38,39,40',
  })
  size: string;
  @ApiProperty({
    name: 'productId',
    description: 'Id del producto padre.',
    example: 1,
  })
  productId: number;
}

export class FilterRequest {
  @ApiProperty({
    name: 'brandId',
    description: 'Id de la marca para filtro.',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  brandId?: number;

  @ApiProperty({
    name: 'title',
    description: 'Título del producto para filtro.',
    example: 'Producto 1',
  })
  @IsOptional()
  @Type(() => String)
  title?: string;

  @IsOptional()
  @Type(() => Boolean)
  onlyFavorites?: boolean;
}

export class SaveProductConfigAR {
  @ApiProperty({
    name: 'urlLeftModel',
    description: 'Link del modelo 3D del pie izquierdo.',
  })
  urlLeftModel: string;

  @ApiProperty({
    name: 'urlRightModel',
    description: 'Link del modelo 3D del pie derecho.',
  })
  urlRightModel: string;

  @ApiProperty({
    name: 'productVariantId',
    description: 'Id del variante del producto.',
    example: 1,
  })
  productVariantId: number;
}

export enum ModelType {
  LEFT = 'left',
  RIGHT = 'right',
}
