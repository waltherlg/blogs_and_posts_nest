import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
}
