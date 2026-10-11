import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('API Authentication, Authorization & Route Protection', () => {
  it('returns 200 OK on /health check', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

  it('rejects unauthenticated requests to protected profile route with 401 Unauthorized', async () => {
    const res = await request(app).get('/api/v1/profile');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Unauthorized');
  });

  it('rejects learner role attempting administrative mutation with 403 Forbidden', async () => {
    const res = await request(app)
      .post('/api/v1/competency/roles')
      .set('Authorization', 'Bearer test-learner-token')
      .send({
        code: 'unauthorized-role',
        title: 'Unauthorized Role Creation',
        description: 'Testing RBAC',
        industryDemand: 'High',
        skills: []
      });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Forbidden');
  });

  it('allows administrator to pass RBAC check and validates payload schema', async () => {
    // Missing required fields -> 400 Bad Request
    const res = await request(app)
      .post('/api/v1/competency/roles')
      .set('Authorization', 'Bearer test-admin-token')
      .send({
        code: 'bad'
        // Missing title, description, skills
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('ValidationError');
  });
});
