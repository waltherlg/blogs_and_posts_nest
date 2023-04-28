import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AppService } from '../app.service';
import { BlogsService } from './blogs.service';
import { BlogsRepository } from './blogs.repository';
import { BlogsQueryRepository } from './blogs.query.repository';
import {
  DEFAULT_BLOGS_QUERY_PARAMS,
  RequestQueryParamsModel,
  RequestBlogsQueryModel,
  DEFAULT_QUERY_PARAMS,
} from '../models/types';
import { Length, IsString, IsUrl } from 'class-validator';
import { CheckService } from '../other.services/check.service';
import { PostsService } from '../posts/posts.service';
import { PostsQueryRepository } from '../posts/posts.query.repository';

import {
  BlogNotFoundException,
  CustomisableException,
} from '../exceptions/custom.exceptions';
import { BasicAuthGuard } from '../auth/guards/auth.guards';

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

export class CreatePostByBlogsIdInputModelType {
  @IsString()
  @Length(1, 30)
  title: string;
  @IsString()
  @Length(1, 100)
  shortDescription: string;
  @IsString()
  @Length(1, 1000)
  content: string;
}
@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly appService: AppService,
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
    private readonly checkService: CheckService,
    private readonly blogsRepository: BlogsRepository,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}
  @UseGuards(BasicAuthGuard)
  @Post()
  async createBlogs(@Body() blogCreateInputModel: CreateBlogInputModelType) {
    const newBlogsId = await this.blogsService.createBlog(blogCreateInputModel);
    return await this.blogsQueryRepository.getBlogById(newBlogsId);
  }

  @Get(':id')
  async getBlogById(@Param('id') blogsId: string) {
    const blog = await this.blogsQueryRepository.getBlogById(blogsId);
    if (!blog) {
      throw new CustomisableException('blog', 'blog not found 400', 400);
    }
    return blog;
  }
  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(204)
  async updateBlogById(
    @Param('id') blogsId: string,
    @Body() blogUpdateInputModel: UpdateBlogInputModelType,
  ) {
    // check is blog exist in blogService
    return await this.blogsService.updateBlogById(
      blogsId,
      blogUpdateInputModel,
    );
  }
  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteBlogById(@Param('id') blogId: string) {
    const isBlogExist = await this.checkService.isBlogExist(blogId);
    if (!isBlogExist) {
      throw new BlogNotFoundException();
    }
    return await this.blogsService.deleteBlogById(blogId);
  }

  @Get()
  async getAllBlogs(@Query() queryParams: RequestBlogsQueryModel) {
    const mergedQueryParams = { ...DEFAULT_BLOGS_QUERY_PARAMS, ...queryParams };
    return await this.blogsQueryRepository.getAllBlogs(mergedQueryParams);
  }
  @UseGuards(BasicAuthGuard)
  @Post(':id/posts')
  async createPostByBlogsId(
    @Param('id') blogId: string,
    @Body() inputPostCreateModel: CreatePostByBlogsIdInputModelType,
  ) {
    const postCreateModel = { ...inputPostCreateModel, blogId: blogId };
    //check is blog exist in post service
    const createdPostId = await this.postsService.createPost(postCreateModel);
    return await this.postsQueryRepository.getPostById(createdPostId);
  }

  @Get(':id/posts')
  async getAllPostsByBlogsId(
    @Param('id') blogId: string,
    @Query() queryParams: RequestQueryParamsModel,
  ) {
    // if (!(await this.checkService.isBlogExist(blogId))) {
    //   throw new BlogNotFoundException();
    // }
    await this.isBlogExist(blogId);
    const mergedQueryParams = { ...DEFAULT_QUERY_PARAMS, ...queryParams };
    return await this.postsQueryRepository.getAllPostsByBlogsId(
      mergedQueryParams,
      blogId,
    );
  }
  async isBlogExist(blogId) {
    if (!(await this.checkService.isBlogExist(blogId))) {
      throw new BlogNotFoundException();
    }
  }
}
