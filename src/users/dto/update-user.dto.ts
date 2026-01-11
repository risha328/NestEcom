import { IsOptional, IsString, IsEmail, MinLength, IsEnum } from 'class-validator';
import { Roles } from '../utility/common/user-roles.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsEnum(Roles)
  roles?: Roles;
}
