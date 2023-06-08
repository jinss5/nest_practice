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
import { Post as PostEntity } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getAll(): PostEntity[] {
    return this.postsService.getAll();
  }

  @Get('search') // if /search is under /:id, the nest is going to think /search is /:id
  search(@Query('year') seachingYear: string) {
    return `We are searching for a post made after: ${seachingYear}`;
  }

  @Get('/:id')
  getOne(@Param('id') postId: number): PostEntity {
    return this.postsService.getOne(postId);
  }

  @Post()
  create(@Body() postData: CreatePostDto) {
    this.postsService.create(postData);
  }

  @Delete('/:id')
  remove(@Param('id') postId: number) {
    return this.postsService.deleteOne(postId);
  }

  @Patch()
  update(@Param('id') postId: number, @Body() updateData: UpdatePostDto) {
    this.postsService.update(postId, updateData);
  }
}
