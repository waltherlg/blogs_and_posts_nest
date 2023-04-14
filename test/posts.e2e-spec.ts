import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Types } from 'mongoose';
import { endpoints } from './helpers/routing';

describe('PostsController (e2e)', () => {
  let app: INestApplication;

  const basicAuthRight = Buffer.from('admin:qwerty').toString('base64');
  const basicAuthWrongPassword = Buffer.from('admin:12345').toString('base64');
  const basicAuthWrongLogin = Buffer.from('12345:qwerty').toString('base64');

  const notExistingId = new Types.ObjectId();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  let createdBlogId: string;
  let createdPostId: string;

  it('00-00 testing/all-data DELETE = 204 removeAllData', async () => {
    await request(app.getHttpServer())
      .delete(endpoints.wipeAllData)
      .expect(204);
  });

  it('01-01 /posts GET = 200 return empty array with pagination', async () => {
    const createResponse = await request(app.getHttpServer())
      .get(endpoints.posts)
      .expect(200);
    const createdResponse = createResponse.body;

    expect(createdResponse).toEqual({
      pagesCount: 0,
      page: 1,
      pageSize: 10,
      totalCount: 0,
      items: [],
    });
  });

  it('01-02 /blogs POST  = 201 create new blog for testing posts', async () => {
    const testsResponse = await request(app.getHttpServer())
      .post(endpoints.blogs)
      .set('Authorization', `Basic ${basicAuthRight}`)
      .send({
        name: 'BlogForPosts',
        description: 'description BlogForPosts',
        websiteUrl: 'https://www.someweb.com',
      })
      .expect(201);

    const createdResponseOfFirstBlog = testsResponse.body;
    createdBlogId = createdResponseOfFirstBlog.id;

    expect(createdResponseOfFirstBlog).toEqual({
      id: createdBlogId,
      name: 'BlogForPosts',
      description: 'description BlogForPosts',
      websiteUrl: 'https://www.someweb.com',
      createdAt: expect.any(String),
      isMembership: false,
    });
  });

  it('01-02 /posts POST  = 201 create new post if all is OK', async () => {
    const testsResponse = await request(app.getHttpServer())
      .post(endpoints.posts)
      .set('Authorization', `Basic ${basicAuthRight}`)
      .send({
        title: 'newCreatedPost',
        shortDescription: 'newPostsShortDescription',
        content: 'some content',
        blogId: createdBlogId,
      })
      .expect(201);

    const createdResponseOfFirstPost = testsResponse.body;
    createdPostId = createdResponseOfFirstPost.id;

    expect(createdResponseOfFirstPost).toEqual({
      id: createdPostId,
      title: 'newCreatedPost',
      shortDescription: 'newPostsShortDescription',
      content: 'some content',
      blogId: createdBlogId,
      blogName: 'BlogForPosts',
      createdAt: expect.any(String),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    });
  });

  it('01-05 /posts GET = 200 return all Posts with pagination', async () => {
    const createResponse = await request(app.getHttpServer())
      .get(endpoints.posts)
      .expect(200);
    const createdResponse = createResponse.body;

    expect(createdResponse).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 1,
      items: [
        {
          id: createdPostId,
          title: 'newCreatedPost',
          shortDescription: 'newPostsShortDescription',
          content: 'some content',
          blogId: createdBlogId,
          blogName: 'BlogForPosts',
          createdAt: expect.any(String),
          extendedLikesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: 'None',
            newestLikes: [],
          },
        },
      ],
    });
  });

  it('01-06 /posts UPDATE = 204', async () => {
    const createResponse = await request(app.getHttpServer())
      .put(`${endpoints.posts}/${createdPostId}`)
      .set('Authorization', `Basic ${basicAuthRight}`)
      .send({
        title: 'updatedTitle',
        shortDescription: 'updatedShortDescription',
        content: 'updated some content',
      })
      .expect(204);
  });

  it('01-07 /posts GET = 200 return UPDATED post by id', async () => {
    const createResponse = await request(app.getHttpServer())
      .get(`${endpoints.posts}/${createdPostId}`)
      .expect(200);
    const createdResponse = createResponse.body;

    expect(createdResponse).toEqual({
      id: createdPostId,
      title: 'updatedTitle',
      shortDescription: 'updatedShortDescription',
      content: 'updated some content',
      blogId: createdBlogId,
      blogName: 'BlogForPosts',
      createdAt: expect.any(String),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    });
  });

  it('01-08 /posts DELETE = 204', async () => {
    const createResponse = await request(app.getHttpServer())
      .delete(`${endpoints.posts}/${createdPostId}`)
      .set('Authorization', `Basic ${basicAuthRight}`)
      .expect(204);
  });

  it('01-09 /posts GET = 404 not found deleted posts', async () => {
    const createResponse = await request(app.getHttpServer())
      .get(`${endpoints.posts}/${createdPostId}`)
      .expect(404);
  });

  let secondCreatedPostsId: string;

  it('01-10 /blogs POST = 201 create new post, using blogs controller', async () => {
    const testsResponse = await request(app.getHttpServer())
      .post(`${endpoints.blogs}/${createdBlogId}/posts`)
      .set('Authorization', `Basic ${basicAuthRight}`)
      .send({
        title: 'PostByBlogsId',
        shortDescription: 'newPosts created by BlogsController',
        content: 'some content',
      })
      .expect(201);

    const createdResponseOfSecondPost = testsResponse.body;
    secondCreatedPostsId = createdResponseOfSecondPost.id;

    expect(createdResponseOfSecondPost).toEqual({
      id: secondCreatedPostsId,
      title: 'PostByBlogsId',
      shortDescription: 'newPosts created by BlogsController',
      content: 'some content',
      blogId: createdBlogId,
      blogName: 'BlogForPosts',
      createdAt: expect.any(String),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    });
  });

  // it('01-05 /posts GET = 200 return ONE blog with pagination', async () => {
  //   const createResponse = await request(app.getHttpServer())
  //     .get(endpoints.blogs)
  //     .expect(200);
  //   const createdResponse = createResponse.body;
  //
  //   expect(createdResponse).toEqual({
  //     pagesCount: 1,
  //     page: 1,
  //     pageSize: 10,
  //     totalCount: 1,
  //     items: [
  //       {
  //         id: expect.any(String),
  //         name: 'createdBlog2',
  //         description: 'newDescription2',
  //         websiteUrl: 'https://www.someweb2.com',
  //         createdAt: expect.any(String),
  //         isMembership: false,
  //       },
  //     ],
  //   });
  // });
});
