import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsController } from './blogs/blogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blogs/blogs.types';
import { BlogsService } from './blogs/blogs.service';
const mongoUri = process.env.MONGO_URL;

@Module({
  imports: [
    MongooseModule.forRoot(mongoUri),
    MongooseModule.forFeature([
      {
        name: Blog.name,
        schema: BlogSchema,
      },
    ]),
  ],
  controllers: [AppController, BlogsController],
  providers: [AppService, BlogsService],
})
export class AppModule {}
