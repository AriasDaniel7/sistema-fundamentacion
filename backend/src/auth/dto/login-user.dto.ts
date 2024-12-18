import { IsString } from 'class-validator';

export class LoginUserDto {
  @IsString()
  userName: string;

  @IsString()
  password: string;
}
