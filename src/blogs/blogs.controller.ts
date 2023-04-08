import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { AppService } from '../app.service';
import { BlogsService } from './blogs.service';
const blogs = [
  {
    id: '698dcb38-5e7b-431f-a4c3-01454a994000',
    name: 'test blog 1',
    description: 'testing for id',
    websiteUrl: 'https://websiteUrlgoogle.com',
  },
  {
    id: '698dcb38-5e7b-431f-a4c3-01454a994001',
    name: 'test blog 2',
    description: 'testing for name',
    websiteUrl: 'https://websiteUrlgoogle.com',
  },
  {
    id: '698dcb38-5e7b-431f-a4c3-01454a994002',
    name: 'test blog 2',
    description: 'testing for some',
    websiteUrl: 'https://websiteUrlgoogle.com',
  },
];
@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly appService: AppService,
    private readonly blogsService: BlogsService,
  ) {}
  @Post()
  async createBlogs(@Body() blogInputModel: CreateBlogInputModelType) {
    const newBlogsId = await this.blogsService.createBlog(blogInputModel);

    return newBlogsId;
  }

  @Get()
  getAllBlogs() {
    return blogs;
  }

  @Get(':id')
  getBlogById(@Param('id') blogId: string) {
    const blog = blogs.find((b) => b.id === blogId);
    return blog;
  }
}

export type CreateBlogInputModelType = {
  name: string;
  description: string;
  websiteUrl: string;
};
