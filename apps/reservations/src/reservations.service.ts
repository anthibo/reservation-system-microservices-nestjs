import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { PAYMENTS_SERVICE, UserDto } from '@app/common';
import {
  Client,
  ClientGrpc,
  ClientGrpcProxy,
  ClientProxy,
  Transport,
} from '@nestjs/microservices';
import { Observable, map } from 'rxjs';
import {
  PAYMENTS_PROTO_PACKAGE,
  PAYMENTS_PROTO_PATH,
  PaymentsService,
} from '@app/common/proto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ReservationsService implements OnModuleInit {
  constructor(
    private readonly reservationRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE) private readonly grpcClient: ClientGrpc,
  ) {}

  private paymentsService: PaymentsService;

  onModuleInit() {
    this.paymentsService = this.grpcClient.getService('PaymentsService');
    if (!this.paymentsService) {
      console.log('Failed to get payments service');
    } else {
      console.log(this.paymentsService);
      console.log(Object.keys(this.paymentsService));
      console.log('payments service configured');
    }
  }

  async create(
    createReservationDto: CreateReservationDto,
    { email, _id: userId }: UserDto,
  ) {
    const grpcRequestBody = {
      ...createReservationDto.charge,
      email,
    };
    return this.paymentsService.createCharge(grpcRequestBody).pipe(
      map(async ({ id: invoiceId }) => {
        return await this.reservationRepository.create({
          ...createReservationDto,
          timestamp: new Date(),
          userId,
          invoiceId,
        });
      }),
    );
  }

  async findAll() {
    return await this.reservationRepository.find({});
  }

  async findOne(_id: string) {
    return await this.reservationRepository.findOne({ _id });
  }

  async update(_id: string, updateReservationDto: UpdateReservationDto) {
    return await this.reservationRepository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    );
  }

  async remove(_id: string) {
    return await this.reservationRepository.findOneAndDelete({ _id });
  }
}
