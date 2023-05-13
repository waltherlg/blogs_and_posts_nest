import {
  Body,
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
  UnableException,
} from '../exceptions/custom.exceptions';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { th } from 'date-fns/locale';
import { IsString, Length } from 'class-validator';

export class UpdateCommentInputModelType {
  @IsString()
  @Length(20, 300)
  content: string;
}

export class SetLikeStatusInputModel {
  @IsString()
  likeStatus: string;
}

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
      request.user, //user = userId
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
    if (!isCommentDeleted){
      throw new UnableException('comment deleting')
    }
  }
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateCommentById(
    @Param('id') commentId: string,
    @Body() updateDTO: UpdateCommentInputModelType,
  ) {
    if (!(await this.checkService.isCommentExist(commentId))) {
      throw new CustomNotFoundException('comment');
    }
    const isUpdated = await this.commentsService.updateCommentById(
      commentId,
      updateDTO.content,
    );
    if (!isUpdated){
      throw new UnableException('comment update')
    } 
  }
  @Put(':id/like-status') 
  async setLikeStatusForComment(@Req() request, @Param('id') commentId: string,) {
    try {
        const isCommentExist = await this.commentsQueryRepo.getCommentById(req.params.commentsId.toString())
        console.log('isCommentExist ', isCommentExist)
        if (!isCommentExist) {
            res.sendStatus(404)
            return
        }
        const token = req.headers.authorization!.split(' ')[1]
        console.log('token ', token)
        const userId = await jwtService.getUserIdFromRefreshToken(token)
        console.log('userId ', userId)
        let updateCommentLike = await this.likeService.updateCommentLike(
            userId,
            req.params.commentsId.toString(),
            req.body.likeStatus)
        console.log('updateCommentLike ', updateCommentLike)
        if (updateCommentLike) {
            return res.sendStatus(204)
        } else {
            return res.status(400).send('not like')
        }
    } catch (error) {
        return res.status(405).send(`controller comment like status error: ${(error as any).message}`)
    }
}
}
