import { PartialType } from '@nestjs/mapped-types';
import { CreateUserProjectRoleDto } from './create-user-project-role.dto';

export class UpdateUserProjectRoleDto extends PartialType(CreateUserProjectRoleDto) {}
