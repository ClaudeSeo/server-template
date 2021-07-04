import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

const DEFAULT_ERROR_MESSAGE =
  '알 수 없는 에러가 발생했습니다. 서버 관리자에게 문의하세요.';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error | HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let name = 'InternalServerError';
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = `${DEFAULT_ERROR_MESSAGE} (${exception.message})`;

    if (exception instanceof HttpException) {
      ({ name, message } = exception);
      status = exception.getStatus();
    }

    response.status(status).json({
      status,
      message,
      name,
    });
  }
}
