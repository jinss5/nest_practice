import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { Category } from './entity/category.entity';
import { User } from '../users/entities/user.entity';

describe('PostsService', () => {
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: '127.0.0.1',
          port: 3306,
          username: 'root',
          password: 'password',
          database: 'nest_test',
          entities: [Post, Category, User],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Post, Category]),
      ],
      providers: [PostsService],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('SUCCESS: created post', async () => {
    const result = await service.getAllPosts();
    expect(result).toBeInstanceOf(Array);
  });
});
