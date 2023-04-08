import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from '../app.service';
import { BlogsService } from './blogs.service';
import { BlogsRepository } from './blogs.repository';
import { BlogsQueryRepository } from './blogs.query.repository';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly appService: AppService,
    private readonly blogsService: BlogsService,
    private readonly blogsRepository: BlogsRepository,
    private readonly blogsQueryRepository: BlogsQueryRepository,
  ) {}
  @Post()
  async createBlogs(@Body() blogInputModel: CreateBlogInputModelType) {
    const newBlogsId = await this.blogsService.createBlog(blogInputModel);
    return await this.blogsQueryRepository.getBlogById(newBlogsId);
  }

  @Get(':id')
  async getBlogById(@Param('id') blogId: string) {
    return await this.blogsQueryRepository.getBlogById(blogId);
  }
}

export type CreateBlogInputModelType = {
  name: string;
  description: string;
  websiteUrl: string;
};
