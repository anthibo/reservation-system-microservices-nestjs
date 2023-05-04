/* eslint-disable @typescript-eslint/no-var-requires */
import { faker } from '@faker-js/faker';

export const generateCredentials = () => ({
  email: `${Date.now()}_${faker.internet.email()}`,
  password: '@Password65812',
});
