import { BlogsRepository } from '../blogs/blogs.repository';
import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../posts/posts.repository';
@Injectable()
export class CheckService {
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly postsRepository: PostsRepository,
  ) {}
  async isBlogExist(blogId): Promise<boolean> {
    const blog = await this.blogsRepository.getBlogDBTypeById(blogId);
    return !!blog;
  }

  async isPostExist(postId): Promise<boolean> {
    const post = await this.postsRepository.getPostDBTypeById(postId);
    return !!post;
  }
}
