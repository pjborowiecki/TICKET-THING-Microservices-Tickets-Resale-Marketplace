import type { ValidationError } from 'express-validator';

export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}

export class RequestValidationError extends CustomError {
  statusCode = 500;

  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters');
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((error) => {
      if (error.type === 'field') {
        return { message: error.msg, field: error.path };
      }
      return { message: error.msg };
    });
  }
}

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  reason = 'Error connecting to the database';

  constructor() {
    super('Error connecting to the database');
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super('Route not found');
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Not Found' }];
  }
}

export default CustomError;
