import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Post } from '../posts/posts.types';

export type CommentsLikeType = {
  commentsId: string;
  createdAt: Date;
  status: string;
};

export type PostsLikeType = {
  postsId: string;
  createdAt: Date;
  status: string;
};

export class UserDBType {
  constructor(
    public _id: Types.ObjectId,
    public login: string,
    public passwordHash: string,
    public email: string,
    public createdAt: string,
    public confirmationCode: string | null,
    public expirationDateOfConfirmationCode: Date | null,
    public isConfirmed: boolean,
    public passwordRecoveryCode: string | null,
    public expirationDateOfRecoveryCode: Date | null,
    public likedComments: Array<CommentsLikeType>,
    public likedPosts: Array<PostsLikeType>,
  ) {}
}

export type UserDocument = HydratedDocument<User>;
@Schema()
export class User {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  _id: Types.ObjectId;
  @Prop()
  login: string;
  @Prop()
  passwordHash: string;
  @Prop()
  email: string;
  @Prop()
  createdAt: string;
  @Prop()
  confirmationCode: string | null;
  @Prop()
  expirationDateOfConfirmationCode: Date | null;
  @Prop()
  isConfirmed: boolean;
  @Prop()
  passwordRecoveryCode: string | null;
  @Prop()
  expirationDateOfRecoveryCode: Date | null;
  @Prop()
  likedComments: Array<CommentsLikeType>;
  @Prop()
  likedPosts: Array<PostsLikeType>;
}
export const UserSchema = SchemaFactory.createForClass(User);

export type UserTypeOutput = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};
