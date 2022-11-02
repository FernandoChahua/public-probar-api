import { Logger } from '@nestjs/common';

export class CustomLoggerService extends Logger {
  log(message: any, ...optionalParams: any[]) {
    super.log(message, optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    super.error(message, optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    super.warn(message, optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    super.debug(message, optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]) {
    super.verbose(message, optionalParams);
  }
}
