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
