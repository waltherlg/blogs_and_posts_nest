import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommentDocument, Comment, CommentDBType } from './comments.types';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}
  async createComment(commentDTO: CommentDBType): Promise<string> {
    console.log('CommentDTO ', commentDTO);
    const comment = new this.commentModel(commentDTO);
    console.log('comment ', comment);
    await comment.save();
    return comment._id.toString();
  }

  async getCommentDbTypeById(commentId) {
    if (!Types.ObjectId.isValid(commentId)) {
      return null;
    }
    const comment: CommentDocument = await this.commentModel.findById(
      commentId,
    );
    if (!comment) {
      return null;
    }
    return comment;
  }
  async deleteCommentById(commentId): Promise<boolean> {
    if (!Types.ObjectId.isValid(commentId)) {
      return false;
    }
    const isDeleted = await this.commentModel.deleteOne({ _id: commentId });
    return !!isDeleted;
  }

  async updateCommentById(commentId, content): Promise<boolean> {
    if (!Types.ObjectId.isValid(commentId)) {
      return false;
    }
    const comment: CommentDocument = await this.commentModel.findById(
      commentId,
    );
    if (!comment) {
      return false;
    }
    comment.content = content;
    const result = await comment.save();
    return !!result;
  }
}
