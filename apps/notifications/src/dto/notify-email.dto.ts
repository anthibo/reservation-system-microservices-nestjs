import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class NotifyEmail {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  text: string;
}
