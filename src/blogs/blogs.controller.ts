import {
  Body,
  Controller,
  Delete,
  Get,
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

  // @Get()
  // async getAllBlogs(
  //   @Query('searchNameTerm') searchNameTerm = '',
  //   @Query('sortBy') sortBy = 'createdAt',
  //   @Query('sortDirection') sortDirection = 'desc',
  //   @Query('pageNumber') pageNumber = '1',
  //   @Query('pageSize') pageSize = '10',
  // ) {
  //   const queryParams: RequestBlogsQueryModel = {
  //     searchNameTerm,
  //     sortBy,
  //     sortDirection,
  //     pageNumber,
  //     pageSize,
  //   };
  //
  //   return await this.blogsQueryRepository.getAllBlogs(queryParams);
  // }
  @Get()
  async getAllBlogs(@Query() queryParams: RequestBlogsQueryModel) {
    const mergedQueryParams = { ...DEFAULT_BLOGS_QUERY_PARAMS, ...queryParams };
    return await this.blogsQueryRepository.getAllBlogs(mergedQueryParams);
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
