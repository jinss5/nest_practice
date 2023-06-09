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
import { Post as PostEntity } from './entity/post.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getAll(): Promise<PostEntity[]> {
    return this.postsService.getAllPosts();
  }

  @Get('filter') // if /filter is under /:id, nest is going to think /filter is /:id
  async filter(
    @Query('category') category: string,
    @Query('year') year: number,
    @Query('orderBy') orderBy: string,
  ): Promise<PostEntity[]> {
    return this.postsService.filter(category, year, orderBy);
  }

  @Get('/:id')
  async getPostById(@Param('id') postId: number): Promise<PostEntity[]> {
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
    return this.postsService.updatePost(postId, updateData);
  }
}
