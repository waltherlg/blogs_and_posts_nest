import { UsersRepository } from './users.repository';
import { Injectable } from '@nestjs/common';
import { UserDBType } from './users.types';
import { BcryptService } from '../other.services/bcrypt.service';
import { Types } from 'mongoose';
@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly bcryptService: BcryptService,
  ) {}
  async createUser(userCreateInputModel) {
    const passwordHash = await this.bcryptService.hashPassword(
      userCreateInputModel.password,
    );
    const userDTO = new UserDBType(
      new Types.ObjectId(),
      userCreateInputModel.login,
      passwordHash,
      userCreateInputModel.email,
      new Date().toISOString(),
      null,
      null,
      true,
      null,
      null,
      [],
      [],
    );
    const newUsersId = await this.usersRepository.createUser(userDTO);
    return newUsersId;
  }
}
