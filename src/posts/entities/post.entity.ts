import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  context: string;

  @Column({ nullable: false })
  year: number;
}
