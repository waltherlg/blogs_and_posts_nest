import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommentDocument, CommentTypeOutput, Comment } from './comments.types';
import { User, UserDocument } from '../users/users.types';
import { Injectable } from '@nestjs/common';
@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}
  async getCommentById(
    commentId: string,
    userId?: string,
  ): Promise<CommentTypeOutput | null> {
    if (!Types.ObjectId.isValid(commentId)) {
      return null;
    }
    const comment: CommentDocument = await this.commentModel.findById(
      commentId,
    );
    if (!comment) {
      return null;
    }
    if (userId && Types.ObjectId.isValid(userId)) {
      const user = await this.userModel.findById(userId);
      if (user) {
        const likedComment = user.likedComments.find(
          (e) => e.commentsId === commentId,
        );
        if (likedComment) {
          comment.myStatus = likedComment.status;
        }
      }
    }
    return comment.prepareCommentForOutput();
  }
}
