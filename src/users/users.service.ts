import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(userData: UserDto) {
    const hashedPassword = await hash(userData.password, 10);

    if (await this.getUserByEmail(userData.email)) {
      throw new HttpException('EMAIL_ALREADY_EXISTS', HttpStatus.BAD_REQUEST);
    }

    await this.userRepo.save({
      email: userData.email,
      password: hashedPassword,
    });
  }

  async login(email: string, password: string) {
    const user: User = await this.getUserByEmail(email);
    const isMatch: boolean = await compare(password, user.password);

    if (!user || !isMatch) {
      throw new HttpException(
        'INVALID_EMAIL_OR_PASSWORD',
        HttpStatus.BAD_REQUEST,
      );
    }

    return { accessToken: this.jwtService.sign({ id: user.id }) };
  }

  private async getUserByEmail(email: string): Promise<User> {
    return await this.userRepo.findOneBy({ email });
  }
}
