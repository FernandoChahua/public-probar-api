import { FavoritesController } from './favorites.controller';
/*
https://docs.nestjs.com/modules
*/

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteRepository } from './favorites.repository';
import { AuthModule } from '../auth/auth.module';
import { FavoritesService } from './favorites.service';
import { ProductVariantsModule } from '../product-variants/product-variants.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FavoriteRepository]),
    AuthModule,
    forwardRef(() => ProductVariantsModule),
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoriteModule {}
