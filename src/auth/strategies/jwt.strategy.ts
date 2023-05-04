import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { settings } from '../../settings';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: settings.JWT_SECRET,
    });
  }
  async validate(payload: any) {
    console.log('payload ', payload);
    // const userId = await this.authService.validateUserByAccessToken(payload);
    // console.log(userId);
    // if (!userId) {
    //   return null;
    // }
    // return userId;
    const userId = payload.userId;
    if (userId) {
      return userId;
    } else {
      return null;
    }
  }
}
