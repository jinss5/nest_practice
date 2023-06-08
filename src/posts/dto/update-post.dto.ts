import { IsString, IsNumber, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {}

// export class UpdateMovieDto {
//     @IsString()
//     readonly title?: string;

//     @IsNumber()
//     readonly year?: number;

//     @IsString({ each: true })
//     readonly genres?: string[];
//   }
