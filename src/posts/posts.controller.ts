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
import { RequestQueryParamsModel, DEFAULT_QUERY_PARAMS } from '../models/types';
import { Length, IsString, IsUrl } from 'class-validator';
import { CheckService } from '../other.services/check.service';
import { PostsService } from './posts.service';
import { PostsRepository } from './posts.repository';
import { PostsQueryRepository } from './posts.query.repository';
import { BasicAuthGuard } from '../guards/auth.guards';

export class CreatePostInputModelType {
  @IsString()
  @Length(1, 30)
  title: string;
  @IsString()
  @Length(1, 100)
  shortDescription: string;
  @IsString()
  @Length(1, 1000)
  content: string;
  @IsString()
  @Length(1, 100)
  blogId: string;
}

export class UpdatePostInputModelType {
  @IsString()
  @Length(1, 30)
  title: string;
  @IsString()
  @Length(1, 100)
  shortDescription: string;
  @IsString()
  @Length(1, 1000)
  content: string;
  @IsString()
  @Length(1, 100)
  blogId: string;
}
@Controller('posts')
export class PostController {
  constructor(
    private readonly appService: AppService,
    private readonly postsService: PostsService,
    private readonly checkService: CheckService,
    private readonly postsRepository: PostsRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}
  @UseGuards(BasicAuthGuard)
  @Post()
  async createPost(@Body() postCreateInputModel: CreatePostInputModelType) {
    const newPostId = await this.postsService.createPost(postCreateInputModel);
    return await this.postsQueryRepository.getPostById(newPostId);
  }

  @Get(':id')
  async getPostById(@Param('id') postId: string) {
    const post = await this.postsQueryRepository.getPostById(postId);
    if (!post) {
      throw new NotFoundException([
        { message: 'post not found', field: 'post' },
      ]);
    }
    return post;
  }
  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(204)
  async updatePostById(
    @Param('id') postId: string,
    @Body() postUpdateInputModel: UpdatePostInputModelType,
  ) {
    return await this.postsService.updatePostById(postId, postUpdateInputModel);
  }
  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deletePostById(@Param('id') postId: string) {
    const isPostExist = this.checkService.isPostExist(postId);
    if (!isPostExist) {
      throw new NotFoundException([
        { message: 'post not found', field: 'post' },
      ]);
    }
    return await this.postsService.deletePostById(postId);
  }

  @Get()
  async getAllPosts(@Query() queryParams: RequestQueryParamsModel) {
    const mergedQueryParams = { ...DEFAULT_QUERY_PARAMS, ...queryParams };
    return await this.postsQueryRepository.getAllPosts(mergedQueryParams);
  }
}
