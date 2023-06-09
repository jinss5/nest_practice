import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './posts/posts.module';
import { AppController } from './app.controller';
import { Post } from './posts/domain/post.entity';
import { Category } from './posts/domain/category.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'nest',
      entities: [Post, Category],
      synchronize: true,
    }),
    PostsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
