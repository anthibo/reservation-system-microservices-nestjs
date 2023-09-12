import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '../models/user.entity';

const getCurrentUserByContext = (context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  return request.user as User;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
