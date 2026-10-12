import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { prisma } from '../src/lib/prisma';

const app = createApp();

describe('Competency Stats API (/api/v1/competency/stats)', () => {
  it('serves aggregated domain, skill, and question counts publicly without auth', async () => {
    const mockDomains = [
      {
        id: 'domain-1',
        code: 'prog-soft-dev',
        name: 'Programming & Software Development',
        description: 'Core software engineering competencies.',
        icon: 'Code2',
        skills: [
          {
            id: 'skill-1',
            code: 'ts-js',
            name: 'TypeScript & JavaScript',
            _count: { assessmentQuestions: 10 }
          },
          {
            id: 'skill-2',
            code: 'react',
            name: 'React & Modern Frontend',
            _count: { assessmentQuestions: 10 }
          }
        ]
      },
      {
        id: 'domain-2',
        code: 'cloud-devops',
        name: 'Cloud & DevOps',
        description: 'Cloud infrastructure and CI/CD pipelines.',
        icon: 'Cloud',
        skills: [
          {
            id: 'skill-3',
            code: 'docker-k8s',
            name: 'Containers & Docker',
            _count: { assessmentQuestions: 10 }
          }
        ]
      }
    ];

    vi.spyOn(prisma.domain, 'findMany').mockResolvedValueOnce(mockDomains as any);

    const res = await request(app).get('/api/v1/competency/stats');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      totalDomains: 2,
      totalSkills: 3,
      totalQuestions: 30,
      domains: [
        {
          id: 'domain-1',
          code: 'prog-soft-dev',
          name: 'Programming & Software Development',
          description: 'Core software engineering competencies.',
          icon: 'Code2',
          skillsCount: 2,
          questionsCount: 20
        },
        {
          id: 'domain-2',
          code: 'cloud-devops',
          name: 'Cloud & DevOps',
          description: 'Cloud infrastructure and CI/CD pipelines.',
          icon: 'Cloud',
          skillsCount: 1,
          questionsCount: 10
        }
      ]
    });
  });

  it('handles empty database gracefully with zero counts', async () => {
    vi.spyOn(prisma.domain, 'findMany').mockResolvedValueOnce([]);

    const res = await request(app).get('/api/v1/competency/stats');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      totalDomains: 0,
      totalSkills: 0,
      totalQuestions: 0,
      domains: []
    });
  });

  it('works via /api/v1/competencies/stats alias route', async () => {
    vi.spyOn(prisma.domain, 'findMany').mockResolvedValueOnce([]);

    const res = await request(app).get('/api/v1/competencies/stats');

    expect(res.status).toBe(200);
    expect(res.body.totalDomains).toBe(0);
  });

  it('returns 500 when database query fails', async () => {
    vi.spyOn(prisma.domain, 'findMany').mockRejectedValueOnce(new Error('DB Connection Failed'));

    const res = await request(app).get('/api/v1/competency/stats');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'InternalServerError');
  });
});
