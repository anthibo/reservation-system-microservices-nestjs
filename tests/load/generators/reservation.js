/* eslint-disable @typescript-eslint/no-var-requires */
import { faker } from '@faker-js/faker';

export const generateReservation = () => ({
  startDate: faker.date.past,
  endDate: faker.date.future,
  placeId: faker.datatype.uuid(),
  charge: {
    amount: faker.random.numeric(),
    card: {
      cvc: faker.finance.creditCardCVV,
      exp_month: faker.datatype.number({ min: 1, max: 12 }),
      exp_year: faker.date.future().getFullYear(),
      number: faker.finance.creditCardNumber(),
    },
  },
});
