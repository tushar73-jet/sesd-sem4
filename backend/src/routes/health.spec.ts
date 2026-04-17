import request from 'supertest';
import app from '../app';

describe('Health Check Endpoints', () => {
  it('GET /health - should return 200 OK and status JSON', async () => {
    const res = await request(app).get('/health');
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('message', 'CampusKart API is running');
  });

  it('GET /non-existent-route - should be unhandled and return 404 HTML natively', async () => {
    const res = await request(app).get('/something-random');
    expect(res.status).toBe(404);
  });
});
