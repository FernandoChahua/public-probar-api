import { LocalFileModule } from './modules/local-file/local-file.module';
import { ProductVariantsModule } from './modules/product-variants/product-variants.module';
import { BrandsModule } from './modules/brands/brands.module';
import { FavoriteModule } from './modules/favorites/favorites.module';

import { Inject, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import config from './config-env/config';
import { enviroments } from './config-env/enviroments';
import { DatabaseModule } from './database/database.module';
import { CustomLoggerModule } from './shared/logger/custom-logger.module';
import { MailModule } from './modules/mail';
import { ProductModule } from './modules/products/product.module';

@Module({
  imports: [
    LocalFileModule,
    ProductVariantsModule,
    BrandsModule,
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.dev.env',
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        API_KEY: Joi.number(),
        // API_KEY: Joi.number().required(),
        // DATABASE_NAME: Joi.string().required(),
        // DATABASE_PORT: Joi.number().required(),
      }),
    }),
    DatabaseModule,
    MailModule,
    CustomLoggerModule,
    AuthModule,
    ProductModule,
    FavoriteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static port: number | string;

  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {
    AppModule.port = parseInt(this.configService.port);
    console.log(AppModule.port);
    console.log(process.env.NODE_ENV);
  }
}
