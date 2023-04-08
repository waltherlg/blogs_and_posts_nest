import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDBType, BlogDocument } from './blogs.types';
import { Model } from 'mongoose';
import { BlogsRepository } from './blogs.repository';

@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepository: BlogsRepository) {}
  async createBlog(blogInputModel) {
    const blogDTO = new BlogDBType(
      new ObjectId(),
      blogInputModel.name,
      blogInputModel.description,
      blogInputModel.websiteUrl,
      new Date().toISOString(),
      false,
    );
  }
}
