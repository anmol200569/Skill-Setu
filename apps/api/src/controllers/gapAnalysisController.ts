import { Request, Response } from 'express';
import { analyzeLearnerSkillGaps } from '../services/gapAnalysisEngine';

export async function getSkillGapAnalysis(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;
  const targetRoleId = (req.query.roleId as string) || undefined;

  try {
    const analysis = await analyzeLearnerSkillGaps(userId, targetRoleId);
    res.json(analysis);
  } catch (err: any) {
    res.status(500).json({
      error: 'AnalysisError',
      message: err.message || 'Failed to complete skill gap analysis'
    });
  }
}
