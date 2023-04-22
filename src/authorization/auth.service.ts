import { UsersRepository } from '../users/users.repository';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserInputModelType } from '../users/users.controller';
import { DTOFactory } from '../helpers/usersDTOfactory';
import { EmailManager } from '../managers/email-manager';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly dtoFactory: DTOFactory,
    private readonly emailManager: EmailManager,
  ) {}
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

  async registerUser(registerUserInputData: CreateUserInputModelType) {
    const registerUserData = {
      ...registerUserInputData,
      confirmationCode: uuidv4(),
      expirationDateOfConfirmationCode: add(new Date(), {
        hours: 1,
        //minutes: 3
      }),
    };
    const userDTO = await this.dtoFactory.createUserDTO(registerUserData);
    const newUsersId = await this.usersRepository.createUser(userDTO);
    try {
      await this.emailManager.sendEmailConfirmationMessage(userDTO);
    } catch (error) {
      await this.usersRepository.deleteUserById(newUsersId);
      throw new InternalServerErrorException();
    }
    return newUsersId;
  }
}
