import {
  IsEmail,
  IsNumber,
  IsPositive,
  IsString,
  Matches,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'El userName debe ser un string' })
  @MaxLength(50, { message: 'El userName debe tener menos de 50 caracteres' })
  @MinLength(5, { message: 'El userName debe tener más de 5 caracteres' })
  userName: string;

  @MinLength(6, { message: 'La password debe tener más de 6 caracteres' })
  @MaxLength(80, { message: 'La password debe tener menos de 80 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, {
    message:
      'El password debe contener al menos una letra mayúscula, una letra minúscula y un número',
  })
  password: string;

  @IsString({ message: 'El fullName debe ser un string' })
  @MaxLength(100, {
    message: 'El fullName debe tener menos de 100 caracteres',
  })
  @MinLength(5, {
    message: 'El fullName debe tener más de 5 caracteres',
  })
  fullName: string;

  @IsString({ message: 'El email debe ser un string' })
  @IsEmail({}, { message: 'El email debe ser un email válido' })
  @MaxLength(100, { message: 'El email debe tener menos de 100 caracteres' })
  email: string;

  @Max(9999999999, { message: 'El phone debe tener menos de 10 dígitos' })
  @IsNumber({}, { message: 'El phone debe ser un número' })
  @IsPositive({ message: 'El phone debe ser un número positivo' })
  phone: number;
}
