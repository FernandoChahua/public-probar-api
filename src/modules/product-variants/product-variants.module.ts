import { ProductVariantsService } from './product-variants.service';
import { ProductVariantsController } from './product-variants.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariantsRepository } from './product-variants.repository';
import { AuthModule } from '../auth/auth.module';
import { FavoriteModule } from '../favorites/favorites.module';
import { ProductModule } from '../products/product.module';
import { ProductConfigRepository } from './product-config-ar.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductVariantsRepository,
      ProductConfigRepository,
    ]),
    AuthModule,
    FavoriteModule,
    ProductModule,
  ],
  controllers: [ProductVariantsController],
  providers: [ProductVariantsService],
  exports: [ProductVariantsService],
})
export class ProductVariantsModule {}
