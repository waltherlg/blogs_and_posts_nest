import { PostsRepository } from './posts.repository';
import { CheckService } from '../other.services/check.service';

export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly checkService: CheckService,
  ) {}
}
