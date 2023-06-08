import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getAll() {
    return this.postsService.getAllPosts();
  }

  // @Get('search') // if /search is under /:id, the nest is going to think /search is /:id
  // search(@Query('year') seachingYear: string) {
  //   return `We are searching for a post made after: ${seachingYear}`;
  // }

  @Get('/:id')
  async getPostById(@Param('id') postId: number) {
    return this.postsService.getPostById(postId);
  }

  @Post()
  async createPost(@Body() postData: CreatePostDto) {
    return this.postsService.createPost(postData);
  }

  @Delete('/:id')
  async deletePost(@Param('id') postId: number) {
    return this.postsService.deletePost(postId);
  }

  @Patch('/:id')
  async updatePost(
    @Param('id') postId: number,
    @Body() updateData: UpdatePostDto,
  ) {
    this.postsService.updatePost(postId, updateData);
  }
}
