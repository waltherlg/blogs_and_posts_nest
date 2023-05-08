import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomisableException extends HttpException {
  constructor(field: string, message: string, status: number) {
    super(messageConstructor(field, message), status);
  }
}

export class CustomNotFoundException extends HttpException {
  constructor(field: string) {
    super(
      messageConstructor(field, field + ' not found'),
      HttpStatus.NOT_FOUND,
    );
  }
}
export class BlogNotFoundException extends HttpException {
  constructor() {
    super(messageConstructor('blog', 'blog not found'), HttpStatus.NOT_FOUND);
  }
}

export class PostNotFoundException extends HttpException {
  constructor() {
    super(messageConstructor('post', 'post not found'), HttpStatus.NOT_FOUND);
  }
}

export class UserNotFoundException extends HttpException {
  constructor() {
    super(messageConstructor('user', 'user not found'), HttpStatus.NOT_FOUND);
  }
}

export class EmailAlreadyExistException extends HttpException {
  constructor() {
    super(messageConstructor('email', 'email already exist'), 400);
  }
}

export class LoginAlreadyExistException extends HttpException {
  constructor() {
    super(messageConstructor('login', 'login already exist'), 400);
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
