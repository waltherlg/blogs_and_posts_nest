import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserTypeOutput } from './users.types';
import { Model, Types } from 'mongoose';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async getUserById(userId): Promise<UserTypeOutput | null> {
    if (!Types.ObjectId.isValid(userId)) {
      return null;
    }
    const user: UserDocument = await this.userModel.findById(userId);
    if (!user) {
      return null;
    }
    return user.prepareUserForOutput();
  }
}
