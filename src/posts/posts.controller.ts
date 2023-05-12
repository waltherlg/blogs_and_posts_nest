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
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppService } from '../app.service';
import { RequestQueryParamsModel, DEFAULT_QUERY_PARAMS } from '../models/types';
import { Length, IsString, IsUrl } from 'class-validator';
import { CheckService } from '../other.services/check.service';
import { PostsService } from './posts.service';
import { PostsRepository } from './posts.repository';
import { PostsQueryRepository } from './posts.query.repository';

import {
  CustomNotFoundException,
  PostNotFoundException,
  UnableException,
} from '../exceptions/custom.exceptions';
import { BasicAuthGuard } from '../auth/guards/auth.guards';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommentsService } from '../comments/comments.service';
import { CommentsQueryRepository } from '../comments/comments.query.repository';

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
export class CreateCommentInputModelType {
  @IsString()
  @Length(20, 300)
  content: string;
}
@Controller('posts')
export class PostController {
  constructor(
    private readonly appService: AppService,
    private readonly postsService: PostsService,
    private readonly checkService: CheckService,
    private readonly commentService: CommentsService,
    private readonly postsRepository: PostsRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}
  @UseGuards(BasicAuthGuard)
  @Post()
  async createPost(@Body() postCreateInputModel: CreatePostInputModelType) {
    const newPostId = await this.postsService.createPost(postCreateInputModel);
    const newPost = await this.postsQueryRepository.getPostById(newPostId);
    if(!newPost){
      throw new UnableException('post creating')
    }
    return newPost
  }
  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  async getPostById(@Param('id') postId: string) {
    const post = await this.postsQueryRepository.getPostById(postId);
    if (!post) {
      throw new PostNotFoundException();
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
    if (!(await this.checkService.isPostExist(postId))) {
      throw new PostNotFoundException();
    }
    const result = await this.postsService.updatePostById(postId, postUpdateInputModel);
    if(!result){
      throw new UnableException('post updating')
    }
  }
  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deletePostById(@Param('id') postId: string) {
    if (!(await this.checkService.isPostExist(postId))) {
      throw new PostNotFoundException();
    }
    const result = await this.postsService.deletePostById(postId);
    if(!result){
      throw new UnableException('post deleting')
    }
  }
  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async getAllPosts(
    @Req() request,
    @Query() queryParams: RequestQueryParamsModel,
  ) {
    const mergedQueryParams = { ...DEFAULT_QUERY_PARAMS, ...queryParams };
    console.log('request.user ', request.user);
    return await this.postsQueryRepository.getAllPosts(
      mergedQueryParams,
      request.user,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  async createCommentByPostId(
    @Req() request,
    @Param('id') postId: string,
    @Body() content: CreateCommentInputModelType,
  ) {
    if (!(await this.checkService.isPostExist(postId))) {
      throw new CustomNotFoundException('post');
    }
    const newCommentId = await this.commentService.createComment(
      postId,
      content.content,
      request.user,
    );
    const newComment = await this.commentsQueryRepository.getCommentById(
      newCommentId,
    );
    if(!newComment){
      throw new UnableException('comment creating')
    }
    return newComment;
  }
}
