import { IsString, IsUUID } from 'class-validator';

export class CreateUserProjectRoleDto {
  @IsString()
  @IsUUID()
  userId: string;

  @IsString()
  @IsUUID()
  projectId: string;

  @IsString()
  @IsUUID()
  roleId: string;
}
