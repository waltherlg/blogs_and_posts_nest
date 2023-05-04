import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
//export class OptionalJwtAuthGuard extends AuthGuard(['jwt', 'anonymous']) {}
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context) {
    return user;
  }
}
