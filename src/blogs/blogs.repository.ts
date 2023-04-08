import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogTypeOutput } from './blogs.types';
import { Model, Types } from 'mongoose';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async createBlog(blogDTO): Promise<string> {
    const newBlog = new this.blogModel(blogDTO);
    await newBlog.save();
    return newBlog._id.toString();
  }

  async getBlogDBTypeById(blogId): Promise<BlogTypeOutput | null> {
    if (!Types.ObjectId.isValid(blogId)) {
      return null;
    }
    const blog = await this.blogModel.findById(blogId);
    if (!blog) {
      return null;
    }
    return blog.prepareBlogForOutput();
  }
}
