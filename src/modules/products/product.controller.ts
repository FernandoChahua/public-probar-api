/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CustomLoggerService } from '../../shared/logger/custom-logger.service';
import { Builder } from '../../shared/utils/builder';
import { PaginationOptionsInterface } from '../../shared/utils/pagination/pagination.options.interface';
import { PaginationResultInterface } from '../../shared/utils/pagination/pagination.results.interface';
import { AuthService } from '../auth/auth.service';
import { GetProductDto, SaveProductDto } from './dto';
import { ProductService } from './product.service';

@Controller('products')
@ApiTags('products')
export class ProductController {
  constructor(
    readonly _productService: ProductService,
    readonly _authService: AuthService,
    readonly logger: CustomLoggerService,
  ) {
    this.logger = new CustomLoggerService(ProductController.name);
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'El producto ha sido creado correctamente.',
  })
  async saveProduct(@Body() productDto: SaveProductDto): Promise<void> {
    await this._productService.save(productDto);
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 10 })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  async findAllProduct(
    @Req() req: Request,
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('query') query = '',
  ): Promise<PaginationResultInterface<GetProductDto>> {
    const user = await this._authService.decodeJwtFromRequest(req);
    let userId = null;
    if (user) userId = user.id;
    const options = Builder<PaginationOptionsInterface>()
      .limit(limit ?? 10)
      .page(page ?? 1)
      .query(query ?? '')
      .build();
    return await this._productService.findAllProducts(userId, options);
  }
}
