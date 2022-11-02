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
import config from '../../config-env/config';
import { CustomLoggerService } from '../../shared/logger/custom-logger.service';
import { GetProductDto, SaveProductDto } from './dto';
import { ProductRepository } from './product.repository';
import { ProductFactory } from './product.factory';
import { FavoritesService } from '../favorites/favorites.service';
import { BrandsService } from '../brands/brands.service';
import { PaginationOptionsInterface } from '../../shared/utils/pagination/pagination.options.interface';
import { PaginationResultInterface } from '../../shared/utils/pagination/pagination.results.interface';
import { Status } from '../../shared/utils/common-enums';
import { PaginationFactory } from '../../shared/utils/pagination/pagination.factory';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private readonly _productRepository: ProductRepository,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    private readonly logger: CustomLoggerService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly _favoritesService: FavoritesService,
    private readonly _brandsService: BrandsService,
  ) {
    this.logger = new CustomLoggerService(ProductService.name);
  }

  async save(productDto: SaveProductDto): Promise<void> {
    await this._brandsService.existBrand(productDto.brandId);

    const productEntity = ProductFactory.buildEntityFromDto(productDto);
    await this._productRepository.save(productEntity);
  }

  async findAllProducts(
    userId: number,
    options: PaginationOptionsInterface,
  ): Promise<PaginationResultInterface<GetProductDto>> {
    options.limit = options.limit ? options.limit : 10;
    options.page = options.page > 0 ? options.page : 1;

    const [data, total] = await this._productRepository.findAndCount({
      take: options.limit,
      skip: options.limit * (options.page - 1),
      where: {
        status: Status.ACTIVE,
      },
      relations: ['brand'],
      order: {
        title: 'ASC',
      },
    });

    const results = Promise.all(
      data.map(async (product) => {
        const dto = ProductFactory.buildDtoFromEntity(product);
        return dto;
      }),
    );

    const response = PaginationFactory.buildPaginationResult<GetProductDto>(
      await results,
      options.limit,
      options.page,
      total,
    );

    return response;
  }

  async existProduct(productId: number): Promise<void> {
    const product = await this._productRepository.findOne({
      where: { id: productId },
    });

    if (!product)
      throw new HttpException(
        'No existe el producto seleccionado.',
        HttpStatus.BAD_REQUEST,
      );
  }
}
