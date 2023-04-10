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

  it('01-04 /blogs POST  = 201 create new blog if all is OK', () => {
    return request(app.getHttpServer())
      .post('/blogs')
      .set('Authorization', `Basic ${basicAuthRight}`)
      .send({
        name: 'createdBlog6',
        description: 'newDescription6',
        websiteUrl: 'https://www.someweb6.com',
      })
      .expect(201);
  });
});
