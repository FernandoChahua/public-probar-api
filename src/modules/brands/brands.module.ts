import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandsRepository } from './brands.repository';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([BrandsRepository])],
  controllers: [BrandsController],
  providers: [BrandsService],
  exports: [BrandsService],
})
export class BrandsModule {}
