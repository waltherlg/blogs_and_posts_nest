import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export class CommentDBType {
  constructor(
    public _id: Types.ObjectId,
    public parentType: string,
    public parentId: string,
    public content: string,
    public userId: string,
    public userLogin: string,
    public createdAt: string,
    public likesCount: number,
    public dislikesCount: number,
    public myStatus: string,
  ) {}
}

type CommentatorInfoType = {
  userId: string;
  userLogin: string;
};
type LikesInfoType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
};
export type CommentTypeOutput = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfoType;
  createdAt: string;
  likesInfo: LikesInfoType;
};

export type CommentDocument = HydratedDocument<Comment>;

export class Comment {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  _id: Types.ObjectId;
  @Prop()
  parentType: string;
  @Prop()
  parentId: string;
  @Prop()
  content: string;
  @Prop()
  userId: string;
  @Prop()
  userLogin: string;
  @Prop()
  createdAt: string;
  @Prop()
  likesCount: number;
  @Prop()
  dislikesCount: number;
  @Prop()
  myStatus: string;
  prepareCommentForOutput() {
    return {
      id: this._id.toString(),
      content: this.content,
      commentatorInfo: {
        userId: this.userId,
        userLogin: this.userLogin,
      },
      createdAt: this.createdAt,
      likesInfo: {
        likesCount: this.likesCount,
        dislikesCount: this.dislikesCount,
        myStatus: this.myStatus,
      },
    };
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.methods = {
  prepareCommentForOutput: Comment.prototype.prepareCommentForOutput,
};
