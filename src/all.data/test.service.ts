import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../blogs/blogs.repository';
import { PostsRepository } from '../posts/posts.repository';
import { UsersRepository } from '../users/users.repository';
import { UsersDevicesRepository } from '../usersDevices/usersDevicesRepository';

@Injectable()
export class TestingService {
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly postsRepository: PostsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly usersDeviceRepository: UsersDevicesRepository,
  ) {}
  async deleteAllData(): Promise<boolean> {
    await this.postsRepository.deleteAllPosts();
    await this.blogsRepository.deleteAllBlogs();
    await this.usersRepository.deleteAllUsers();
    await this.usersDeviceRepository.deleteAllUsersDevices();
    return true;
  }
}
