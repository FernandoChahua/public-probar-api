import { ApiProperty, OmitType } from '@nestjs/swagger';
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

export class GetProductDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  price: number;
  @ApiProperty()
  redirectToShop: string;
  @ApiProperty()
  status: Status;
  @ApiProperty()
  brand: GetBrandDto;
  @ApiProperty()
  createdAt: Date;
}

export class UpdateProductDto {
  @ApiProperty({ name: 'id', description: 'Id del producto.', example: 1 })
  id: number;
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
    name: 'redirectToUrlShop',
    description:
      'Url que redirecciona a la página de la tienda que vende la zapatilla.',
    example: 'https://tienda.com',
  })
  redirectToShop: string;
  @ApiProperty({
    name: 'price',
    description: 'Precio promedio del producto.',
    example: 10.5,
  })
  price: number;
  @ApiProperty({ name: 'brandId', description: 'Id de la marca.', example: 1 })
  brandId: number;
}

export class SaveProductDto extends OmitType(UpdateProductDto, ['id']) {}
