import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { map } from 'rxjs';

import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { PAYMENTS_SERVICE, User } from '@app/common';
import { PaymentsGRPCService } from './proto';
import { Reservation } from './models/reservation.entity';

@Injectable()
export class ReservationsService implements OnModuleInit {
  constructor(
    private readonly reservationRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE) private readonly grpcClient: ClientGrpc,
  ) {}

  private paymentsService: PaymentsGRPCService;

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
    { email, id: userId }: User,
  ) {
    const grpcRequestBody = {
      ...createReservationDto.charge,
      email,
    };
    return this.paymentsService.createCharge(grpcRequestBody).pipe(
      map(async ({ id: invoiceId }) => {
        const reservation = new Reservation({
          ...createReservationDto,
          timestamp: new Date(),
          userId,
          invoiceId,
        });
        return await this.reservationRepository.create(reservation);
      }),
    );
  }

  async findAll() {
    return await this.reservationRepository.find({});
  }

  async findOne(id: number) {
    return await this.reservationRepository.findOne({ id });
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    return await this.reservationRepository.findOneAndUpdate(
      { id },
      updateReservationDto,
    );
  }

  async remove(id: number) {
    return await this.reservationRepository.findOneAndDelete({ id });
  }
}
