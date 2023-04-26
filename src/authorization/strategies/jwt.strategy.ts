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
  async validate(loginOrEmail: string, password: string) {
    console.log(loginOrEmail);
    const userId = await this.authService.checkUserCredential(
      loginOrEmail,
      password,
    );
    if (!userId) {
      throw new UnauthorizedException();
    }
    return userId;
  }
}
