import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsQueryRepository } from './comments.query.repository';
import { CheckService } from '../other.services/check.service';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import {
  BlogNotFoundException,
  CustomisableException,
  CustomNotFoundException,
} from '../exceptions/custom.exceptions';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { th } from 'date-fns/locale';

@Controller('comments')
export class CommentsControllers {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly checkService: CheckService,
  ) {}
  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  async getCommentById(@Req() request, @Param('id') commentId: string) {
    const comment = await this.commentsQueryRepository.getCommentById(
      commentId,
      request.user,
    );
    if (!comment) {
      throw new CustomNotFoundException('comment');
    }
    return comment;
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteCommentById(@Param('id') commentId: string) {
    if (!(await this.checkService.isCommentExist(commentId))) {
      throw new CustomNotFoundException('comment');
    }
    const isCommentDeleted = await this.commentsService.deleteCommentById(
      commentId,
    );
    return isCommentDeleted;
  }
  // @UseGuards(JwtAuthGuard)
  // @Put(':id')
  // async updateCommentById(@Param('id') commentId: string) {
  //   if (!(await this.checkService.isCommentExist(commentId))) {
  //     throw new CustomNotFoundException('comment');
  //   }
  //   const isUpdated = await this.commentsService.updateComment
  // }
}
