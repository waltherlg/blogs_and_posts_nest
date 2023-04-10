import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Types } from 'mongoose';

describe('BlogsController (e2e)', () => {
  let app: INestApplication;

  const basicAuthRight = Buffer.from('admin:qwerty').toString('base64');
  const basicAuthWrongPassword = Buffer.from('admin:12345').toString('base64');
  const basicAuthWrongLogin = Buffer.from('12345:qwerty').toString('base64');

  const notExistingId = new Types.ObjectId();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  let createdBlogId: string;

  it('01-04 /blogs POST  = 201 create new blog if all is OK', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/blogs')
      .set('Authorization', `Basic ${basicAuthRight}`)
      .send({
        name: 'createdBlog',
        description: 'newDescription',
        websiteUrl: 'https://www.someweb6.com',
      })
      .expect(201);

    const createdResponse = createResponse.body;
    createdBlogId = createdResponse.id;

    expect(createdResponse).toEqual({
      id: createdBlogId,
      name: 'createdBlog',
      description: 'newDescription',
      websiteUrl: 'https://www.someweb6.com',
      createdAt: createdResponse.createdAt,
      isMembership: false,
    });
  });

  it('01-05 /blogs GET = 200 return blog by id', async () => {
    const createResponse = await request(app.getHttpServer())
      .get(`/blogs/${createdBlogId}`)

      .expect(200);
    console.log('createdBlogId ', createdBlogId);
    const createdResponse = createResponse.body;

    expect(createdResponse).toEqual({
      id: createdBlogId,
      name: 'createdBlog',
      description: 'newDescription',
      websiteUrl: 'https://www.someweb6.com',
      createdAt: expect.any(String),
      isMembership: false,
    });
  });
});
