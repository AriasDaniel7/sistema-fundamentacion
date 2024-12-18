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
import { UserProjectRoleService } from './user-project-role.service';
import { CreateUserProjectRoleDto } from './dto/create-user-project-role.dto';
import { UpdateUserProjectRoleDto } from './dto/update-user-project-role.dto';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller()
export class UserProjectRoleController {
  constructor(
    private readonly userProjectRoleService: UserProjectRoleService,
  ) {}

  @Auth()
  @Post('user-project-role/assign')
  create(@Body() createUserProjectRoleDto: CreateUserProjectRoleDto) {
    return this.userProjectRoleService.create(createUserProjectRoleDto);
  }

  @Get('user-project-roles')
  findAll() {
    return this.userProjectRoleService.findAll();
  }

  @Get('project/:projectId/users')
  findUsersByProjectId(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.userProjectRoleService.findUsersByProjectId(projectId);
  }

  @Get('project/:projectId/user/:userId')
  findUserByProjectIdAndUserId(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.userProjectRoleService.findUserByProjectIdAndUserId(
      projectId,
      userId,
    );
  }

  @Auth()
  @Get('user/:userId/projects')
  findProjectsByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.userProjectRoleService.findProjectsByUserId(userId);
  }
}
