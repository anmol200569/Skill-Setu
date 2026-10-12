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

  it('rejects unauthenticated request to admin route with 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/v1/competency/roles')
      .send({
        code: 'new-role',
        title: 'New Role',
        description: 'Testing',
        skills: []
      });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Unauthorized');
  });

  it('rejects authenticated non-admin user (other email / learner) on admin route with 403 Forbidden', async () => {
    const res = await request(app)
      .post('/api/v1/competency/domains')
      .set('Authorization', 'Bearer test-learner-token')
      .send({
        code: 'unauthorized-domain',
        name: 'Unauthorized Domain',
        description: 'Forbidden test'
      });
    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Forbidden');
  });

  it('confirms /auth/bootstrap-admin route has been removed and returns 404', async () => {
    const res = await request(app)
      .post('/api/v1/auth/bootstrap-admin')
      .send({
        email: 'attacker@example.com'
      });
    expect(res.status).toBe(404);
  });

  it('rejects test-admin-token with 401 Unauthorized when NODE_ENV is production', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      const res = await request(app)
        .get('/api/v1/profile')
        .set('Authorization', 'Bearer test-admin-token');
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Unauthorized');
    } finally {
      process.env.NODE_ENV = originalEnv;
    }
  });

  it('returns HTTP 403 { error: "Forbidden origin" } when CORS blocks unauthorized origin in production', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      const prodApp = createApp();
      const res = await request(prodApp)
        .get('/health')
        .set('Origin', 'https://unauthorized-malicious-site.com');
      expect(res.status).toBe(403);
      expect(res.body).toEqual({ error: 'Forbidden origin' });
    } finally {
      process.env.NODE_ENV = originalEnv;
    }
  });

  it('allows authorized production origin in production', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      const prodApp = createApp();
      const res = await request(prodApp)
        .get('/health')
        .set('Origin', 'https://skill-setu.vercel.app');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
    } finally {
      process.env.NODE_ENV = originalEnv;
    }
  });
});


