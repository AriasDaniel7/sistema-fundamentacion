import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserProjectRoleDto } from './dto/create-user-project-role.dto';
import { UpdateUserProjectRoleDto } from './dto/update-user-project-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProjectRole } from './entities/user-project-role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserProjectRoleService {
  constructor(
    @InjectRepository(UserProjectRole)
    private readonly userProjectRoleRepository: Repository<UserProjectRole>,
  ) {}

  async create(createUserProjectRoleDto: CreateUserProjectRoleDto) {
    const { projectId, roleId, userId } = createUserProjectRoleDto;

    try {
      const userProjectRole = this.userProjectRoleRepository.create({
        project: { id: projectId },
        role: { id: roleId },
        user: { id: userId },
      });

      await this.userProjectRoleRepository.save(userProjectRole);
      return userProjectRole;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll() {
    return await this.userProjectRoleRepository.find({
      relations: ['project', 'role', 'user'],
    });
  }

  async findUsersByProjectId(projectId: string) {
    const userProjectRoles = await this.userProjectRoleRepository.find({
      where: { project: { id: projectId } },
      relations: { user: true, role: true },
    });

    if (userProjectRoles.length === 0) {
      throw new NotFoundException(
        `No se encontraron usuarios para el proyecto con id '${projectId}'`,
      );
    }

    return userProjectRoles;
  }

  async findUserByProjectIdAndUserId(projectId: string, userId: string) {
    const userProjectRole = await this.userProjectRoleRepository.findOne({
      where: { project: { id: projectId }, user: { id: userId } },
      relations: { user: true, role: true },
    });

    if (!userProjectRole) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return userProjectRole;
  }

  async findProjectsByUserId(userId: string) {
    const userProjectRoles = await this.userProjectRoleRepository.find({
      where: { user: { id: userId } },
      relations: { project: true, role: true, user: false },
    });

    if (userProjectRoles.length === 0) {
      throw new NotFoundException(
        `No se encontraron proyectos para el usuario con id '${userId}'`,
      );
    }

    return userProjectRoles.map((userProjectRole) => {
      delete userProjectRole.user;
      return userProjectRole;
    });
  }

  private handleError(error: any) {
    if (error.code === '23503') {
      const matches = error.detail.match(/\(([^)]+)\)/g);
      const [key, value] = matches;
      throw new NotFoundException(`El valor ${value} no existe en ${key}`);
    }
  }
}
