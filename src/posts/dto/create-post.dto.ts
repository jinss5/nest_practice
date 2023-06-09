import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreatePostDto {
  @IsString()
  readonly context: string;

  @IsNumber()
  readonly year: number;

  @IsString()
  category: string;

  // @IsOptional()
  // @IsString({ each: true })
  // readonly category: string[];
}
