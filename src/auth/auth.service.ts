import { UsersRepository } from '../users/users.repository';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserInputModelType } from '../users/users.controller';
import { DTOFactory } from '../helpers/DTO.factory';
import { EmailManager } from '../managers/email-manager';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { CustomisableException } from '../exceptions/custom.exceptions';
import { BcryptService } from '../other.services/bcrypt.service';
import { Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { settings } from '../settings';
import { UserDeviceDBType } from '../usersDevices/users-devices.types';
import { UsersDevicesRepository } from '../usersDevices/usersDevicesRepository';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly dtoFactory: DTOFactory,
    private readonly emailManager: EmailManager,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    private readonly usersDeviceRepository: UsersDevicesRepository,
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

  async checkUserCredential(
    loginOrEmail: string,
    password: string,
  ): Promise<string | null> {
    const user = await this.usersRepository.findUserByLoginOrEmail(
      loginOrEmail,
    );
    if (!user) {
      return null;
    }
    const userHash = user.passwordHash;
    const isPasswordValid = await this.bcryptService.comparePassword(
      password,
      userHash,
    );
    if (!isPasswordValid) {
      return null;
    }
    return user._id.toString();
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
      throw new InternalServerErrorException(); //в контроллер
    }
    return newUsersId;
  }
  async registrationEmailResending(email): Promise<boolean> {
    const refreshConfirmationData = {
      email: email,
      confirmationCode: uuidv4(),
    };
    try {
      await this.emailManager.resendEmailConfirmationMessage(
        refreshConfirmationData,
      );
    } catch (error) {
      throw new CustomisableException(
        'email',
        'the application failed to send an email',
        400,
      );
    }
    // const result = await this.usersRepository.refreshConfirmationCode(
    //   refreshConfirmationData,
    // );
    // return result;
    const user = await this.usersRepository.findUserByLoginOrEmail(email);
    user.confirmationCode = refreshConfirmationData.confirmationCode;
    user.expirationDateOfConfirmationCode = add(new Date(), {
      hours: 1,
      //minutes: 3
    });
    return await this.usersRepository.saveUser(user);
  }
  async confirmEmail(code): Promise<boolean> {
    const user = await this.usersRepository.getUserByConfirmationCode(code);
    // если пользователь не найден, или уже подтвержден, то выкидываем эксепшен
    if (!user || user.isConfirmed === true) {
      throw new CustomisableException(
        'code',
        ' confirmation code is incorrect, expired or already been applied',
        400,
      );
    }
    user.isConfirmed = true;
    user.expirationDateOfConfirmationCode = null;
    return await this.usersRepository.saveUser(user);
  }

  async validateUserByAccessToken(payload) {
    return await this.getUserIdFromToken(payload);
  }

  async login(userId: string, ip: string, userAgent: string) {
    const deviceId = new Types.ObjectId();
    const accessToken = await this.jwtService.signAsync({ userId: userId });
    const refreshTokenPayload = { userId, deviceId };
    const refreshToken = await this.jwtService.signAsync(refreshTokenPayload);
    console.log(refreshToken);

    const lastActiveDate = await this.getLastActiveDateFromToken(refreshToken);
    const expirationDate = await this.getExpirationDateFromRefreshToken(
      refreshToken,
    );
    const deviceInfoDTO = new UserDeviceDBType(
      deviceId,
      userId,
      ip,
      userAgent,
      lastActiveDate,
      expirationDate,
    );
    await this.usersDeviceRepository.addDeviceInfo(deviceInfoDTO);
    return { accessToken, refreshToken };
  }

  async refreshingToken(refreshToken: string) {
    const deviceId = jwtService.getDeviceIdFromRefreshToken(refreshToken);
    const userId = jwtService.getUserIdFromRefreshToken(refreshToken);
    const accessToken = jwtService.createJWT(userId);
    const newRefreshedToken = await jwtService.createJWTRefresh(
      userId,
      deviceId,
    );
    const lastActiveDate = await jwtService.getLastActiveDateFromRefreshToken(
      newRefreshedToken,
    );
    const expirationDate = await jwtService.getExpirationDateFromRefreshToken(
      newRefreshedToken,
    );
    await userDeviceRepo.refreshDeviceInfo(
      deviceId,
      lastActiveDate,
      expirationDate,
    );
    return { accessToken, newRefreshedToken };
  }

  getUserIdFromToken(token) {
    try {
      const result: any = this.jwtService.verify(token);
      console.log('getUserIdFromToken result', result);
      return result.userId;
    } catch (error) {
      return null;
    }
  }

  getDeviceIdFromToken(token) {
    try {
      const result: any = this.jwtService.verify(token);
      return result.deviceId;
    } catch (error) {
      return null;
    }
  }

  async getLastActiveDateFromToken(refreshToken): Promise<string> {
    const payload: any = this.jwtService.decode(refreshToken);
    return new Date(payload.iat * 1000).toISOString();
  }

  async getExpirationDateFromRefreshToken(refreshToken): Promise<string> {
    const payload: any = this.jwtService.decode(refreshToken);
    return new Date(payload.exp * 1000).toISOString();
  }
}
