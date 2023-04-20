import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsController } from './blogs/blogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blogs/blogs.types';
import { BlogsService } from './blogs/blogs.service';
import { BlogsRepository } from './blogs/blogs.repository';
import { BlogsQueryRepository } from './blogs/blogs.query.repository';
import { CheckService } from './other.services/check.service';
import { PostsRepository } from './posts/posts.repository';
import { Post, PostSchema } from './posts/posts.types';
import { PostsQueryRepository } from './posts/posts.query.repository';
import { PostController } from './posts/posts.controller';
import { TestingService } from './all.data/test.service';
import { PostsService } from './posts/posts.service';
import { TestingController } from './all.data/testing.controller';
import { UsersService } from './users/users.service';
import { BcryptService } from './other.services/bcrypt.service';
import { UsersRepository } from './users/users.repository';
import { UsersController } from './users/users.controller';
import { User, UserSchema } from './users/users.types';
import { UsersQueryRepository } from './users/users.query.repository';
import { AuthService } from './authorization/auth.service';
const mongoUri = process.env.MONGO_URL;

@Module({
  imports: [
    MongooseModule.forRoot(mongoUri, { dbName: 'blogsAndPosts' }),
    MongooseModule.forFeature([
      {
        name: Blog.name,
        schema: BlogSchema,
      },
      {
        name: Post.name,
        schema: PostSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [
    AppController,
    BlogsController,
    PostController,
    UsersController,
    TestingController,
  ],
  providers: [
    AppService,
    BlogsService,
    PostsService,
    UsersService,
    BcryptService,
    CheckService,
    TestingService,
    AuthService,
    BlogsRepository,
    BlogsQueryRepository,
    PostsRepository,
    PostsQueryRepository,
    UsersRepository,
    UsersQueryRepository,
  ],
})
export class AppModule {}
