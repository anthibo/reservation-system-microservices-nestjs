import http from 'k6/http';
import { check } from 'k6';

import { generateReservation } from './generators/reservation';
import { generateCredentials } from './generators/credentials';

// Load test: Ramping virtual(vUs) users up and down
// in 0 - 30s -> from 1 user to 5 users
// in 30s - 1:30 -> from 5 users to 10 users
// in 1:30 - 2:00 -> from 10 users to 100 users (Spike test)
// in 2:00 - 3:00 -> from 100 users to 10 users (Ramp down)
export let options = {
  stages: [
    { duration: '30s', target: 5 },
    { duration: '1m', target: 10 },
    { duration: '30s', target: 100 },
    { duration: '1m', target: 10 },
  ],
};

const contentTypeHeader = { 'Content-Type': 'application/json' };

export default function () {
  const credentialsPayload = registerUser();
  const { token: jwtToken } = loginUser(credentialsPayload);

  const reservation = JSON.stringify(generateReservation());
  console.log(reservation);

  const headers = {
    'Content-Type': 'application/json',
    authentication: jwtToken,
  };
  console.log(headers);
  const createReservationResponse = http.post(
    'http://34.149.137.250/reservations/',
    reservation,
    { headers },
  );
  const responseTime = createReservationResponse.timings.duration;

  check(createReservationResponse, {
    'Create Reservation Request status is 201': (r) => r.status === 201,
  });

  console.log(
    `Reservation Response status: ${createReservationResponse.status}`,
  );
  console.log(`Reservation response body:`, createReservationResponse.body);
  console.log(`Response time: ${responseTime} ms`);
}

function registerUser() {
  const credentialsPayload = JSON.stringify(generateCredentials());

  console.log(credentialsPayload);

  const registerRes = http.post(
    'http://34.149.137.250/users/',
    credentialsPayload,
    { headers: contentTypeHeader },
  );
  console.log(registerRes.status);
  check(registerRes, { 'Register status is 201': (r) => r.status === 201 });
  return credentialsPayload;
}

function loginUser(credentialsPayload) {
  const loginRes = http.post(
    'http://34.149.137.250/auth/login',
    credentialsPayload,
    { headers: contentTypeHeader },
  );
  console.log(loginRes.status);
  console.log(loginRes.body);
  check(loginRes, { 'Login status is 201': (r) => r.status === 201 });
  return { token: loginRes.body };
}
