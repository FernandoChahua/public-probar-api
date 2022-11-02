import { LocalFileController } from './local-file.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { CustomLoggerModule } from '../../shared/logger/custom-logger.module';

@Module({
  imports: [CustomLoggerModule],
  controllers: [LocalFileController],
  providers: [],
})
export class LocalFileModule {}
