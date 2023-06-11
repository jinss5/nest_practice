import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { Post } from './entity/post.entity';
import { Category } from './entity/category.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';

describe('PostsService', () => {
  let service: PostsService;
  let postRepository: Repository<Post>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: 'PostRepository', // Use the repository token
          useClass: Repository, // Mock the repository class
        },
        {
          provide: 'CategoryRepository', // Use the repository token
          useClass: Repository, // Mock the repository class
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postRepository = module.get<Repository<Post>>('PostRepository'); // Inject the repository token
  });

  it('SUCCESS: get all post', async () => {
    const mockPosts: Post[] = [
      {
        id: 1,
        title: 'Test Post 1',
        context: 'This is test post 1',
        year: 2023,
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1,
        category: new Category(),
        user: new User(),
      },
      {
        id: 2,
        title: 'Test Post 2',
        context: 'This is test post 2',
        year: 2024,
        categoryId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 2,
        category: new Category(),
        user: new User(),
      },
    ];

    jest.spyOn(postRepository, 'find').mockResolvedValueOnce(mockPosts);

    const result = await service.getAllPosts();

    expect(result).toEqual(mockPosts);
    expect(postRepository.find).toHaveBeenCalledWith({
      relations: ['category'],
    });
  });
});
