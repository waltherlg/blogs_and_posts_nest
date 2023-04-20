import { UsersRepository } from '../users/users.repository';
import { UnauthorizedException } from '@nestjs/common';

export class AuthService {
  constructor(private readonly usersRepository: UsersRepository) {}
  async BasicAuthorization(authHeader): Promise<boolean> {
    const authType = authHeader.split(' ')[0];
    if (authType !== 'Basic') {
      throw new UnauthorizedException();
    }
    const auth = Buffer.from(authHeader.split(' ')[1], 'base64')
      .toString()
      .split(':');
    const user = auth[0];
    const pass = auth[1];
    if (!(user == 'admin' && pass == 'qwerty')) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
