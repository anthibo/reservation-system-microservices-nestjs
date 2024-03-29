import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { PAYMENTS_PROTO_PACKAGE } from './proto';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      url: `0.0.0.0:${port}`,
      package: PAYMENTS_PROTO_PACKAGE,
      protoPath: join(__dirname, './proto/payments/payments.proto'),
      loader: {
        keepCase: true,
        longs: Number,
        enums: String,
        defaults: true,
        oneofs: true,
        objects: true,
        json: true,
      },
    },
  });

  app.useLogger(app.get(Logger));
  await app.startAllMicroservices();
}
bootstrap();
