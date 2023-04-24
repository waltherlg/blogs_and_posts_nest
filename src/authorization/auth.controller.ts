import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Injectable,
  Post,
} from '@nestjs/common';
import { CreateUserInputModelType } from '../users/users.controller';
import { UsersQueryRepository } from '../users/users.query.repository';
import { CheckService } from '../other.services/check.service';
import {
  CustomisableException,
  EmailAlreadyExistException,
  LoginAlreadyExistException,
} from '../exceptions/custom.exceptions';
import { IsEmail, IsString, Length, Matches } from 'class-validator';
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
      throw new EmailAlreadyExistException();
    }
    if (await this.checkService.isLoginExist(userCreateInputModel.login)) {
      throw new LoginAlreadyExistException();
    }
    const newUsersId = await this.authService.registerUser(
      userCreateInputModel,
    );
    const user = await this.usersQueryRepository.getUserById(newUsersId);
    return user;
  }
  @Post('registration-email-resending')
  @HttpCode(204)
  async registrationEmailResending(
    @Body() email: registrationEmailResendingInput,
  ) {
    if (!(await this.checkService.isEmailExist(email.email))) {
      throw new CustomisableException('email', 'email not exist', 400);
    }
    if (await this.checkService.isEmailConfirmed(email.email)) {
      throw new CustomisableException('email', 'email already confirmed', 400);
    }
    const result = await this.authService.registrationEmailResending(
      email.email,
    );
    if (result) {
      return true;
    }
    throw new CustomisableException(
      'email',
      'the application failed to send an email',
      400,
    );
  }
}
export class registrationEmailResendingInput {
  @IsString()
  @IsEmail()
  @Length(1, 100)
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}
