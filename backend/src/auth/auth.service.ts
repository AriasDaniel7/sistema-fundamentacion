import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const { userName, password } = loginUserDto;

    const usuario = await this.userRepository.findOne({
      where: { userName },
      select: { password: true, id: true },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    if (!bcrypt.compareSync(password, usuario.password)) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    delete usuario.password;

    return { ...usuario, token: this.getJwtToken({ id: usuario.id }) };
  }

  public getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
