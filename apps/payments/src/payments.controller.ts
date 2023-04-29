import { Controller, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from '@app/common';

import { PaymentsService } from './payments.service';
import { PAYMENTS_PROTO_SERVICE } from './proto';

@Controller()
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);
  constructor(private readonly paymentsService: PaymentsService) {}
  @GrpcMethod(PAYMENTS_PROTO_SERVICE, 'CreateCharge')
  @UsePipes(new ValidationPipe())
  async createCharge(data: PaymentsCreateChargeDto) {
    this.logger.log('CreateCharge gRPC method Invoked');
    const response = await this.paymentsService.createCharge(data);
    return { id: response.id };
  }
}
