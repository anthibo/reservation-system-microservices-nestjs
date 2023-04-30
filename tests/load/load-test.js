import http from 'k6/http';
import { check } from 'k6';

import { generateReservation } from './generators/reservation';

// Load test: Ramping virtual(vUs) users up and down
// in 0 - 1m -> from 1 user to 10 users
// in 1 - 3m -> from 10 users to 50 users
// in 3m - 6m -> from 50 users to 100 users
// in 6m - 8m -> from 100 users to 50 users
// in 8m - 9m -> from 50 users to 10 users
// in 9m - 10m -> from 10 users to 1 user
// in 10m - 10m30s -> from 1 user to 200 users (Spike test)
export let options = {
  stages: [
    { duration: '1m', target: 10 },
    { duration: '2m', target: 50 },
    // { duration: '3m', target: 100 },
    // { duration: '2m', target: 50 },
    // { duration: '1m', target: 10 },
    // { duration: '30s', target: 200, rampUp: '10s', rampDown: '10s' },
  ],
  thresholds: {
    // Count: Incorrect content cannot be returned more than 99 times.
    Errors: ['count<10']
  }
};

const contentTypeHeader = { 'Content-Type': 'application/json' };

export default function () {
  const credentialsPayload = registerUser();
  const jwtToken = loginUser(credentialsPayload);
  const reservation = generateReservation();
  const headers = {
    'Content-Type': 'application/json',
    Authentication: jwtToken,
  };

  const requestRes = http.post(
    'http://34.102.159.133/reservations/',
    reservation,
    headers,
  );
  const responseTime = requestRes.timings.duration;

  check(requestRes, { 'Request status is 200': (r) => r.status === 200 });

  console.log(`Response time: ${responseTime} ms`);
}

function registerUser() {
  const credentialsPayload = JSON.stringify({
    email: `user${__VU}@example.com`,
    password: 'password123',
  });

  console.log(credentialsPayload);

  const registerRes = http.post(
    'http://34.102.159.133/users/',
    credentialsPayload,
    { headers: contentTypeHeader },
  );
  console.log(registerRes.status);
  check(registerRes, { 'Register status is 200': (r) => r.status === 200 });
  return credentialsPayload;
}

function loginUser(credentialsPayload) {
  const loginRes = http.post(
    'http://34.102.159.133/auth/login',
    credentialsPayload,
    { headers: contentTypeHeader },
  );
  console.log(loginRes.status);
  console.log(loginRes.body);
  check(loginRes, { 'Login status is 200': (r) => r.status === 200 });
  return { token: loginRes.body };
}
