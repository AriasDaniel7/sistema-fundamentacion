import { ConflictException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    try {
      const role = this.roleRepository.create(createRoleDto);
      await this.roleRepository.save(role);
      return role;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll() {
    return await this.roleRepository.find();
  }


  private handleError(error: any) {
    if (error.code === '23505') {
      const matches = error.detail.match(/\(([^)]+)\)/g);
      const [key, value] = matches;
      throw new ConflictException(`El rol ${value} ya existe!`);
    }
    console.log(error);
  }
}
