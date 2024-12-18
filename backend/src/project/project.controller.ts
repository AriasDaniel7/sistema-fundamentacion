import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { GetUser } from 'src/auth/decorators';
import { User } from '../user/entities/user.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Auth()
  @Post('project')
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Get('projects')
  findAll() {
    return this.projectService.findAll();
  }

  @Get('project/:term')
  findOne(@Param('term') term: string) {
    return this.projectService.findOne(term);
  }

  @Auth()
  @Delete('project/:id')
  delete(@Param('id', ParseUUIDPipe) projectId: string, @GetUser() user: User) {
    return this.projectService.delete(projectId, user.id);
  }
}
