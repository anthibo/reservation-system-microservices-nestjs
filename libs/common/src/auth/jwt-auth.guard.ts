import { ClientProxy } from '@nestjs/microservices';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { AUTH_SERVICE } from '../constants/services';
import { User } from '../models';

Injectable();
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    private readonly reflector: Reflector,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwt =
      context.switchToHttp().getRequest().cookies?.Authentication ||
      context.switchToHttp().getRequest().headers?.authentication;
    if (!jwt) {
      return false;
    }

    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    return this.authClient
      .send<User>('authenticate', {
        Authentication: jwt,
      })
      .pipe(
        tap((res) => {
          if (roles) {
            roles.forEach((role) => {
              if (!res.roles.map((role) => role.name).includes(role)) {
                this.logger.error(
                  `the userId ${res.id} does not have valid roles: ${roles}`,
                );
                throw new UnauthorizedException();
              }
            });
          }
          context.switchToHttp().getRequest().user = res;
        }),
        map(() => true),
        catchError((err) => {
          this.logger.debug(err);
          return of(false);
        }),
      );
  }
}
