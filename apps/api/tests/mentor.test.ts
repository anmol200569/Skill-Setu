import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendChatMessage } from '../src/controllers/assistantController';
import { prisma } from '../src/lib/prisma';
import * as aiService from '../src/services/aiService';
import * as gapAnalysisEngine from '../src/services/gapAnalysisEngine';

vi.mock('../src/lib/prisma', () => ({
  prisma: {
    profile: {
      findUnique: vi.fn()
    },
    chatMessage: {
      create: vi.fn(),
      findMany: vi.fn()
    }
  }
}));

vi.mock('../src/services/aiService', () => ({
  generateGeminiCompletion: vi.fn(),
  sanitizePromptInput: vi.fn((msg: string) => msg)
}));

vi.mock('../src/services/gapAnalysisEngine', () => ({
  analyzeLearnerSkillGaps: vi.fn()
}));

function mockReqRes(body: any, userId = 'user-123') {
  const req: any = {
    user: { id: userId, email: 'test@example.com', role: 'learner' },
    body
  };
  const res: any = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis()
  };
  return { req, res };
}

describe('AI Mentor Controller (sendChatMessage) Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. No-Role: returns guidance to pick a target role without defaulting to Data Analyst', async () => {
    const { req, res } = mockReqRes({ message: 'Hello mentor!' });

    // Mock profile without target role
    (prisma.profile.findUnique as any).mockResolvedValue({
      userId: 'user-123',
      targetRoleId: null,
      targetRole: null
    });

    (prisma.chatMessage.create as any).mockResolvedValue({
      id: 'msg-reply-1',
      conversationId: 'conv-1',
      userId: 'user-123',
      role: 'assistant',
      content: 'Pick a target role first so I can tailor mentoring to your career goals and benchmark your competencies.',
      createdAt: new Date()
    });

    await sendChatMessage(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        noRole: true,
        message: expect.objectContaining({
          content: expect.stringContaining('Pick a target role first')
        })
      })
    );
    expect(aiService.generateGeminiCompletion).not.toHaveBeenCalled();
  });

  it('2. Success: returns 200 with assistant reply when user has a role and assessed gaps', async () => {
    const { req, res } = mockReqRes({ message: 'How do I bridge my SQL gap?' });

    (prisma.profile.findUnique as any).mockResolvedValue({
      userId: 'user-123',
      targetRoleId: 'role-ba',
      targetRole: { id: 'role-ba', title: 'Business Analyst' }
    });

    (gapAnalysisEngine.analyzeLearnerSkillGaps as any).mockResolvedValue({
      gaps: [
        {
          skillName: 'Advanced SQL',
          currentLevel: 1.5,
          requiredLevel: 3,
          gap: 1.5
        }
      ]
    });

    (prisma.chatMessage.findMany as any).mockResolvedValue([]);
    (aiService.generateGeminiCompletion as any).mockResolvedValue(
      'To master SQL, start with subqueries and window functions like ROW_NUMBER().'
    );

    (prisma.chatMessage.create as any).mockImplementation((args: any) => ({
      id: 'msg-id',
      ...args.data,
      createdAt: new Date()
    }));

    await sendChatMessage(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.objectContaining({
          content: 'To master SQL, start with subqueries and window functions like ROW_NUMBER().'
        })
      })
    );
    expect(res.status).not.toHaveBeenCalledWith(503);
  });

  it('3. Fallback: tries fallback model when primary model fails with 429 and succeeds', async () => {
    const { req, res } = mockReqRes({ message: 'What should I study next?' });

    (prisma.profile.findUnique as any).mockResolvedValue({
      userId: 'user-123',
      targetRoleId: 'role-ba',
      targetRole: { id: 'role-ba', title: 'Business Analyst' }
    });

    (gapAnalysisEngine.analyzeLearnerSkillGaps as any).mockResolvedValue({
      gaps: []
    });

    (prisma.chatMessage.findMany as any).mockResolvedValue([]);

    // Primary model throws 429
    const err429: any = new Error('Primary 429 Quota Exceeded');
    err429.status = 429;
    (aiService.generateGeminiCompletion as any)
      .mockRejectedValueOnce(err429)
      .mockResolvedValueOnce('Fallback model reply: focus on requirement gathering fundamentals.');

    (prisma.chatMessage.create as any).mockImplementation((args: any) => ({
      id: 'msg-id',
      ...args.data,
      createdAt: new Date()
    }));

    await sendChatMessage(req, res);

    expect(aiService.generateGeminiCompletion).toHaveBeenCalledTimes(2);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.objectContaining({
          content: 'Fallback model reply: focus on requirement gathering fundamentals.'
        })
      })
    );
  });

  it('4. 429 Failure: returns 503 degraded when both primary and fallback models fail with 429', async () => {
    const { req, res } = mockReqRes({ message: 'Help me plan!' });

    (prisma.profile.findUnique as any).mockResolvedValue({
      userId: 'user-123',
      targetRoleId: 'role-ba',
      targetRole: { id: 'role-ba', title: 'Business Analyst' }
    });

    (gapAnalysisEngine.analyzeLearnerSkillGaps as any).mockResolvedValue({ gaps: [] });
    (prisma.chatMessage.findMany as any).mockResolvedValue([]);

    const err429: any = new Error('Quota Exceeded');
    err429.status = 429;
    (aiService.generateGeminiCompletion as any).mockRejectedValue(err429);

    await sendChatMessage(req, res);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'ServiceUnavailable',
        degraded: true,
        message: expect.stringContaining('high demand')
      })
    );
  });

  it('5. Timeout: returns 503 degraded when models time out', async () => {
    const { req, res } = mockReqRes({ message: 'Review my roadmap' });

    (prisma.profile.findUnique as any).mockResolvedValue({
      userId: 'user-123',
      targetRoleId: 'role-ba',
      targetRole: { id: 'role-ba', title: 'Business Analyst' }
    });

    (gapAnalysisEngine.analyzeLearnerSkillGaps as any).mockResolvedValue({ gaps: [] });
    (prisma.chatMessage.findMany as any).mockResolvedValue([]);

    const timeoutErr: any = new Error('Inference timed out');
    timeoutErr.status = 504;
    (aiService.generateGeminiCompletion as any).mockRejectedValue(timeoutErr);

    await sendChatMessage(req, res);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'ServiceUnavailable',
        degraded: true,
        message: expect.stringContaining('temporarily unavailable')
      })
    );
  });

  it('6. Empty Gaps Context: does not print empty top gaps in mentor prompt', async () => {
    const { req, res } = mockReqRes({ message: 'Hello' });

    (prisma.profile.findUnique as any).mockResolvedValue({
      userId: 'user-123',
      targetRoleId: 'role-ba',
      targetRole: { id: 'role-ba', title: 'Business Analyst' }
    });

    // 0 assessed gaps
    (gapAnalysisEngine.analyzeLearnerSkillGaps as any).mockResolvedValue({
      gaps: []
    });

    (prisma.chatMessage.findMany as any).mockResolvedValue([]);
    (aiService.generateGeminiCompletion as any).mockResolvedValue('Welcome! Take the diagnostic to get started.');
    (prisma.chatMessage.create as any).mockImplementation((args: any) => ({
      id: 'msg-id',
      ...args.data,
      createdAt: new Date()
    }));

    await sendChatMessage(req, res);

    // Verify system instruction was passed "No assessed gaps yet, take the diagnostic" instead of empty string
    expect(aiService.generateGeminiCompletion).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('No assessed gaps yet, take the diagnostic'),
      expect.any(Number),
      expect.any(Object)
    );
  });
});
