import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsIn(['ADMIN', 'USER', 'CLIENT'])
  @MaxLength(20)
  @IsOptional()
  name?: string;
}
