import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './entity/post.entity';
import { Category } from './entity/category.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectRepository(Category) private readonly catRepo: Repository<Category>,
  ) {}

  async getAllPosts() {
    const posts: Post[] = await this.postRepo.find({
      relations: ['category', 'user'],
    });

    const postsWithoutPw = instanceToPlain(posts, {
      excludePrefixes: ['password'],
    });

    return postsWithoutPw;
  }

  async filter(
    category: string,
    year: number,
    orderBy: string,
    page: number,
    pageSize: number,
  ) {
    let whereCondition: any = {};
    let orderCondition: any = {};
    let limitCondition: any = {};

    if (category) {
      const categoryId: number = (
        await this.catRepo.findOneBy({ name: category })
      ).id;

      whereCondition.categoryId = categoryId;
    }

    if (year) whereCondition.year = year;

    switch (orderBy) {
      case 'recent':
        orderCondition.createdAt = 'DESC';
        break;
      case 'old':
        orderCondition.createdAt = 'ASC';
        break;
      case 'yearUp':
        orderCondition.year = 'ASC';
        break;
      case 'yearDown':
        orderCondition.year = 'DESC';
        break;
    }

    if (page && pageSize) {
      limitCondition.skip = (page - 1) * pageSize;
      limitCondition.take = pageSize;
    }

    return await this.postRepo.find({
      relations: ['category'],
      where: whereCondition,
      order: orderCondition,
      skip: limitCondition.skip,
      take: limitCondition.take,
    });
  }

  async getPostById(id: number) {
    const post: Post[] = await this.postRepo.find({
      relations: ['category'],
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post with id: ${id} not found`);
    }

    return post;
  }

  async createPost(postData: CreatePostDto) {
    const categoryData = await this.catRepo.findOneBy({
      name: postData.category,
    });

    await this.postRepo.save({
      title: postData.title,
      context: postData.context,
      year: postData.year,
      categoryId: categoryData.id,
      userId: postData.userId,
    });
  }

  async deletePost(id: number) {
    const post: Post = await this.postRepo.findOneBy({ id });

    if (!post) {
      throw new NotFoundException(`Post with id: ${id} not found`);
    }

    await this.postRepo.delete(id);
  }

  async updatePost(id: number, updateData: UpdatePostDto) {
    const categoryData: Category = await this.catRepo.findOneBy({
      name: updateData.category,
    });

    await this.postRepo.update(
      { id },
      {
        title: updateData.title,
        context: updateData.context,
        year: updateData.year,
        categoryId: categoryData.id,
      },
    );
  }
}
