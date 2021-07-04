import * as _ from 'lodash';
import { ValidationError, HttpException, HttpStatus } from '@nestjs/common';

const formatMessage = (message: string, fieldName?: string): string => {
  if (!fieldName) {
    return message;
  }

  return message.replace(/{PATH}/g, fieldName);
};

class BaseError extends HttpException {
  constructor(status: HttpStatus, message: string, fieldName?: string) {
    super(formatMessage(message, fieldName), status);
    this.name = this.constructor.name;
  }
}

export class BadRequestError extends BaseError {
  constructor(message: string, fieldName?: string) {
    super(HttpStatus.BAD_REQUEST, message, fieldName);
  }
}

export class RequiredError extends BaseError {
  constructor(message: string, fieldName?: string) {
    super(HttpStatus.BAD_REQUEST, message, fieldName);
  }
}

export class DataTypeError extends BaseError {
  constructor(message: string, fieldName?: string) {
    super(HttpStatus.BAD_REQUEST, message, fieldName);
  }
}

export class EnumerationError extends BaseError {
  constructor(message: string, fieldName?: string) {
    super(HttpStatus.BAD_REQUEST, message, fieldName);
  }
}

export class UniqueError extends BaseError {
  constructor(message: string, fieldName?: string) {
    super(HttpStatus.BAD_REQUEST, message, fieldName);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message: string, fieldName?: string) {
    super(HttpStatus.UNAUTHORIZED, message, fieldName);
  }
}

export class ForbiddenError extends BaseError {
  constructor(message: string, fieldName?: string) {
    super(HttpStatus.FORBIDDEN, message, fieldName);
  }
}

export class ConflictError extends BaseError {
  constructor(message: string, fieldName?: string) {
    super(HttpStatus.CONFLICT, message, fieldName);
  }
}

export class InternalServerError extends BaseError {
  constructor(message: string, fieldName?: string) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, message, fieldName);
  }
}

export class ServiceUnavailableError extends BaseError {
  constructor(message: string, fieldName?: string) {
    super(HttpStatus.SERVICE_UNAVAILABLE, message, fieldName);
  }
}

export class ProxyError extends HttpException {
  constructor(error: Error & { status?: HttpStatus }) {
    super(error.name, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

/** 에러에서 message, stack까지 꺼내줌 */
export const errorToJson = (err: Error) => ({
  ...err,
  message: err.message,
  stack: err.stack,
});

const exceptionChildrenFactory = (
  children: ValidationError['children']
): BaseError | null => {
  if (!children || children.length === 0) {
    return null;
  }

  const [error, ...otherErrors] = children;

  if (error.constraints) {
    return new BadRequestError(_.last(Object.values(error.constraints))!);
  }

  if (error.children) {
    return exceptionChildrenFactory(error.children);
  }

  return exceptionChildrenFactory(otherErrors);
};

/** class-validator 에러 메세지 추출 */
export const exceptionFactory = (errors: ValidationError[]): BaseError => {
  if (errors.length === 0) {
    return new BadRequestError('유효성 검사에 실패했습니다.');
  }

  const [error, ...otherErrors] = errors;

  if (error.constraints) {
    return new BadRequestError(_.last(Object.values(error.constraints))!);
  }

  if (error.children) {
    const childrenErrors = exceptionChildrenFactory(error.children);
    if (childrenErrors) {
      return childrenErrors;
    }
  }

  return exceptionFactory(otherErrors);
};
