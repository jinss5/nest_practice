import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
  ) {}

  async getAllPosts() {
    const posts: Post[] = await this.postRepo.find();
    return posts;
  }

  async getPostById(id: number) {
    const post: Post = await this.postRepo.findOne({
      where: { id: id },
    });

    if (!post) {
      throw new NotFoundException(`Post with id: ${id} not found`);
    }

    return post;
  }

  async createPost(postData: CreatePostDto) {
    await this.postRepo.save(postData);
  }

  async deletePost(id: number) {
    await this.postRepo.delete(id);
  }

  async updatePost(id: number, updateData: UpdatePostDto) {
    await this.postRepo.update({ id }, updateData);
  }
}
