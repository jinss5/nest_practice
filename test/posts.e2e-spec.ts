import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Post } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import { Post as PostEntity } from '../src/posts/entity/post.entity';
import { PostsModule } from '../src/posts/posts.module';
import { Category } from '../src/posts/entity/category.entity';
import { Repository } from 'typeorm';

describe('PostController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        PostsModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [PostEntity, Category, User],
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/posts (GET)', () => {
    return request(app.getHttpServer()).get('/posts').expect(200);
  });

  it('/posts/:id (GET)', () => {
    return request(app.getHttpServer()).get('/posts/1').expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
