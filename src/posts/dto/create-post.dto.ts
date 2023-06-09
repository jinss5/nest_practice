import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreatePostDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly context: string;

  @IsNumber()
  readonly year: number;

  @IsString()
  category: string;
}
