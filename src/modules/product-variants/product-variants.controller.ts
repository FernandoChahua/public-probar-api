/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { CustomLoggerService } from '../../shared/logger/custom-logger.service';
import { Builder } from '../../shared/utils/builder';
import { PaginationOptionsInterface } from '../../shared/utils/pagination/pagination.options.interface';
import { PaginationResultInterface } from '../../shared/utils/pagination/pagination.results.interface';
import { AuthService } from '../auth/auth.service';
import {
  FilterRequest,
  GetProductVariantDetailDto,
  GetProductVariantDto,
  ModelType,
  SaveProductVariantDto,
} from './dto';
import { ProductVariantsService } from './product-variants.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileUtil } from '../../shared/utils/file-util';

@Controller('product-variants')
export class ProductVariantsController {
  constructor(
    readonly _productVariantService: ProductVariantsService,
    readonly logger: CustomLoggerService,
    readonly _authService: AuthService,
  ) {
    this.logger = new CustomLoggerService(ProductVariantsController.name);
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'La variante del producto ha sido creado correctamente.',
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/product-variants',
        filename: (req: Request, file, cb) => {
          const extension = extname(file.originalname);
          const filename = `product-variants-${uuidv4()}${extension}`;
          return cb(null, filename);
        },
      }),
    }),
  )
  async saveProduct(
    @Body() productDto: SaveProductVariantDto,
    @UploadedFile() image,
  ): Promise<void> {
    if (!image)
      throw new HttpException(
        `Debe adjuntar la imagen del logo de la marca.`,
        HttpStatus.BAD_REQUEST,
      );
    const path = `${FileUtil.FILE_PATH_CONFIG_AR}/${image.filename}`;
    this.logger.debug(`Saving file on path ${path}`);

    const urlLink = FileUtil.getProductVariantsFile(image.filename);
    await this._productVariantService.save(
      productDto,
      urlLink,
      path,
      image.filename,
    );
  }

  @Get('catalog')
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 10 })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  async findAllProduct(
    @Req() req: Request,
    @Query() filter: FilterRequest,
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('query') query = '',
  ): Promise<PaginationResultInterface<GetProductVariantDto>> {
    const user = await this._authService.decodeJwtFromRequest(req);
    let userId = null;
    if (user) userId = user.id;
    const options = Builder<PaginationOptionsInterface>()
      .limit(limit ?? 10)
      .page(page ?? 1)
      .query(query ?? '')
      .build();
    console.log(filter);
    return await this._productVariantService.findAllProducts(
      userId,
      filter,
      options,
    );
  }

  @Get(':productVariantId')
  @HttpCode(HttpStatus.OK)
  async findById(
    @Req() req: Request,
    @Param('productVariantId') productVariantId: number,
  ): Promise<GetProductVariantDetailDto> {
    const user = await this._authService.decodeJwtFromRequest(req);
    let userId = null;
    if (user) userId = user.id;
    return await this._productVariantService.findById(productVariantId, userId);
  }

  @Post('config-ar/:productVariantId')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('model', {
      storage: diskStorage({
        destination: './public/config-ar',
        filename: (req: Request, file, cb) => {
          const type = req.query.type;
          const productVariantId = req.params.productVariantId;
          const extension = extname(file.originalname);
          const filename = `config-ar-${type}-${productVariantId}-${uuidv4()}${extension}`;
          return cb(null, filename);
        },
      }),
    }),
  )
  async addConfigAR(
    @Param('productVariantId') productVariantId: number,
    @Query('type') type: ModelType,
    @UploadedFile() model,
  ): Promise<void> {
    const path = `${FileUtil.FILE_PATH_CONFIG_AR}/${model.filename}`;
    this.logger.debug(`Saving file on path ${path}`);
    if (
      !!!type ||
      !!!productVariantId ||
      ![ModelType.LEFT, ModelType.RIGHT].includes(type)
    ) {
      await FileUtil.deleteFile(path);

      throw new HttpException(
        'Ingresar correctamente el Query(type) o Param(productVariantId).',
        HttpStatus.BAD_REQUEST,
      );
    }
    const urlLink = FileUtil.getConfigARFile(model.filename);
    return await this._productVariantService.addConfigAR(
      productVariantId,
      urlLink,
      type,
      path,
      model.filename,
    );
  }
}
