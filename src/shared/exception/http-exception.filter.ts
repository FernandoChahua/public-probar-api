import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomLoggerService } from '../logger/custom-logger.service';
import { CustomMessages } from './custom-messages';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new CustomLoggerService(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let message = exception.message ?? CustomMessages.UNKNOWN_ERROR;
    let code = '9999';

    let status = 500;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
      try {
        const obj = JSON.parse(message);
        code = obj.code ?? '9999';
        message = obj.response ?? '';
      } catch (e) {
        this.logger.error(e);
      }

      if (exception.getResponse()['message']) {
        message = exception.getResponse()['message'];
        if (Array.isArray(message)) message = message.join('');
      }
    }
    if (message === 'Unauthorized') code = 'REFRESH';
    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      code,
    });
  }
}
