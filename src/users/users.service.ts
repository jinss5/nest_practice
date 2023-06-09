import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
//import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async signUp(userData: CreateUserDto) {
    const hashedPassword = await hash(userData.password, 10);

    if (await this.getUserByEmail(userData.email)) {
      throw new HttpException('EMAIL_ALREADY_EXISTS', HttpStatus.BAD_REQUEST);
    }

    await this.userRepo.save({
      email: userData.email,
      password: hashedPassword,
    });
  }

  private async getUserByEmail(email: string) {
    return await this.userRepo.findOneBy({ email });
  }

  /*findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }*/
}
