import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsQueryRepository } from './comments.query.repository';
import { CheckService } from '../other.services/check.service';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

@Controller('comments')
export class CommentsControllers {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly checkService: CheckService,
  ) {}
  // @UseGuards(OptionalJwtAuthGuard)
  // @Get(':id')
  // async getCommentById(@Param())
}
