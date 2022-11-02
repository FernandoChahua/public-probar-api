/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Header, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { CustomLoggerService } from '../../shared/logger/custom-logger.service';

@Controller('file')
export class LocalFileController {
  private readonly logger = new CustomLoggerService(LocalFileController.name);

  @Get('brands')
  async getBrandImage(
    @Query('filename') filename: string,
    @Query('extension') extension: string,
    @Res() res,
  ) {
    this.logger.log(`${process.cwd()}/public/brands`);

    return res.sendFile(`${filename}.${extension}`, {
      root: `${process.cwd()}/public/brands`,
    });
  }

  @Get('config-ar')
  @Header('Content-Disposition', 'attachment; filename=model.obj')
  async getConfigARFile(
    @Query('filename') filename: string,
    @Query('extension') extension: string,
    @Res() res,
  ) {
    this.logger.log(`${process.cwd()}/public/config-ar`);

    res.download(`${process.cwd()}/public/config-ar/${filename}.${extension}`);
  }

  @Get('product-variants')
  async getProductVariantsFile(
    @Query('filename') filename: string,
    @Query('extension') extension: string,
    @Res() res,
  ) {
    this.logger.log(`${process.cwd()}/public/product-variants`);

    return res.sendFile(`${filename}.${extension}`, {
      root: `${process.cwd()}/public/product-variants`,
    });
  }
}
