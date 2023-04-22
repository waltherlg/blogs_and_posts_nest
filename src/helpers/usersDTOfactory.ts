import { UserDBType } from '../users/users.types';
import { Types } from 'mongoose';
import { BcryptService } from '../other.services/bcrypt.service';

export class DTOFactory {
  constructor(private readonly bcryptService: BcryptService) {}
  async createUserDTO(creatUserData: creatUserDataType) {
    const passwordHash = await this.bcryptService.hashPassword(
      creatUserData.password,
    );
    const userDTO = new UserDBType(
      new Types.ObjectId(),
      creatUserData.login,
      passwordHash,
      creatUserData.email,
      new Date().toISOString(),
      null,
      null,
      creatUserData.isConfirmed || false,
      null,
      null,
      [],
      [],
    );
    return userDTO;
  }
}

type creatUserDataType = {
  login: string;
  password: string;
  email: string;
  isConfirmed?: boolean;
};
