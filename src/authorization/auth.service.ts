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
@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly dtoFactory: DTOFactory,
    private readonly emailManager: EmailManager,
    private readonly bcryptService: BcryptService,
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
    const isPasswordValid = this.bcryptService.comparePassword(
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

  async login(userId: ObjectId, ip: string, userAgent: string) {
    const deviceId = new ObjectId();
    const accessToken = jwtService.createJWT(userId);
    const refreshToken = await jwtService.createJWTRefresh(userId, deviceId);
    const lastActiveDate = await jwtService.getLastActiveDateFromRefreshToken(
      refreshToken,
    );
    const expirationDate = await jwtService.getExpirationDateFromRefreshToken(
      refreshToken,
    );
    const deviceInfo: UserDeviceDBType = {
      _id: deviceId,
      userId: userId,
      ip,
      title: userAgent,
      lastActiveDate,
      expirationDate,
    };
    await userDeviceRepo.addDeviceInfo(deviceInfo);
    return { accessToken, refreshToken };
  }
}
