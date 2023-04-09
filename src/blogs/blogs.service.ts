import { Injectable } from '@nestjs/common';
import { Blog, BlogDBType, BlogDocument } from './blogs.types';

import { BlogsRepository } from './blogs.repository';
import { Types } from 'mongoose';
import { UpdateBlogInputModelType } from './blogs.controller';

@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepository: BlogsRepository) {}
  async createBlog(blogCreateInputModel): Promise<string> {
    const blogDTO = new BlogDBType(
      new Types.ObjectId(),
      blogCreateInputModel.name,
      blogCreateInputModel.description,
      blogCreateInputModel.websiteUrl,
      new Date().toISOString(),
      false,
    );
    const newBlogsId = await this.blogsRepository.createBlog(blogDTO);
    return newBlogsId;
  }

  async updateBlogById(
    blogsId: string,
    blogUpdateInputModel: UpdateBlogInputModelType,
  ): Promise<boolean> {
    const blog = await this.blogsRepository.getBlogDBTypeById(blogsId);
    if (!blog) {
      return false;
    }
    (blog.name = blogUpdateInputModel.name),
      (blog.description = blogUpdateInputModel.description),
      (blog.websiteUrl = blogUpdateInputModel.websiteUrl);
    return await this.blogsRepository.saveBlog(blog);
  }
}
