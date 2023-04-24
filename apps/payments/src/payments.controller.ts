import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from '@app/common';
import { PAYMENTS_PROTO_SERVICE } from '@app/common/proto';

import { PaymentsService } from './payments.service';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  @GrpcMethod(PAYMENTS_PROTO_SERVICE, 'CreateCharge')
  @UsePipes(new ValidationPipe())
  async createCharge(data: PaymentsCreateChargeDto) {
    const response = await this.paymentsService.createCharge(data);
    return { id: response.id };
  }
}
