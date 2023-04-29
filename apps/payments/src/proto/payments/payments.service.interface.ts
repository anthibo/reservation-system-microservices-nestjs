import { PaymentsCreateChargeDto } from '@app/common/dto';
import { Observable } from 'rxjs';

export interface PaymentsGRPCService {
  createCharge(data: PaymentsCreateChargeDto): Observable<{ id: string }>;
}
