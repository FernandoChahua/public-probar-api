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
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomLoggerService } from '../../shared/logger/custom-logger.service';
import { Builder } from '../../shared/utils/builder';
import { PaginationOptionsInterface } from '../../shared/utils/pagination/pagination.options.interface';
import { PaginationResultInterface } from '../../shared/utils/pagination/pagination.results.interface';
import { BrandsService } from './brands.service';
import { FilterRequest, GetBrandDto, SaveBrandDto } from './dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileUtil } from '../../shared/utils/file-util';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('brands')
@ApiTags('brands')
export class BrandsController {
  constructor(
    private readonly logger: CustomLoggerService,
    private readonly _brandService: BrandsService,
  ) {
    this.logger = new CustomLoggerService(BrandsController.name);
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  async getBrands(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('query') query = '',
    @Query() filter: FilterRequest
  ): Promise<PaginationResultInterface<GetBrandDto>> {
    const options = Builder<PaginationOptionsInterface>()
      .limit(limit ?? 10)
      .page(page ?? 1)
      .query(query ?? '')
      .build();
    return await this._brandService.getBrands(options,filter);
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/brands',
        filename: (req: Request, file, cb) => {
          const extension = extname(file.originalname);
          const filename = `brands-${uuidv4()}${extension}`;
          return cb(null, filename);
        },
      }),
    }),
  )
  async saveBrand(
    @Body() body: SaveBrandDto,
    @UploadedFile() image,
  ): Promise<{ id: number }> {
    if (!image)
      throw new HttpException(
        `Debe adjuntar la imagen del logo de la marca.`,
        HttpStatus.BAD_REQUEST,
      );
    const path = `${FileUtil.FILE_PATH_CONFIG_AR}/${image.filename}`;
    this.logger.debug(`Saving file on path ${path}`);

    const urlLink = FileUtil.getBrandsFile(image.filename);
    return this._brandService.saveBrand(body, urlLink, path, image.filename);
  }
}
