import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { authenticate } from '../src/middleware/auth';
import { supabaseAuth } from '../src/lib/supabase';
import { prisma } from '../src/lib/prisma';
import { config } from '../src/config';

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

  it('returns HTTP 403 { error: "Forbidden origin" } and logs to stderr when CORS blocks foreign origin in production', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const prodApp = createApp();
      const res = await request(prodApp)
        .get('/health')
        .set('Origin', 'https://unauthorized-malicious-site.com');
      expect(res.status).toBe(403);
      expect(res.body).toEqual({ error: 'Forbidden origin' });
      expect(errorSpy).toHaveBeenCalledWith('Blocked CORS origin: https://unauthorized-malicious-site.com');
    } finally {
      errorSpy.mockRestore();
      process.env.NODE_ENV = originalEnv;
    }
  });

  it('allows same-origin requests in production when Origin host matches Host or x-forwarded-host', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      const prodApp = createApp();
      // Case 1: Host header matches Origin host
      const resHost = await request(prodApp)
        .get('/health')
        .set('Origin', 'https://api.skillsetu.com')
        .set('Host', 'api.skillsetu.com');
      expect(resHost.status).toBe(200);
      expect(resHost.body.status).toBe('healthy');

      // Case 2: x-forwarded-host matches Origin host
      const resForwarded = await request(prodApp)
        .get('/health')
        .set('Origin', 'https://custom-gateway.internal')
        .set('x-forwarded-host', 'custom-gateway.internal');
      expect(resForwarded.status).toBe(200);
      expect(resForwarded.body.status).toBe('healthy');
    } finally {
      process.env.NODE_ENV = originalEnv;
    }
  });

  it('allows two listed origins from a comma-separated CORS_ORIGIN in production', async () => {
    const originalEnv = process.env.NODE_ENV;
    const originalCors = process.env.CORS_ORIGIN;
    process.env.NODE_ENV = 'production';
    process.env.CORS_ORIGIN = 'https://skill-setu.vercel.app, https://skillsetu.org';
    try {
      const prodApp = createApp();

      const res1 = await request(prodApp)
        .get('/health')
        .set('Origin', 'https://skill-setu.vercel.app');
      expect(res1.status).toBe(200);

      const res2 = await request(prodApp)
        .get('/health')
        .set('Origin', 'https://skillsetu.org');
      expect(res2.status).toBe(200);
    } finally {
      process.env.NODE_ENV = originalEnv;
      process.env.CORS_ORIGIN = originalCors;
    }
  });

  it('with CORS_ORIGIN=https://turbo-amber-ue8igyf.vercel.app, that origin is allowed, https://skill-setu.vercel.app is blocked (403), and https://turbo-amber-ue8igyf.vercel.app.evil.com is blocked', async () => {
    const originalEnv = process.env.NODE_ENV;
    const originalCors = process.env.CORS_ORIGIN;
    const originalVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
    process.env.NODE_ENV = 'production';
    process.env.CORS_ORIGIN = 'https://turbo-amber-ue8igyf.vercel.app';
    delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const prodApp = createApp();

      // 1. Configured origin is allowed (200)
      const allowedRes = await request(prodApp)
        .get('/health')
        .set('Origin', 'https://turbo-amber-ue8igyf.vercel.app');
      expect(allowedRes.status).toBe(200);

      // 2. Old hardcoded fallback origin is blocked (403)
      const oldRes = await request(prodApp)
        .get('/health')
        .set('Origin', 'https://skill-setu.vercel.app');
      expect(oldRes.status).toBe(403);
      expect(oldRes.body).toEqual({ error: 'Forbidden origin' });

      // 3. Lookalike evil origin is blocked (403)
      const evilRes = await request(prodApp)
        .get('/health')
        .set('Origin', 'https://turbo-amber-ue8igyf.vercel.app.evil.com');
      expect(evilRes.status).toBe(403);
      expect(evilRes.body).toEqual({ error: 'Forbidden origin' });
    } finally {
      errorSpy.mockRestore();
      process.env.NODE_ENV = originalEnv;
      process.env.CORS_ORIGIN = originalCors;
      if (originalVercel !== undefined) {
        process.env.VERCEL_PROJECT_PRODUCTION_URL = originalVercel;
      }
    }
  });

  it('does NOT assign admin role to new user if email equals INITIAL_ADMIN_EMAIL but email_confirmed_at is unset', async () => {
    vi.spyOn(supabaseAuth.auth, 'getUser').mockResolvedValueOnce({
      data: {
        user: {
          id: 'test-unconfirmed-admin-id',
          email: config.initialAdminEmail,
          email_confirmed_at: null,
          user_metadata: {}
        } as any
      },
      error: null
    });

    vi.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);
    const createSpy = vi.spyOn(prisma.user, 'create').mockResolvedValueOnce({
      id: 'test-unconfirmed-admin-id',
      email: config.initialAdminEmail,
      role: 'learner',
      createdAt: new Date(),
      updatedAt: new Date()
    } as any);

    const req: any = {
      headers: {
        authorization: 'Bearer non-mock-unconfirmed-token'
      }
    };
    const res: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    const next = vi.fn();

    await authenticate(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalledWith({
      data: {
        id: 'test-unconfirmed-admin-id',
        email: config.initialAdminEmail,
        role: 'learner'
      }
    });
    expect(req.user?.role).toBe('learner');
  });

  it('assigns admin role to new user when email equals INITIAL_ADMIN_EMAIL and email_confirmed_at is set', async () => {
    vi.spyOn(supabaseAuth.auth, 'getUser').mockResolvedValueOnce({
      data: {
        user: {
          id: 'test-confirmed-admin-id',
          email: config.initialAdminEmail,
          email_confirmed_at: '2026-10-12T12:00:00Z',
          user_metadata: {}
        } as any
      },
      error: null
    });

    vi.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);
    const createSpy = vi.spyOn(prisma.user, 'create').mockResolvedValueOnce({
      id: 'test-confirmed-admin-id',
      email: config.initialAdminEmail,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    } as any);

    const req: any = {
      headers: {
        authorization: 'Bearer non-mock-confirmed-token'
      }
    };
    const res: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    const next = vi.fn();

    await authenticate(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalledWith({
      data: {
        id: 'test-confirmed-admin-id',
        email: config.initialAdminEmail,
        role: 'admin'
      }
    });
    expect(req.user?.role).toBe('admin');
  });
});



