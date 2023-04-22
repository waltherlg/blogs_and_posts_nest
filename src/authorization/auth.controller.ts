import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import {
  Body,
  ConflictException,
  Controller,
  Injectable,
  Post,
} from '@nestjs/common';
import { CreateUserInputModelType } from '../users/users.controller';
import { UsersQueryRepository } from '../users/users.query.repository';
import { CheckService } from '../other.services/check.service';
import {
  EmailConflictException,
  LoginConflictException,
} from '../exceptions/custom.exceptions';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly checkService: CheckService,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}
  @Post('registration')
  async registration(@Body() userCreateInputModel: CreateUserInputModelType) {
    if (await this.checkService.isEmailExist(userCreateInputModel.email)) {
      throw new EmailConflictException('email already exist');
    }
    if (await this.checkService.isLoginExist(userCreateInputModel.login)) {
      throw new LoginConflictException('login already exist');
    }
    const newUsersId = await this.authService.registerUser(
      userCreateInputModel,
    );
    const user = await this.usersQueryRepository.getUserById(newUsersId);
    return user;
  }
}
