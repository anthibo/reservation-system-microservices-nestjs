import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { ReservationsController } from './reservations.controller';
import {
  AUTH_SERVICE,
  DatabaseModule,
  HealthModule,
  LoggerModule,
  PAYMENTS_SERVICE,
} from '@app/common';

import { ReservationsRepository } from './reservations.repository';
import { Reservation } from './models/reservation.entity';
import { PAYMENTS_PROTO_PACKAGE } from './proto';
import { join } from 'path';

@Module({
  imports: [
    HealthModule,
    DatabaseModule,
    DatabaseModule.forFeature([Reservation]),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        AUTH_HOST: Joi.string().required(),
        AUTH_PORT: Joi.number().required(),
        PAYMENTS_HOST: Joi.string().required(),
        PAYMENTS_PORT: Joi.number().required(),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
            queue: 'auth',
          },
        }),
        inject: [ConfigService],
      },
      {
        name: PAYMENTS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: `${configService.get('PAYMENTS_HOST')}:${configService.get(
              'PAYMENTS_PORT',
            )}`,
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
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsRepository],
})
export class ReservationsModule {}
