import { BlogsRepository } from '../blogs/blogs.repository';
import { Injectable } from '@nestjs/common';
@Injectable()
export class CheckService {
  constructor(private readonly blogRepository: BlogsRepository) {}
  async isBlogExist(blogId): Promise<boolean> {
    const blog = await this.blogRepository.getBlogDBTypeById(blogId);
    return !!blog;
  }
}
