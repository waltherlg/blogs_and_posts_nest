import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './blogs.types';
import { Model } from 'mongoose';

const blogs = [
  {
    id: '698dcb38-5e7b-431f-a4c3-01454a994000',
    name: 'test blog 1',
    description: 'testing for id',
    websiteUrl: 'https://websiteUrlgoogle.com',
  },
  {
    id: '698dcb38-5e7b-431f-a4c3-01454a994001',
    name: 'test blog 2',
    description: 'testing for name',
    websiteUrl: 'https://websiteUrlgoogle.com',
  },
  {
    id: '698dcb38-5e7b-431f-a4c3-01454a994002',
    name: 'test blog 2',
    description: 'testing for some',
    websiteUrl: 'https://websiteUrlgoogle.com',
  },
];

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async createBlog(blogDTO);
}
