import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogTypeOutput } from './blogs.types';
import { Model, Types } from 'mongoose';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async getBlogById(blogId): Promise<BlogTypeOutput | null> {
    if (!Types.ObjectId.isValid(blogId)) {
      return null;
    }
    const blog = await this.blogModel.findById(blogId);
    if (!blog) {
      return null;
    }
    return blog.prepareBlogForOutput();
  }

  async getAllBlogs(queryParams){}
}
