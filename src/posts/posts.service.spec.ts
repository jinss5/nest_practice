import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { Post } from './entity/post.entity';
import { Category } from './entity/category.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { NotFoundException } from '@nestjs/common';

describe('PostsService', () => {
  let service: PostsService;
  let postRepository: Repository<Post>;
  let categoryRepository: Repository<Category>;

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
    categoryRepository = module.get<Repository<Category>>('CategoryRepository');
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
      relations: ['category', 'user'],
    });
  });

  it('SUCCESS: get one post', async () => {
    const mockPost: Post = {
      id: 1,
      title: 'Test Post',
      context: 'This is a test post',
      year: 2023,
      categoryId: 1,
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      category: new Category(),
      user: new User(),
    };

    jest.spyOn(postRepository, 'find').mockResolvedValueOnce([mockPost]);

    const result = await service.getPostById(1);

    expect(result).toEqual([mockPost]);
    expect(postRepository.find).toHaveBeenCalledWith({
      relations: ['category'],
      where: { id: 1 },
    });
  });

  it('FAILURE: get one post - not found', async () => {
    jest.spyOn(postRepository, 'find').mockResolvedValueOnce(undefined);

    await expect(service.getPostById(1)).rejects.toThrow(
      new NotFoundException('Post with id: 1 not found'),
    );
  });

  it('SUCCESS: create a post', async () => {
    const createPostDto: CreatePostDto = {
      title: 'Test Post',
      context: 'This is a test post',
      year: 2023,
      category: 'Test Category',
    };

    const mockCategory = new Category();
    mockCategory.id = 1;
    mockCategory.name = 'Test Category';

    const mockPost: Post = {
      id: 1,
      title: 'Test Post',
      context: 'This is a test post',
      year: 2023,
      categoryId: 1,
      userId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      category: mockCategory,
      user: new User(),
    };

    jest
      .spyOn(categoryRepository, 'findOneBy')
      .mockResolvedValueOnce(mockCategory);
    jest.spyOn(postRepository, 'save').mockResolvedValueOnce(mockPost);

    await service.createPost(createPostDto);

    expect(categoryRepository.findOneBy).toHaveBeenCalledWith({
      name: createPostDto.category,
    });

    expect(postRepository.save).toHaveBeenCalledWith({
      title: createPostDto.title,
      context: createPostDto.context,
      year: createPostDto.year,
      categoryId: mockCategory.id,
    });
  });

  it('SUCCESS: delete a post', async () => {
    const postId = 1;

    const deleteSpy = jest
      .spyOn(postRepository, 'delete')
      .mockResolvedValueOnce(undefined);

    await service.deletePost(postId);

    expect(deleteSpy).toHaveBeenCalledWith(postId);
  });

  it('SUCCESS: update a post', async () => {
    const postId = 1;
    const updateData: UpdatePostDto = {
      title: 'Updated Title',
      context: 'Updated Context',
      year: 2024,
      category: 'Updated Category',
    };

    const categoryData = new Category();
    categoryData.id = 1;
    categoryData.name = 'Updated Category';

    const findOneSpy = jest
      .spyOn(categoryRepository, 'findOneBy')
      .mockResolvedValueOnce(categoryData);

    const updateSpy = jest
      .spyOn(postRepository, 'update')
      .mockResolvedValueOnce(undefined);

    await service.updatePost(postId, updateData);

    expect(findOneSpy).toHaveBeenCalledWith({ name: updateData.category });
    expect(updateSpy).toHaveBeenCalledWith(
      { id: postId },
      {
        title: updateData.title,
        context: updateData.context,
        year: updateData.year,
        categoryId: categoryData.id,
      },
    );
  });
});
