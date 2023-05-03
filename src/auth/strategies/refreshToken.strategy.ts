import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-jwt';
import { settings } from '../../settings';
import { AuthService } from '../auth.service';
import { CustomisableException } from '../../exceptions/custom.exceptions';
import { CheckService } from '../../other.services/check.service';
import { UsersDeviceService } from '../../usersDevices/users-devices.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly authService: AuthService,
    private readonly checkService: CheckService,
    private readonly usersDeviceService: UsersDeviceService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies?.refreshToken,
      ]),
      secretOrKey: settings.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: any) {
    if (!request.cookies || !request.cookies.refreshToken) {
      throw new CustomisableException('no access', 'no cookie', 401);
      //throw new UnauthorizedException('no cookie');
    }
    const refreshToken = request.cookies.refreshToken;
    if (!refreshToken) {
      throw new CustomisableException('no access', 'no cookie', 401);
      //throw new UnauthorizedException('no cookie');
    }

    const userId = await this.authService.getUserIdFromToken(refreshToken);
    if (!userId) {
      throw new CustomisableException('no access', 'no user in cookies', 401);
      //throw new UnauthorizedException('no user in cookies');
    }

    const deviceId = await this.authService.getDeviceIdFromToken(refreshToken);
    if (!deviceId) {
      throw new CustomisableException('no access', 'no device in cookies', 401);
      //throw new UnauthorizedException('no device in cookies');
    }

    const isUserExist = await this.checkService.isUserExist(userId);
    if (!isUserExist) {
      throw new CustomisableException('no access', 'user not found', 401);
      //throw new UnauthorizedException('user not found');
    }
    console.log('userId ', userId, ' deviceId', deviceId);

    const currentDevise = await this.usersDeviceService.getCurrentDevise(
      userId,
      deviceId,
    );
    if (!currentDevise) {
      throw new CustomisableException('no access', 'device not found', 401);
      //throw new UnauthorizedException('device not found');
    }

    const lastActiveRefreshToken =
      await this.authService.getLastActiveDateFromToken(refreshToken);
    if (lastActiveRefreshToken !== currentDevise.lastActiveDate) {
      throw new CustomisableException(
        'no access',
        'the last active dates do not match',
        401,
      );
      //throw new UnauthorizedException('the last active dates do not match');
    }
    return userId;
  }
}
