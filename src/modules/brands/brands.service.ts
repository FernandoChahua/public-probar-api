/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike } from 'typeorm';
import config from '../../config-env/config';
import { CustomLoggerService } from '../../shared/logger/custom-logger.service';
import { Status } from '../../shared/utils/common-enums';
import { PaginationFactory } from '../../shared/utils/pagination/pagination.factory';
import { PaginationOptionsInterface } from '../../shared/utils/pagination/pagination.options.interface';
import { PaginationResultInterface } from '../../shared/utils/pagination/pagination.results.interface';
import { BrandsFactory } from './brands.factory';
import { BrandsRepository } from './brands.repository';
import { FilterRequest, GetBrandDto, SaveBrandDto } from './dto';
import { Brand } from './entities/brands.entity';

@Injectable()
export class BrandsService {
  constructor(
    readonly logger: CustomLoggerService,
    @InjectRepository(BrandsRepository)
    readonly _brandRepository: BrandsRepository,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {
    this.logger = new CustomLoggerService(BrandsService.name);
  }

  async saveBrand(
    { description, title }: SaveBrandDto,
    urlLink: string,
    path: string,
    filename: string,
  ): Promise<{ id: number }> {
    const brand = new Brand({
      description,
      title,
      urlLogoLink: urlLink,
      pathFileLogo: path,
      logoFilename: filename,
    });
    await brand.save();
    return {
      id: brand.id,
    };
  }

  async getBrands(
    options: PaginationOptionsInterface,
    {title}: FilterRequest
  ): Promise<PaginationResultInterface<GetBrandDto>> {
    options.limit = options.limit ? options.limit : 10;
    options.page = options.page > 0 ? options.page : 1;

    let titleFilter = {};
    if (!!title) {
      titleFilter = { title: ILike(`${title}%`) };
    }

    const [data, total] = await this._brandRepository.findAndCount({
      take: options.limit,
      skip: options.limit * (options.page - 1),
      where: {
        ...titleFilter,
        status: Status.ACTIVE,
      },
      relations: [],
      order: {
        title: 'ASC',
      },
    });

    const results = Promise.all(
      data.map(async (brand) => {
        return BrandsFactory.buildEntityToDto(brand);
      }),
    );

    const response = PaginationFactory.buildPaginationResult<GetBrandDto>(
      await results,
      options.limit,
      options.page,
      total,
    );

    return response;
  }
  async existBrand(brandId: number): Promise<void> {
    const brand = await this._brandRepository.findOne({
      where: { id: brandId },
    });

    if (!brand)
      throw new HttpException(
        'No existe la marca seleccionada.',
        HttpStatus.BAD_REQUEST,
      );
  }
}
