import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsPhoneNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72) // bcrypt-style limit; argon2 allows more but keep sane
  password: string;

  @IsString()
  phone: string;

  @IsString()
  name: string;
}
