import { Builder } from '../../shared/utils/builder';
import { DateUtil } from '../../shared/utils/date-util';
import { Product } from '../products/entities/product.entity';
import {
  GetBrandDto,
  GetConfigARDto,
  GetProductDto,
  GetProductVariantDto,
  SaveProductVariantDto,
} from './dto';
import { ProductVariant } from './entities/product-variants.entity';

export class ProductVariantsFactory {
  public static buildDtoFromEntity({
    id,
    title,
    description,
    price,
    colorName,
    colorRGB,
    urlImage,
    linkPreviewModelAR,
    size,
    status,
    product,
    productConfigAR,
    createdAt,
  }: ProductVariant): GetProductVariantDto {
    return Builder<GetProductVariantDto>()
      .id(id)
      .title(title)
      .description(description)
      .price(price)
      .colorName(colorName)
      .colorRGB(colorRGB)
      .urlImage(urlImage)
      .size(size)
      .status(status)
      .urlPreviewModelAR(linkPreviewModelAR)
      .product(
        Builder<GetProductDto>()
          .id(product.id)
          .title(product.title)
          .description(product.description)
          .build(),
      )
      .brand(
        Builder<GetBrandDto>()
          .id(product.brand.id)
          .title(product.brand.title)
          .description(product.brand.description)
          .urlLogo(product.brand.urlLogoLink)
          .build(),
      )
      .configAR(
        !!productConfigAR
          ? Builder<GetConfigARDto>()
              .urlLeftModel(productConfigAR.urlLeftModel)
              .urlRightModel(productConfigAR.urlRightModel)
              .build()
          : null,
      )
      .createdAt(DateUtil.getDateWithTimezone(createdAt))
      .build();
  }

  public static buildEntityFromDto({
    productId,
    size,
    colorName,
    colorRGB,
    title,
    description,
    urlPreviewModelAR,
    price,
  }: SaveProductVariantDto): ProductVariant {
    return Builder<ProductVariant>()
      .title(title)
      .description(description)
      .price(price)
      .linkPreviewModelAR(urlPreviewModelAR)
      .product(new Product({ id: productId }))
      .size(size)
      .colorName(colorName)
      .colorRGB(colorRGB)
      .build();
  }
}
