import { Injectable } from '@nestjs/common';
import { Blog, BlogDBType, BlogDocument } from './blogs.types';

import { BlogsRepository } from './blogs.repository';
import { Types } from 'mongoose';

@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepository: BlogsRepository) {}
  async createBlog(blogInputModel): Promise<string> {
    const blogDTO = new BlogDBType(
      new Types.ObjectId(),
      blogInputModel.name,
      blogInputModel.description,
      blogInputModel.websiteUrl,
      new Date().toISOString(),
      false,
    );
    const newBlogsId = await this.blogsRepository.createBlog(blogDTO);
    return newBlogsId;
  }
}
