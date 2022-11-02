/* eslint-disable max-len */
import { HttpStatus } from '@nestjs/common';

export interface IHttpCustomException {
  response: string;
  status: number;
}

export class CustomMessages {
  // Default message
  static DEFAULT_MESSAGE = {
    response: 'Mensaje por defecto.',
    code: '9999',
    status: HttpStatus.CONFLICT,
  };
  static UNKNOWN_ERROR = {
    response: 'Error desconocido.',
    code: '9999',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  };
  static INVALID_FORMAT_EMAIL = {
    response: 'Formato invalido de correo.',
    code: '9999',
    status: HttpStatus.CONFLICT,
  };
  static USER_NOT_EXIST = {
    response: 'El correo ingresado no existe.',
    code: '9999',
    status: HttpStatus.NOT_FOUND,
  };
}
