import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put, Query
} from "@nestjs/common";
import { AppService } from '../app.service';
import { BlogsService } from './blogs.service';
import { BlogsRepository } from './blogs.repository';
import { BlogsQueryRepository } from './blogs.query.repository';
import { DEFAULT_QUERY_PARAMS, QueryParamsType } from "../models/types";

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly appService: AppService,
    private readonly blogsService: BlogsService,
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
    return await this.blogsQueryRepository.getBlogById(blogsId);
  }

  @Put(':id')
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
    return await this.blogsService.deleteBlogById(blogId);
  }

  @Get()
  async getAllBlogs(@Query() queryParams: QueryParamsType = DEFAULT_QUERY_PARAMS){
    const allBlogs = await this.blogsQueryRepository.getAllBlogs(queryParams)
  }
}

export type CreateBlogInputModelType = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type UpdateBlogInputModelType = {
  name: string;
  description: string;
  websiteUrl: string;
};
