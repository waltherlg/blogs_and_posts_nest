import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../blogs/blogs.repository';
import { PostsRepository } from '../posts/posts.repository';

@Injectable()
export class TestingService {
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly postsRepository: PostsRepository,
  ) {}
  async deleteAllData(): Promise<boolean> {
    await this.postsRepository.deleteAllPosts();
    await this.blogsRepository.deleteAllBlogs();
    return true;
  }
}
