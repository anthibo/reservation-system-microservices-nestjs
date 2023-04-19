import { IsEmail, IsNotEmpty } from 'class-validator';

export class NotifyEmail {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
