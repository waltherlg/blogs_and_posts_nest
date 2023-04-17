import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserTypeOutput } from './users.types';
import { HydratedDocument, Model, Types } from 'mongoose';
import { PaginationOutputModel } from '../models/types';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async saveUser(user: UserDocument) {
    const result = await user.save();
    return !!result;
  }
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

  async getAllUsers(
    mergedQueryParams,
  ): Promise<PaginationOutputModel<UserTypeOutput>> {
    const usersCount = await this.userModel.countDocuments({
      $or: [
        { login: new RegExp(mergedQueryParams.searchLoginTerm, 'gi') },
        { email: new RegExp(mergedQueryParams.searchEmailTerm, 'gi') },
      ],
    });
    //let usersCount = await usersCollection.countDocuments({})

    const users = await this.userModel
      .find({
        $or: [
          { login: new RegExp(mergedQueryParams.searchLoginTerm, 'gi') },
          { email: new RegExp(mergedQueryParams.searchEmailTerm, 'gi') },
        ],
      })
      .sort({
        [mergedQueryParams.sortBy]: this.sortByDesc(
          mergedQueryParams.sortDirection,
        ),
      })
      .skip(
        this.skipPage(mergedQueryParams.pageNumber, mergedQueryParams.pageSize),
      )
      .limit(+mergedQueryParams.pageSize);

    const outUsers = users.map((user) => {
      return user.prepareUserForOutput();
    });
    const pageCount = Math.ceil(usersCount / +mergedQueryParams.pageSize);

    const outputUsers: PaginationOutputModel<UserTypeOutput> = {
      pagesCount: pageCount,
      page: +mergedQueryParams.pageNumber,
      pageSize: +mergedQueryParams.pageSize,
      totalCount: usersCount,
      items: outUsers,
    };
    return outputUsers;
  }

  sortByDesc(sortDirection: string) {
    return sortDirection === 'desc' ? -1 : 1;
  }

  skipPage(pageNumber: string, pageSize: string): number {
    return (+pageNumber - 1) * +pageSize;
  }

  async getUserByConfirmationCode(code: string): Promise<UserDocument | null> {
    const user: UserDocument | null = await this.userModel
      .findOne({
        confirmationCode: code,
      })
      .lean();
    if (!user) {
      return null;
    }
    return user;
  }
  async getUserByPasswordRecoveryCode(code: string) {
    const user = await this.userModel.findOne({ passwordRecoveryCode: code });
    if (!user) {
      return null;
    }
    return user;
  }

  async findUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UserDocument | null> {
    const user: UserDocument | null = await this.userModel.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
    return user;
  }

  async updateConfirmation(code: string) {
    const result = await this.userModel.updateOne(
      { code },
      {
        $set: {
          isConfirmed: true,
          confirmationCode: null,
          expirationDateOfConfirmationCode: null,
        },
      },
    );
    return result.modifiedCount === 1;
  }

  async refreshConfirmationCode(refreshConfirmationData: any) {
    const result = await this.userModel.updateOne(
      { email: refreshConfirmationData.email },
      {
        $set: {
          confirmationCode: refreshConfirmationData.confirmationCode,
          expirationDate: refreshConfirmationData.expirationDate,
        },
      },
    );
    return result.modifiedCount === 1;
  }

  async addPasswordRecoveryData(passwordRecoveryData: PasswordRecoveryModel) {
    const result = await this.userModel.updateOne(
      { email: passwordRecoveryData.email },
      {
        $set: {
          passwordRecoveryCode: passwordRecoveryData.passwordRecoveryCode,
          expirationDateOfRecoveryCode:
            passwordRecoveryData.expirationDateOfRecoveryCode,
        },
      },
    );
    return result.modifiedCount === 1;
  }

  async newPasswordSet(_id: Types.ObjectId, passwordHash: string) {
    const result = await this.userModel.updateOne(
      { _id: _id },
      {
        $set: {
          passwordHash: passwordHash,
          passwordRecoveryCode: null,
          expirationDateOfRecoveryCode: null,
        },
      },
    );
    return result.modifiedCount === 1;
  }

  async createCommentsLikeObject(
    userId: string,
    commentsId: string,
    createdAt: Date,
    status: string,
  ): Promise<boolean> {
    if (!Types.ObjectId.isValid(userId)) {
      return false;
    }
    const _id = new Types.ObjectId(userId);
    const user = await this.userModel.findOne({ _id: _id });
    if (!user) {
      return false;
    }
    const newLikedComment = { commentsId, createdAt, status };
    user.likedComments.push(newLikedComment);
    const result = await user.save();
    return !!result;
  }

  async isUserAlreadyLikeComment(
    userId: string,
    commentsId: string,
  ): Promise<boolean> {
    if (!Types.ObjectId.isValid(userId)) {
      return false;
    }
    const _id = new Types.ObjectId(userId);
    const isExist = await this.userModel.findOne({
      _id: _id,
      likedComments: { $elemMatch: { commentsId: commentsId } },
    });
    return !!isExist;
  }

  async updateCommentsLikeObject(
    userId: string,
    commentsId: string,
    status: string,
  ) {
    if (!Types.ObjectId.isValid(userId)) {
      return false;
    }
    const _id = new Types.ObjectId(userId);
    const updateStatus = await this.userModel.findOneAndUpdate(
      { _id: _id, 'likedComments.commentsId': commentsId },
      { $set: { 'likedComments.$.status': status } },
    );
    return true;
  }

  async getUsersLikedComments(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      return null;
    }
    const _id = new Types.ObjectId(userId);
    const user = await this.userModel.findOne({ _id: _id });
    if (!user) return null;
    return user.likedComments;
  }
}
