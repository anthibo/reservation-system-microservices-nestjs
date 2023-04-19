import { Injectable } from '@nestjs/common';
import { NotifyEmail } from './dto/notify-email.dto';

@Injectable()
export class NotificationsService {
  async notifyEmail({ email }: NotifyEmail) {
    console.log('notifications service');
    console.log(email);
  }
}
