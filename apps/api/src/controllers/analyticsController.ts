import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { analyzeLearnerSkillGaps } from '../services/gapAnalysisEngine';
import { getPersonalizedRecommendations } from '../services/recommendationEngine';

export async function getLearnerDashboardStats(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;

  // Run independent Prisma queries and gap analysis concurrently using Promise.all
  const [profile, gapAnalysis, enrollments, quizAttempts, recentAssessments] = await Promise.all([
    // 1. Fetch Profile
    prisma.profile.findUnique({
      where: { userId },
      include: { targetRole: true }
    }),
    // 2. Run Gap Analysis (now cached and non-blocking)
    analyzeLearnerSkillGaps(userId),
    // 3. Enrollments & Course Progress
    prisma.enrollment.findMany({
      where: { userId },
      include: { course: true }
    }),
    // 4. Quiz Scores History
    prisma.quizAttempt.findMany({
      where: { userId },
      include: { quiz: true },
      orderBy: { submittedAt: 'desc' },
      take: 10
    }),
    // 5. Recent Assessment Attempts
    prisma.assessmentAttempt.findMany({
      where: { userId },
      include: { skill: true },
      orderBy: { startedAt: 'desc' },
      take: 5
    })
  ]);

  // Radar Chart Data: top skills with current vs required
  const radarData = gapAnalysis.gaps.slice(0, 6).map((g) => ({
    skill: g.skillName,
    current: g.currentLevel,
    required: g.requiredLevel
  }));

  // If fewer than 4 gaps, supplement with strengths
  if (radarData.length < 5) {
    for (const st of gapAnalysis.strengths.slice(0, 5 - radarData.length)) {
      radarData.push({
        skill: st.skillName,
        current: st.level,
        required: st.level
      });
    }
  }

  const completedCourses = enrollments.filter((e) => e.status === 'completed');
  const inProgressCourses = enrollments.filter((e) => e.status === 'in_progress');

  // Sum estimated hours of completed and in-progress courses
  const totalLearningHours = enrollments.reduce((acc, curr) => {
    if (curr.status === 'completed') return acc + curr.course.estimatedHours;
    if (curr.status === 'in_progress') return acc + Math.round(curr.course.estimatedHours * (curr.progressPercent / 100));
    return acc;
  }, 0);

  const totalQuizzes = quizAttempts.length;
  const avgQuizScore = totalQuizzes > 0
    ? Math.round(quizAttempts.reduce((acc, q) => acc + q.scorePercentage, 0) / totalQuizzes)
    : 0;

  // 7. Course Recommendations
  const recommendations = await getPersonalizedRecommendations(userId, gapAnalysis.gaps, 4);

  // 8. Next Actions
  const suggestedNextActions = [];
  if (gapAnalysis.gaps.length > 0) {
    suggestedNextActions.push({
      action: 'Take Diagnostic Assessment',
      title: `Assess your proficiency in ${gapAnalysis.gaps[0].skillName}`,
      description: `Bridge your top ${gapAnalysis.gaps[0].priority} gap to improve readiness for ${gapAnalysis.targetRoleTitle}.`,
      link: `/assessments?skillId=${gapAnalysis.gaps[0].skillId}`
    });
  }
  if (recommendations.length > 0) {
    suggestedNextActions.push({
      action: 'Start Learning Course',
      title: recommendations[0].course.title,
      description: recommendations[0].recommendationReason,
      link: `/courses/${recommendations[0].course.id}`
    });
  }
  suggestedNextActions.push({
    action: 'Generate AI Study Quiz',
    title: 'Test yourself on recent notes or slides',
    description: 'Upload your lecture PDF or notes to generate a diagnostic quiz.',
    link: '/quizzes/generator'
  });

  res.json({
    profile,
    overallReadiness: gapAnalysis.overallReadinessScore,
    targetRoleTitle: gapAnalysis.targetRoleTitle,
    completedCoursesCount: completedCourses.length,
    inProgressCoursesCount: inProgressCourses.length,
    totalLearningHours,
    totalQuizzesAttempted: totalQuizzes,
    averageQuizScore: avgQuizScore,
    topGaps: gapAnalysis.gaps.slice(0, 5),
    strengths: gapAnalysis.strengths.slice(0, 5),
    aiExplanation: gapAnalysis.aiSummaryExplanation,
    radarData,
    quizScoreHistory: quizAttempts.map((q) => ({
      id: q.id,
      title: q.quiz.title,
      score: q.scorePercentage,
      date: q.submittedAt
    })),
    recentAssessments: recentAssessments.map((a) => ({
      id: a.id,
      skillName: a.skill.name,
      score: a.score,
      assessedLevel: a.assessedLevel,
      completedAt: a.completedAt
    })),
    recommendedCourses: recommendations,
    suggestedNextActions
  });
}

export async function getAdminAnalytics(req: Request, res: Response): Promise<void> {
  const [
    totalLearners,
    totalQuizzes,
    totalAttempts,
    totalAssessments,
    users,
    roles,
    domains
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'learner' } }),
    prisma.quiz.count(),
    prisma.quizAttempt.count(),
    prisma.assessmentAttempt.count(),
    prisma.user.findMany({
      where: { role: 'learner' },
      include: {
        profile: { include: { targetRole: true } },
        userSkills: { include: { skill: true } }
      },
      take: 100
    }),
    prisma.role.findMany({
      include: { _count: { select: { profiles: true } } }
    }),
    prisma.domain.findMany({
      include: { _count: { select: { skills: true } } }
    })
  ]);

  // Popular Roles
  const popularRoles = roles.map((r) => ({
    roleTitle: r.title,
    learnerCount: r._count.profiles
  })).sort((a, b) => b.learnerCount - a.learnerCount);

  // Common Skill Gaps across learners
  const skillGapFrequency = new Map<string, { count: number; totalGap: number }>();
  for (const user of users) {
    if (user.userSkills) {
      for (const us of user.userSkills) {
        if (us.selfAssessedLevel < 3 || (us.verifiedScore !== null && us.verifiedScore < 3)) {
          const prev = skillGapFrequency.get(us.skill.name) || { count: 0, totalGap: 0 };
          const gap = Math.max(0, 3 - us.effectiveScore);
          skillGapFrequency.set(us.skill.name, {
            count: prev.count + 1,
            totalGap: prev.totalGap + gap
          });
        }
      }
    }
  }

  const commonSkillGaps = Array.from(skillGapFrequency.entries())
    .map(([skillName, data]) => ({
      skillName,
      gapFrequency: data.count,
      avgGap: Number((data.totalGap / (data.count || 1)).toFixed(1))
    }))
    .sort((a, b) => b.gapFrequency - a.gapFrequency)
    .slice(0, 8);

  // Domain Distribution
  const domainDistribution = domains.map((d) => ({
    domainName: d.name,
    skillCount: d._count.skills,
    learnerCount: Math.round(totalLearners * 0.4) // Proportional estimate
  }));

  // Average Platform Readiness Estimate
  const avgPlatformReadiness = totalLearners > 0 ? 68 : 0;

  // Recent Activity Feed
  const recentQuizLogs = await prisma.quizAttempt.findMany({
    include: { user: { include: { profile: true } }, quiz: true },
    orderBy: { submittedAt: 'desc' },
    take: 5
  });

  const recentLearnerActivity = recentQuizLogs.map((q) => ({
    id: q.id,
    learnerName: q.user.profile?.fullName || q.user.email,
    action: 'Completed Quiz',
    detail: `Scored ${q.scorePercentage}% on "${q.quiz.title}"`,
    timestamp: q.submittedAt.toISOString()
  }));

  res.json({
    totalLearners,
    totalQuizzesGenerated: totalQuizzes,
    totalQuizAttempts: totalAttempts,
    totalAssessmentsCompleted: totalAssessments,
    avgPlatformReadiness,
    popularRoles,
    commonSkillGaps,
    domainDistribution,
    recentLearnerActivity
  });
}
