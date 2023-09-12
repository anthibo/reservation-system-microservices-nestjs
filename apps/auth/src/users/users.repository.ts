import { Injectable, Logger } from '@nestjs/common';

import { AbstractRepository, User } from '@app/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersRepository extends AbstractRepository<User> {
  protected readonly logger = new Logger(UsersRepository.name);
  constructor(
    @InjectRepository(User) userRepository: Repository<User>,
    entityManager: EntityManager,
  ) {
    super(userRepository, entityManager);
  }
}
