import { PaymentsCreateChargeDto } from '@app/common/dto';
import { Observable } from 'rxjs';

export interface PaymentsService {
  createCharge(data: PaymentsCreateChargeDto): Observable<{ id: string }>;
}
