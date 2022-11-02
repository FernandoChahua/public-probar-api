/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { CustomLoggerService } from '../../shared/logger/custom-logger.service';
import { IReqWithToken } from '../auth/req-with-token.interface';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
@ApiTags('favorites')
export class FavoritesController {
  constructor(
    private readonly _favoriteService: FavoritesService,
    private readonly logger: CustomLoggerService,
  ) {
    this.logger = new CustomLoggerService(FavoritesController.name);
  }
  @Post('toggle/:productVariantId')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async toggleFavoriteStatus(
    @Param('productVariantId') productVariantId: number,
    @Req() req: IReqWithToken,
  ) {
    return await this._favoriteService.toggleFavorite(
      req.user.id,
      productVariantId,
    );
  }
}
