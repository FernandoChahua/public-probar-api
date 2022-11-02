/*
https://docs.nestjs.com/providers#services
*/

import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import config from '../../config-env/config';
import { CustomLoggerService } from '../../shared/logger/custom-logger.service';
import { Builder } from '../../shared/utils/builder';
import { Status } from '../../shared/utils/common-enums';
import { User } from '../auth/entities/user.entity';
import { Favorite } from './entities/favorites.entity';
import { FavoriteRepository } from './favorites.repository';
import { ResToggleFavoriteDto } from './dto';
import { ProductVariant } from '../product-variants/entities/product-variants.entity';
import { ProductVariantsService } from '../product-variants/product-variants.service';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(FavoriteRepository)
    private readonly _favoriteRepository: FavoriteRepository,
    @Inject(forwardRef(() => ProductVariantsService))
    private readonly _productService: ProductVariantsService,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    private readonly logger: CustomLoggerService,
  ) {
    this.logger = new CustomLoggerService(FavoritesService.name);
  }

  async getMyFavoriteProductVariantIds(userId: number): Promise<number[]> {
    const myFavorites = await this._favoriteRepository.find({
      where: { user: { id: userId }, status: Status.ACTIVE },
      relations: ['productVariant', 'user'],
    });

    const resultIds = myFavorites.map((favorite) => favorite.productVariant.id);

    this.logger.debug(
      `Favorites Ids found count=${myFavorites.length} ids=${resultIds}`,
    );

    return resultIds;
  }

  async toggleFavorite(
    userId: number,
    productVariantId: number,
  ): Promise<ResToggleFavoriteDto> {
    await this._productService.existProduct(productVariantId);

    let favorite = await this._favoriteRepository.findOne({
      where: { user: { id: userId }, productVariant: { id: productVariantId } },
      relations: ['user', 'productVariant'],
    });
    if (!favorite) {
      favorite = new Favorite({
        user: new User({ id: userId }),
        productVariant: new ProductVariant({ id: productVariantId }),
      });
      await favorite.save();

      return Builder<ResToggleFavoriteDto>()
        .productVariantId(productVariantId)
        .userId(userId)
        .status(favorite.status)
        .build();
    }

    favorite.status =
      favorite.status === Status.ACTIVE ? Status.INACTIVE : Status.ACTIVE;

    await favorite.save();

    return Builder<ResToggleFavoriteDto>()
      .productVariantId(productVariantId)
      .userId(userId)
      .status(favorite.status)
      .build();
  }
}
