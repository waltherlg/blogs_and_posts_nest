import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../blogs/blogs.repository';
import { PostsRepository } from '../posts/posts.repository';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class TestingService {
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly postsRepository: PostsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}
  async deleteAllData(): Promise<boolean> {
    await this.postsRepository.deleteAllPosts();
    await this.blogsRepository.deleteAllBlogs();
    await this.usersRepository.deleteAllUsers();
    return true;
  }
}
