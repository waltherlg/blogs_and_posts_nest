import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-jwt';
import { settings } from '../../settings';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies.refreshToken,
      ]),
      secretOrKey: settings.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: any) {
    if (!request.cookies || !request.cookies.refreshToken) {
      throw new UnauthorizedException('no cookie');
    }
    const refreshToken = request.cookies.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('no cookie');
    }

    const userId = await this.authService.getUserIdFromToken(refreshToken);
    if (!userId) {
      throw new UnauthorizedException('no user in cookies');
    }

    const deviceId = await this.authService.getDeviceIdFromToken(refreshToken);
    if (!deviceId) {
      throw new UnauthorizedException('no device in cookies');
    }

    const isUserExist = await this.checkService.isUserExist(userId);
    if (!isUserExist) {
      throw new UnauthorizedException('user not found');
    }

    const currentDevise = await this.deviceService.getCurrentDevise(
      userId,
      deviceId,
    );
    if (!currentDevise) {
      throw new UnauthorizedException('device not found');
    }

    const lastActiveRefreshToken =
      await this.authService.getLastActiveDateFromToken(refreshToken);
    if (lastActiveRefreshToken !== currentDevise.lastActiveDate) {
      throw new UnauthorizedException('the last active dates do not match');
    }

    return { userId, deviceId };
  }
}
