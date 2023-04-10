import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDBType, BlogDocument, BlogTypeOutput } from './blogs.types';
import { HydratedDocument, Model, Types } from 'mongoose';
import { PaginationOutputModel } from '../models/types';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async getBlogById(blogId): Promise<BlogTypeOutput | null> {
    if (!Types.ObjectId.isValid(blogId)) {
      return null;
    }
    const blog = await this.blogModel.findById(blogId);
    if (!blog) {
      return null;
    }
    return blog.prepareBlogForOutput();
  }

  async getAllBlogs(queryParams) {
    const blogsCount = await this.blogModel.countDocuments({
      name: new RegExp(queryParams.searchNameTerm, 'gi'),
    });
    let blogs;
    if (queryParams.searchNameTerm !== 'null') {
      blogs = await this.blogModel
        .find({ name: new RegExp(queryParams.searchNameTerm, 'gi') })
        .skip(this.skipPage(queryParams.pageNumber, queryParams.pageSize))
        .limit(+queryParams.pageSize)
        .sort({
          [queryParams.sortBy]: this.sortByDesc(queryParams.sortDirection),
        });
    } else {
      blogs = await this.blogModel
        .find({})
        .skip(this.skipPage(queryParams.pageNumber, queryParams.pageSize))
        .limit(+queryParams.pageSize)
        .sort({
          [queryParams.sortBy]: this.sortByDesc(queryParams.sortDirection),
        });
    }
    const blogsOutput = blogs.map((blog: HydratedDocument<Blog>) => {
      return blog.prepareBlogForOutput();
    });
    const pageCount = Math.ceil(blogsCount / +queryParams.pageSize);

    const outputBlogs: PaginationOutputModel<BlogTypeOutput> = {
      pagesCount: pageCount,
      page: +queryParams.pageNumber,
      pageSize: +queryParams.pageSize,
      totalCount: blogsCount,
      items: blogsOutput,
    };
    return outputBlogs;
  }

  sortByDesc(sortDirection: string) {
    return sortDirection === 'desc' ? -1 : 1;
  }

  skipPage(pageNumber: string, pageSize: string): number {
    return (+pageNumber - 1) * +pageSize;
  }
}
