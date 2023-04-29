import * as path from 'path';

export * from './payments.service.interface';

let payment_proto_path = 'libs/common/src/proto/payments/payments.proto';

if (process.env.NODE_ENV === 'production') {
  payment_proto_path = path.resolve(
    __dirname,
    '../../proto/payments/payments.proto',
  );
}

export const PAYMENTS_PROTO_PATH = payment_proto_path;
export const PAYMENTS_PROTO_SERVICE = 'PaymentsService';
export const PAYMENTS_PROTO_PACKAGE = 'payments';
