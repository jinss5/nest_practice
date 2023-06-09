import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './domain/post.entity';
import { Category } from './domain/category.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectRepository(Category) private readonly catRepo: Repository<Category>,
  ) {}

  async getAllPosts() {
    const posts: Post[] = await this.postRepo.find();
    return posts;
  }

  async filter(category: string, year: number) {
    let whereCondition: any = {};

    if (category) {
      const categoryId: number = (
        await this.catRepo.findOneBy({ name: category })
      ).id;

      whereCondition.categoryId = categoryId;
    }

    if (year) {
      whereCondition.year = year;
    }

    const posts = await this.postRepo.find({
      where: whereCondition,
    });

    return posts;
  }

  async getPostById(id: number) {
    const post: Post = await this.postRepo.findOneBy({ id });

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
      context: postData.context,
      year: postData.year,
      categoryId: categoryData.id,
    });
  }

  async deletePost(id: number) {
    await this.postRepo.delete(id);
  }

  async updatePost(id: number, updateData: UpdatePostDto) {
    const categoryData = await this.catRepo.findOneBy({
      name: updateData.category,
    });

    await this.postRepo.update(
      { id },
      {
        context: updateData.context,
        year: updateData.year,
        categoryId: categoryData.id,
      },
    );
  }
}
