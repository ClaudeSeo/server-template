import { HttpException, HttpStatus, ValidationError } from '@nestjs/common';
import { last } from 'lodash';

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

export class NotFoundError extends BaseError {
  constructor(message: string, fieldName?: string) {
    super(HttpStatus.NOT_FOUND, message, fieldName);
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

/** ???????????? message, stack?????? ????????? */
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
    return new BadRequestError(last(Object.values(error.constraints))!);
  }

  if (error.children) {
    return exceptionChildrenFactory(error.children);
  }

  return exceptionChildrenFactory(otherErrors);
};

/** class-validator ?????? ????????? ?????? */
export const exceptionFactory = (errors: ValidationError[]): BaseError => {
  if (errors.length === 0) {
    return new BadRequestError('????????? ????????? ??????????????????.');
  }

  const [error, ...otherErrors] = errors;

  if (error.constraints) {
    return new BadRequestError(last(Object.values(error.constraints))!);
  }

  if (error.children) {
    const childrenErrors = exceptionChildrenFactory(error.children);
    if (childrenErrors) {
      return childrenErrors;
    }
  }

  return exceptionFactory(otherErrors);
};
