import { HttpException } from '@nestjs/common';
import { IHttpCustomException } from './custom-messages';

export const throwCustomHttpException = (
  exception: IHttpCustomException,
): void => {
  throw new HttpException(JSON.stringify(exception), exception.status);
};
