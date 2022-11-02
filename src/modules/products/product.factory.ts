import { Builder } from '../../shared/utils/builder';
import { DateUtil } from '../../shared/utils/date-util';
import { Brand } from '../brands/entities/brands.entity';
import { GetBrandDto, GetProductDto, SaveProductDto } from './dto';
import { Product } from './entities/product.entity';

export class ProductFactory {
  public static buildDtoFromEntity({
    id,
    title,
    description,
    price,
    status,
    redirectToUrlShop,
    createdAt,
    brand,
  }: Product): GetProductDto {
    return Builder<GetProductDto>()
      .id(id)
      .title(title)
      .description(description)
      .price(price)
      .status(status)
      .redirectToShop(redirectToUrlShop)
      .brand(
        Builder<GetBrandDto>()
          .id(brand.id)
          .title(brand.title)
          .description(brand.description)
          .urlLogo(brand.urlLogoLink)
          .build(),
      )
      .createdAt(DateUtil.getDateWithTimezone(createdAt))
      .build();
  }

  public static buildEntityFromDto({
    title,
    description,
    price,
    brandId,
    redirectToShop,
  }: SaveProductDto): Product {
    return Builder<Product>()
      .title(title)
      .description(description)
      .price(price)
      .redirectToUrlShop(redirectToShop)
      .brand(new Brand({ id: brandId }))
      .build();
  }
}
