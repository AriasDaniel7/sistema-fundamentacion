import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { UserProjectRole } from '../user-project-role/entities/user-project-role.entity';
import { ValidRoles } from '../auth/interfaces/valid-roles.interface';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(UserProjectRole)
    private readonly userProjectRoleRepository: Repository<UserProjectRole>,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    try {
      const project = this.projectRepository.create(createProjectDto);
      await this.projectRepository.save(project);
      return project;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll() {
    const projects = await this.projectRepository.find({
      relations: { userProjectRoles: true },
    });
    return projects.map((project) => {
      if (project.userProjectRoles.length === 0) {
        delete project.userProjectRoles;
      }
      return project;
    });
  }

  async findOne(term: string) {
    let project: Project;

    if (isUUID(term)) {
      project = await this.projectRepository.findOne({
        where: { id: term },
        relations: { userProjectRoles: true },
      });
    }

    if (!project) {
      project = await this.projectRepository.findOne({
        where: { name: term },
        relations: { userProjectRoles: true },
      });
    }

    if (!project) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    return project;
  }

  async delete(projectId: string, userId: string) {
    const project = await this.findOne(projectId);

    const userProjectRole = await this.userProjectRoleRepository.findOne({
      where: { project: { id: projectId }, user: { id: userId } },
      relations: { role: true },
    });

    if (!userProjectRole) {
      throw new UnauthorizedException('Usuario no está asociado al proyecto');
    }

    if (userProjectRole.role.name !== ValidRoles.admin) {
      throw new UnauthorizedException(
        'Usuario no tiene permisos de administrador',
      );
    }

    await this.projectRepository.remove(project);
  }

  private handleError(error: any) {
    if (error.code === '23505') {
      const matches = error.detail.match(/\(([^)]+)\)/g);
      const [key, value] = matches;
      throw new ConflictException(`El proyecto: ${value} ya existe!`);
    }
    console.log(error);
  }
}
