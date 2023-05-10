import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentDocument, Comment, CommentDBType } from './comments.types';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}
  async createComment(CommentDTO: CommentDBType): Promise<string> {
    const comment = new this.commentModel(CommentDTO);
    await comment.save();
    return comment._id.toString();
  }
}
