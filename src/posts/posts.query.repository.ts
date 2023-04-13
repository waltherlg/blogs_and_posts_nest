import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { PaginationOutputModel } from '../models/types';
import { PostDocument, PostTypeOutput, Post } from './posts.types';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async getPostById(postId): Promise<PostTypeOutput | null> {
    if (!Types.ObjectId.isValid(postId)) {
      return null;
    }
    const post = await this.postModel.findById(postId);
    if (!post) {
      return null;
    }
    return post.preparePostForOutput();
  }

  async getAllPosts(mergedQueryParams) {
    const postCount = await this.postModel.countDocuments({});
    const post = await this.postModel
      .find({})
      .skip(
        this.skipPage(mergedQueryParams.pageNumber, mergedQueryParams.pageSize),
      )
      .limit(+mergedQueryParams.pageSize)
      .sort({
        [mergedQueryParams.sortBy]: this.sortByDesc(
          mergedQueryParams.sortDirection,
        ),
      });

    const postsOutput = post.map((post: PostDocument) => {
      return post.preparePostForOutput();
    });
    const pageCount = Math.ceil(postCount / +mergedQueryParams.pageSize);

    const outputBlogs: PaginationOutputModel<PostTypeOutput> = {
      pagesCount: pageCount,
      page: +mergedQueryParams.pageNumber,
      pageSize: +mergedQueryParams.pageSize,
      totalCount: postCount,
      items: postsOutput,
    };
    return outputBlogs;
  }

  sortByDesc(sortDirection: string) {
    return sortDirection === 'desc' ? -1 : 1;
  }

  skipPage(pageNumber: string, pageSize: string): number {
    return (+pageNumber - 1) * +pageSize;
  }
}
