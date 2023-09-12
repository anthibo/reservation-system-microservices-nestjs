import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsStrongPassword,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RoleDto } from './role.dto';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => RoleDto)
  roles?: RoleDto[];
}
