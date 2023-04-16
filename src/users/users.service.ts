import { UsersRepository } from './users.repository';
import { Injectable } from '@nestjs/common';
import { UserDBType } from './users.types';
@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  async createUser(u000serCreateInputModel) {
    const userDTO = new UserDBType();
  }
}
