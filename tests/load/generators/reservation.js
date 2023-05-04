/* eslint-disable @typescript-eslint/no-var-requires */
import { faker } from '@faker-js/faker';

export const generateReservation = () => ({
  startDate: '02-01-2023',
  endDate: '04-01-2023',
  placeId: faker.datatype.uuid(),
  charge: {
    amount: faker.datatype.number(),
    card: {
      cvc: faker.finance.creditCardCVV(),
      exp_month: 12,
      exp_year: faker.date.future().getFullYear(),
      number: '4242 4242 4242 4242',
    },
  },
});
