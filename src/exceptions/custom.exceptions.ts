import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomisableException extends HttpException {
  constructor(field: string, message: string, status: number) {
    super(messageConstructor(field, message), status);
  }
}

export class EmailAlreadyExistException extends HttpException {
  constructor() {
    super(
      messageConstructor('email', 'email already exist'),
      HttpStatus.CONFLICT,
    );
  }
}

export class LoginAlreadyExistException extends HttpException {
  constructor() {
    super(
      messageConstructor('login', 'login already exist'),
      HttpStatus.CONFLICT,
    );
  }
}

function messageConstructor(field: string, message: string) {
  return [
    {
      message: message,
      field: field,
    },
  ];
}
