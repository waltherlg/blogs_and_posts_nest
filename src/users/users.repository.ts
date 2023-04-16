import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './users.types';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async saveUser(user: UserDocument) {
    const result = await user.save();
    return !!result;
  }

  async createUser(userDTO): Promise<string> {
    const newUser = new this.userModel(userDTO);
    await newUser.save();
    return newUser._id.toString();
  }

  async deleteUserById(userId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(userId)) {
      return false;
    }
    return this.userModel.findByIdAndDelete(userId);
  }

  async getUserDBTypeById(userId): Promise<UserDocument | null> {
    if (!Types.ObjectId.isValid(userId)) {
      return null;
    }
    const user = await this.userModel.findById(userId);
    if (!user) {
      return null;
    }
    return user;
  }

  async deleteAllUser() {
    await this.userModel.deleteMany({});
  }
}
