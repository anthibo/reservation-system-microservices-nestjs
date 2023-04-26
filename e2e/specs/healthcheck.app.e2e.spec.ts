import { ping } from 'tcp-ping';

describe('Health', () => {
  test('Reservations Service Health Check', async () => {
    const response = await fetch('http://reservations:3000');
    expect(response.ok).toBeTruthy();
  });

  test('Auth Service Health Check', async () => {
    const response = await fetch('http://auth:3001');
    expect(response.ok).toBeTruthy();
  });

  test('Payments Service Health Check', (done) => {
    ping({ address: 'payments', port: 3003 }, (err) => {
      if (err) {
        fail();
      }
    });
    done();
  });

  test('Notifications Service Health Check', (done) => {
    ping({ address: 'notifications', port: 3004 }, (err) => {
      if (err) {
        fail();
      }
    });
    done();
  });
});
