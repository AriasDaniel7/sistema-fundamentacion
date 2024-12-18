import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { isUUID } from 'class-validator';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;

    try {
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);
      delete user.password;

      return { user, token: this.getJwtToken({ id: user.id }) };
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll() {
    return (await this.userRepository.find()).map((user) => ({
      ...user,
      phone: +user.phone,
    }));
  }

  async findOne(term: string) {
    let user: User;

    if (isUUID(term)) {
      user = await this.userRepository.findOneBy({ id: term });
    }

    if (!user) {
      user = await this.userRepository.findOneBy({ userName: term });
    }

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    } else {
      user.phone = +user.phone;
    }

    return user;
  }

  private handleError(error: any) {
    if (error.code === '23505') {
      const matches = error.detail.match(/\(([^)]+)\)/g);
      const [key, value] = matches;
      throw new ConflictException(`El valor ${value} ya existe en ${key}`);
    }
    console.log(error);
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
