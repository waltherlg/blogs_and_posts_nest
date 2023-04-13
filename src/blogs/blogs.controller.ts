import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AppService } from '../app.service';
import { BlogsService } from './blogs.service';
import { BlogsRepository } from './blogs.repository';
import { BlogsQueryRepository } from './blogs.query.repository';
import {
  DEFAULT_BLOGS_QUERY_PARAMS,
  QueryParamsType,
  RequestBlogsQueryModel,
} from '../models/types';
import { Length, IsString, IsUrl } from 'class-validator';
import { CheckService } from '../other.services/check.service';

export class CreateBlogInputModelType {
  @IsString()
  @Length(1, 15)
  name: string;
  @IsString()
  @Length(1, 500)
  description: string;
  @IsUrl()
  websiteUrl: string;
}

export class UpdateBlogInputModelType {
  name: string;
  description: string;
  websiteUrl: string;
}
@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly appService: AppService,
    private readonly blogsService: BlogsService,
    private readonly checkService: CheckService,
    private readonly blogsRepository: BlogsRepository,
    private readonly blogsQueryRepository: BlogsQueryRepository,
  ) {}
  @Post()
  async createBlogs(@Body() blogCreateInputModel: CreateBlogInputModelType) {
    const newBlogsId = await this.blogsService.createBlog(blogCreateInputModel);
    return await this.blogsQueryRepository.getBlogById(newBlogsId);
  }

  @Get(':id')
  async getBlogById(@Param('id') blogsId: string) {
    const blog = await this.blogsQueryRepository.getBlogById(blogsId);
    if (!blog) {
      throw new NotFoundException([
        { message: 'blog not found', field: 'blog' },
      ]);
    }
    return blog;
  }

  @Put(':id')
  @HttpCode(204)
  async updateBlogById(
    @Param('id') blogsId: string,
    @Body() blogUpdateInputModel: UpdateBlogInputModelType,
  ) {
    return await this.blogsService.updateBlogById(
      blogsId,
      blogUpdateInputModel,
    );
  }
  @Delete(':id')
  async deleteBlogById(@Param('id') blogId: string) {
    const isBlogExist = this.checkService.isBlogExist(blogId);
    if (!isBlogExist) {
      throw new NotFoundException([
        { message: 'blog not found', field: 'blog' },
      ]);
    }
    return await this.blogsService.deleteBlogById(blogId);
  }

  @Get()
  async getAllBlogs(@Query() queryParams: RequestBlogsQueryModel) {
    const mergedQueryParams = { ...DEFAULT_BLOGS_QUERY_PARAMS, ...queryParams };
    return await this.blogsQueryRepository.getAllBlogs(mergedQueryParams);
  }
}
