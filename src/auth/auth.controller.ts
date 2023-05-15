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
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserInputModelType } from '../users/users.controller';
import { UsersQueryRepository } from '../users/users.query.repository';
import { CheckService } from '../other.services/check.service';
import {
  CustomisableException,
  CustomNotFoundException,
  EmailAlreadyExistException,
  LoginAlreadyExistException,
  UnableException,
} from '../exceptions/custom.exceptions';
import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserAuthModel } from './auth.types';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { request } from 'express';
export class RegistrationEmailResendingInput {
  @IsString()
  @IsEmail()
  @Length(1, 100)
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}

export class PasswordRecoveryEmailInput {
  @IsString()
  @IsEmail()
  @Length(1, 100)
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}

export class RegistrationConfirmationCodeInput {
  @IsString()
  @Length(1, 100)
  code: string;
}

export class NewPasswordSetInput {
  @IsString()
  @Length(6, 20)
  newPassword: string;
  @IsString()
  @Length(1, 100)
  recoveryCode: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly checkService: CheckService,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}
  @Post('registration')
  @HttpCode(204)
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
    if (!user) {
      throw new UnableException('registration');
    }
    return user;
  }
  @Post('registration-email-resending')
  @HttpCode(204)
  async registrationEmailResending(
    @Body() email: RegistrationEmailResendingInput,
  ) {
    // вариант где существование эмейла и его подтверждение проверяется с помощью
    // checkService и эксепшены выкидываются в контроллере
    if (!(await this.checkService.isEmailExist(email.email))) {
      throw new CustomisableException('email', 'email not exist', 400);
    }
    if (await this.checkService.isEmailConfirmed(email.email)) {
      throw new CustomisableException('email', 'email already confirmed', 400);
    }
    const result = await this.authService.registrationEmailResending(
      email.email,
    );
    if (!result) {
      throw new CustomisableException(
        'email',
        'the application failed to send an email',
        400,
      );
    }
  }
  @Post('registration-confirmation')
  @HttpCode(204)
  async registrationConfirmation(
    @Body() Code: RegistrationConfirmationCodeInput,
  ) {
    // вариант где код будет проверятся в auth сервисе
    await this.authService.confirmEmail(Code.code);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() request, @Res({ passthrough: true }) response) {
    const { accessToken, refreshToken } = await this.authService.login(
      request.user,
      request.ip,
      request.headers['user-agent']!,
    );
    response
      .status(200)
      .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
      .send({ accessToken });
  }
  //current user info
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async currentUserInfo(@Req() request) {
    const currentUserInfo = await this.usersService.currentUserInfo(
      request.user,
    );
    if (!currentUserInfo) {
      throw new UnableException('get current user info');
    }
    return currentUserInfo;
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  async refreshToken(@Req() request, @Res({ passthrough: true }) response) {
    const { accessToken, refreshToken } =
      await this.authService.refreshingToken(
        request.user.userId,
        request.user.deviceId,
      );
    response
      .status(200)
      .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
      .send({ accessToken });
  }

  @Post('password-recovery')
  @HttpCode(204)
  async passwordRecovery(@Body() email: PasswordRecoveryEmailInput) {
    if (!(await this.checkService.isEmailExist(email.email))) {
      throw new CustomNotFoundException('email');
    }
    const result = await this.authService.passwordRecovery(email.email);
    if (!result) {
      throw new UnableException('password recovery');
    }
  }

  @Post('new-password')
  @HttpCode(204)
  async newPasswordSet(@Body() newPasswordDTO: NewPasswordSetInput) {
    if (
      !(await this.checkService.isRecoveryCodeExist(
        newPasswordDTO.recoveryCode,
      ))
    ) {
      throw new CustomisableException(
        'recoveryCode',
        'recovery code incorrect',
        400,
      );
    }
    const result = await this.authService.newPasswordSet(newPasswordDTO);
    if (!result) {
      throw new UnableException('password change');
    }
  }
  @UseGuards(RefreshTokenGuard)
  @Post('logout')
  @HttpCode(204)
  async logout(@Req() request, @Res({ passthrough: true }) response) {
    const isLogout = await this.authService.logout(
      request.user.userId,
      request.user.deviceId,
    );
    if (isLogout) {
      response
        .cookie('refreshToken', '', { httpOnly: true, secure: true })
        .sendStatus(204);
    } else {
      throw new CustomisableException('logout', 'logout error', 400);
    }
  }
}
