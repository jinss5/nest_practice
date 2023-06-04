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

@Controller('movies')
export class MoviesController {
  @Get()
  getAll() {
    return 'this will return all movies';
  }

  @Get('search')
  search(@Query('year') seachingYear: string) {
    return `We are searching for a movie made after: ${seachingYear}`;
  }

  @Get('/:id')
  getOne(@Param('id') movieId: string) {
    return `this will return one movie: ${movieId}`;
  }

  @Post()
  create(@Body() movieData) {
    return movieData;
  }

  @Delete('/:id')
  remove(@Param('id') movieId: string) {
    return `this will delete movie: ${movieId}`;
  }

  @Patch()
  update(@Param('id') movieId: string, @Body() updateData) {
    return {
      updatedMovie: movieId,
      ...updateData,
    };
  }
}
