/*
https://docs.nestjs.com/providers#services
*/

import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In } from 'typeorm';
import config from '../../config-env/config';
import { CustomLoggerService } from '../../shared/logger/custom-logger.service';
import { Builder } from '../../shared/utils/builder';
import { Status } from '../../shared/utils/common-enums';
import { FileUtil } from '../../shared/utils/file-util';
import { PaginationFactory } from '../../shared/utils/pagination/pagination.factory';
import { PaginationOptionsInterface } from '../../shared/utils/pagination/pagination.options.interface';
import { PaginationResultInterface } from '../../shared/utils/pagination/pagination.results.interface';
import { FavoritesService } from '../favorites/favorites.service';
import { ProductService } from '../products/product.service';
import {
  FilterRequest,
  GetProductVariantDetailDto,
  GetProductVariantDto,
  ModelType,
  SaveProductVariantDto,
} from './dto';
import { ProductConfigAR } from './entities/product-config-ar.entity';
import { ProductVariant } from './entities/product-variants.entity';
import { ProductConfigRepository } from './product-config-ar.repository';
import { ProductVariantsFactory } from './product-variants.factory';
import { ProductVariantsRepository } from './product-variants.repository';

@Injectable()
export class ProductVariantsService {
  constructor(
    @InjectRepository(ProductVariantsRepository)
    private readonly _productVariantsRepository: ProductVariantsRepository,
    @InjectRepository(ProductConfigRepository)
    private readonly _productConfigRepository: ProductConfigRepository,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    private readonly logger: CustomLoggerService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly _favoritesService: FavoritesService,
    @Inject(forwardRef(() => ProductService))
    private readonly _productService: ProductService,
  ) {
    this.logger = new CustomLoggerService(ProductVariantsService.name);
  }

  async save(
    productVariantDto: SaveProductVariantDto,
    urlLink: string,
    path: string,
    filename: string,
  ): Promise<void> {
    const productVariantEntity =
      ProductVariantsFactory.buildEntityFromDto(productVariantDto);
    productVariantEntity.urlImage = urlLink;
    productVariantEntity.pathFileImage = path;
    productVariantEntity.imageFilename = filename;
    await this._productService.existProduct(productVariantDto.productId);
    await this._productVariantsRepository.save(productVariantEntity);
  }

  async addConfigAR(
    productVariantId: number,
    urlLink: string,
    type: ModelType,
    pathFile: string,
    filename: string,
  ) {
    await this.existProduct(productVariantId).catch(async (err) => {
      await FileUtil.deleteFile(pathFile);
      this.logger.error(err);
      throw new HttpException(
        'No existe el variante del producto seleccionado.',
        HttpStatus.BAD_REQUEST,
      );
    });

    let configAR = await this._productConfigRepository.findOne({
      where: { productVariant: { id: productVariantId } },
      relations: ['productVariant'],
    });

    if (!configAR) {
      configAR = new ProductConfigAR();
      configAR.urlLeftModel = type === ModelType.LEFT ? urlLink : '';
      configAR.urlRightModel = type === ModelType.RIGHT ? urlLink : '';
      configAR.fileLeftModelName = type === ModelType.LEFT ? filename : '';
      configAR.fileRightModelName = type === ModelType.RIGHT ? filename : '';
      configAR.productVariant = new ProductVariant({ id: productVariantId });

      console.log(JSON.stringify(configAR));
      await configAR.save();
      return;
    }

    const filenameDelete =
      type === ModelType.LEFT
        ? configAR.fileLeftModelName
        : configAR.fileRightModelName;

    await FileUtil.deleteFile(
      `${FileUtil.FILE_PATH_CONFIG_AR}/${filenameDelete}`,
    );

    configAR.urlLeftModel =
      type === ModelType.LEFT ? urlLink : configAR.urlLeftModel;
    configAR.urlRightModel =
      type === ModelType.RIGHT ? urlLink : configAR.urlRightModel;
    configAR.fileLeftModelName =
      type === ModelType.LEFT ? filename : configAR.fileLeftModelName;
    configAR.fileRightModelName =
      type === ModelType.RIGHT ? filename : configAR.fileRightModelName;

    await configAR.save();
  }

  async findById(productVariantId: number, userId: number) {
    let favoriteIds = [];

    if (userId) {
      favoriteIds = await this._favoritesService.getMyFavoriteProductVariantIds(
        userId,
      );
      this.logger.debug(
        `Calling favorite service to get my product variant favorite ids userId=${userId} , result=${favoriteIds}`,
      );
    }

    const productVariant = await this._productVariantsRepository.findOne({
      where: { id: productVariantId, status: Status.ACTIVE },
      relations: ['product'],
    });

    if (!productVariant)
      throw new HttpException(
        `No se ha encontrado el producto buscado.`,
        HttpStatus.BAD_REQUEST,
      );

    const productId = productVariant.product.id;

    const productVariants = await this._productVariantsRepository.find({
      where: { product: { id: productId }, status: Status.ACTIVE },
      relations: ['product', 'product.brand', 'productConfigAR'],
      order: {
        createdAt: 'DESC',
      },
    });

    return Builder<GetProductVariantDetailDto>()
      .idSelected(productVariantId)
      .productVariants(
        productVariants.map((variant) =>
          ProductVariantsFactory.buildDtoFromEntity(variant),
        ),
      )
      .build();
  }

  async findAllProducts(
    userId: number,
    { title, brandId, onlyFavorites }: FilterRequest,
    options: PaginationOptionsInterface,
  ): Promise<PaginationResultInterface<GetProductVariantDto>> {
    let favoriteIds = [];

    if (userId) {
      favoriteIds = await this._favoritesService.getMyFavoriteProductVariantIds(
        userId,
      );
      this.logger.debug(
        `Calling favorite service to get my product variant favorite ids userId=${userId} , result=${favoriteIds}`,
      );
    }
    let brandFilter = {};
    if (!!brandId) {
      brandFilter = { product: { brand: { id: brandId } } };
    }

    let titleFilter = {};
    if (!!title) {
      titleFilter = { title: ILike(`${title}%`) };
    }

    let onlyFavoritesFilter = {};
    this.logger.debug(`filter onlyFavorites => ${onlyFavorites}`)
    if (onlyFavorites) {
      onlyFavoritesFilter = { id: In(favoriteIds) };

      this.logger.debug(`filter onlyFavoritesFilter => ${onlyFavoritesFilter}`)
    }

    options.limit = options.limit ? options.limit : 10;
    options.page = options.page > 0 ? options.page : 1;

    const [data, total] = await this._productVariantsRepository.findAndCount({
      take: options.limit,
      skip: options.limit * (options.page - 1),
      where: {
        ...brandFilter,
        ...titleFilter,
        ...onlyFavoritesFilter,
        status: Status.ACTIVE,
      },
      relations: ['product', 'product.brand', 'productConfigAR'],
      order: {
        title: 'ASC',
      },
    });

    const results = Promise.all(
      data.map(async (productVariant) => {
        const dto = ProductVariantsFactory.buildDtoFromEntity(productVariant);
        dto.isFavorite = favoriteIds.includes(productVariant.id);
        return dto;
      }),
    );

    const response =
      PaginationFactory.buildPaginationResult<GetProductVariantDto>(
        await results,
        options.limit,
        options.page,
        total,
      );

    return response;
  }

  async existProduct(productVariantId: number): Promise<void> {
    const product = await this._productVariantsRepository.findOne({
      where: { id: productVariantId },
    });

    if (!product)
      throw new HttpException(
        'No existe el variante del producto seleccionado.',
        HttpStatus.BAD_REQUEST,
      );
  }
}
