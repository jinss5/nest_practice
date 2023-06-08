import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { AppController } from './app.controller';

@Module({
  imports: [PostsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
