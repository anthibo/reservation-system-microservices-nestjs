import { CreateChargeDto } from './create-charge.dto';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class PaymentsCreateChargeDto extends CreateChargeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
