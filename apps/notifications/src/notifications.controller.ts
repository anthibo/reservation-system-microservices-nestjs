import { Controller, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotifyEmail } from './dto/notify-email.dto';

@Controller()
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name);
  constructor(private readonly notificationsService: NotificationsService) {}

  @UsePipes(new ValidationPipe())
  @EventPattern('notify_email')
  async notifyEmail(@Payload() data: NotifyEmail) {
    this.logger.log(
      `Received a 'notify_email' event from the payments service to notify user of email: ${data.email} for payment success`,
    );
    this.notificationsService.notifyEmail(data);
  }
}
