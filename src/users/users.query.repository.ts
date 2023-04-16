import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserTypeOutput } from './users.types';
import { Model, Types } from 'mongoose';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async getUserById(usersId): Promise<UserTypeOutput | null> {
    if (!Types.ObjectId.isValid(usersId)) {
      return null;
    }
    const user: UserDocument = await this.userModel.findById(usersId);
    if (!user) {
      return null;
    }
    return user.prepareUserForOutput();
  }
  // async getAllUsers() {}
}
