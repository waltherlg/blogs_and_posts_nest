import { UsersRepository } from './users.repository';
import { Injectable } from '@nestjs/common';
import { BcryptService } from '../other.services/bcrypt.service';
import { DTOFactory } from '../helpers/usersDTOfactory';
@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly bcryptService: BcryptService,
    private readonly dtoFactory: DTOFactory,
  ) {}
  async createUser(userCreateInputModel) {
    const userDTO = await this.dtoFactory.createUserDTO(userCreateInputModel);
    const newUsersId = await this.usersRepository.createUser(userDTO);
    return newUsersId;
  }
}
