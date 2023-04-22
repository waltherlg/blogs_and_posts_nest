import { BlogsRepository } from '../blogs/blogs.repository';
import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../posts/posts.repository';
import { UsersRepository } from '../users/users.repository';
@Injectable()
export class CheckService {
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly postsRepository: PostsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}
  async isBlogExist(blogId): Promise<boolean> {
    const blog = await this.blogsRepository.getBlogDBTypeById(blogId);
    return !!blog;
  }

  async isPostExist(postId): Promise<boolean> {
    const post = await this.postsRepository.getPostDBTypeById(postId);
    return !!post;
  }

  async isConfirmationCodeExist(code: string): Promise<boolean> {
    const user = await this.usersRepository.getUserByConfirmationCode(code);
    return !!user;
  }

  async isEmailConfirmed(email: string): Promise<boolean> {
    const user = await this.usersRepository.findUserByLoginOrEmail(email);
    return user!.isConfirmed;
  }

  async isEmailExist(email: string): Promise<boolean> {
    const emailExist = await this.usersRepository.findUserByLoginOrEmail(email);
    return !!emailExist;
  }

  async isLoginExist(login: string): Promise<boolean> {
    const emailExist = await this.usersRepository.findUserByLoginOrEmail(login);
    return !!emailExist;
  }

  async isCodeConfirmed(code: string): Promise<boolean> {
    const user = await this.usersRepository.getUserByConfirmationCode(code);
    return user!.isConfirmed;
  }

  async isRecoveryCodeExist(code: string): Promise<boolean> {
    const isExist = await this.usersRepository.getUserByPasswordRecoveryCode(
      code,
    );
    return !!isExist;
  }
}
