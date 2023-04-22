import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomisableException extends HttpException {
  constructor(field: string, message: string, status: number) {
    const outError = messageConstructor(field, message);
    super(outError, status);
  }
}

export class EmailConflictException extends HttpException {
  constructor() {
    const outError = messageConstructor('email', 'email already exist');
    super(outError, HttpStatus.CONFLICT);
  }
}

export class LoginConflictException extends HttpException {
  constructor() {
    const outError = messageConstructor('login', 'login already exist');
    super(outError, HttpStatus.CONFLICT);
  }
}

function messageConstructor(field: string, message: string) {
  const errors = [
    {
      message: message,
      field: field,
    },
  ];
  return errors;
}
