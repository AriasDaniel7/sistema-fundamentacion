import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MaxLength(150)
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(3)
  description: string;
}
