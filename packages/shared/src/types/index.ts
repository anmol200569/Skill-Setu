export type UserRole = 'learner' | 'admin' | 'trainer';

export interface UserSummary {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  fullName: string;
  education: string;
  experienceYears: number;
  currentStatus: 'student' | 'job_seeker' | 'employed' | 'career_changer';
  currentRole?: string | null;
  targetRoleId?: string | null;
  targetRoleName?: string | null;
  careerGoals?: string | null;
  preferredLanguage: 'en' | 'hi';
  weeklyStudyHours: number;
  learningPreferences: string[];
  isOnboarded: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Domain {
  id: string;
  code: string;
  name: string;
  description: string;
  icon?: string;
  skillCount?: number;
}

export interface Skill {
  id: string;
  domainId: string;
  name: string;
  code: string;
  description: string;
  category: string;
  domain?: Domain;
}

export interface CareerRole {
  id: string;
  code: string;
  title: string;
  description: string;
  industryDemand: 'High' | 'Very High' | 'Critical' | 'Moderate';
  skillsRequired?: RoleSkillRequirement[];
}

export interface RoleSkillRequirement {
  id?: string;
  roleId: string;
  skillId: string;
  skillName?: string;
  requiredProficiency: number; // 1 to 5
  priority: 'must_have' | 'good_to_have' | 'optional';
  weight: number;
}

export interface UserSkillProficiency {
  id?: string;
  userId: string;
  skillId: string;
  skillName?: string;
  selfAssessedLevel: number; // 1 to 5
  verifiedScore?: number | null; // 1 to 5
  effectiveScore: number; // calculated combined score
  confidenceLevel?: number; // 0 to 100
  lastAssessedAt?: string;
}

export type QuestionType = 'single_mcq' | 'multi_mcq' | 'true_false';
export type QuestionDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface AssessmentQuestion {
  id: string;
  assessmentId?: string;
  skillId: string;
  skillName?: string;
  questionText: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  options: { id: string; text: string }[];
  explanation: string;
  correctAnswers?: string[]; // Server-side or post-assessment only
}

export interface AssessmentAttempt {
  id: string;
  userId: string;
  skillId: string;
  skillName: string;
  targetRoleId?: string | null;
  startedAt: string;
  completedAt?: string | null;
  score: number; // Percentage 0 - 100
  assessedLevel: number; // 1 - 5
  totalQuestions: number;
  correctQuestions: number;
  answers: {
    questionId: string;
    selectedOptions: string[];
    isCorrect: boolean;
    timeSpentSeconds?: number;
  }[];
}

export interface SkillGapItem {
  skillId: string;
  skillName: string;
  domainName: string;
  requiredLevel: number; // 1 to 5
  currentLevel: number | null; // null if not assessed
  isAssessed: boolean;
  gap: number; // required - (currentLevel ?? 0)
  priority: 'critical' | 'high' | 'medium' | 'low';
  priorityScore: number; // sorted by priority score
  weight: number;
}

export interface UnassessedSkillItem {
  skillId: string;
  skillName: string;
  domainName?: string;
  requiredLevel: number;
  weight?: number;
}

export interface SkillGapAnalysisResult {
  userId: string;
  targetRoleId?: string | null;
  targetRoleTitle?: string | null;
  status?: 'active' | 'not_started';
  overallReadinessScore: number | null; // null if not_started or 0 assessed
  assessedSkillsCount?: number;
  totalRequiredSkillsCount?: number;
  assessedRatioText?: string;
  isPreliminary?: boolean;
  gaps: SkillGapItem[];
  unassessedSkills?: UnassessedSkillItem[];
  strengths: { skillId: string; skillName: string; level: number }[];
  aiSummaryExplanation: string;
  analyzedAt: string;
}

export interface Course {
  id: string;
  title: string;
  provider: string; // e.g. Microsoft Learn, Google Cloud Skills Boost, freeCodeCamp, NPTEL
  destinationUrl: string;
  skillsCovered: string[]; // Skill IDs or names
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  estimatedHours: number;
  language: 'English' | 'Hindi' | 'Bilingual';
  isFree: boolean;
  rating?: number | null;
  ratingSource?: string | null;
  description: string;
  thumbnailUrl?: string;
}

export interface CourseRecommendation {
  course: Course;
  matchScore: number; // 0 - 100
  matchedSkills: string[];
  gapAddressed: string;
  recommendationReason: string;
  order: number;
}

export interface LearningPath {
  id?: string | null;
  userId: string;
  targetRoleTitle?: string | null;
  status?: 'active' | 'not_started';
  totalEstimatedHours?: number | null;
  courses: {
    step: number;
    courseId: string;
    course: Course;
    status: 'not_started' | 'in_progress' | 'completed';
    progressPercent: number;
    reason: string;
  }[];
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface QuizQuestionGenerated {
  id: string;
  questionText: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  options: { id: string; text: string }[];
  correctAnswers: string[];
  explanation: string;
  topicTag: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  creatorRole: UserRole;
  sourceType: 'uploaded_document' | 'pasted_text' | 'topic_prompt';
  sourceFilename?: string;
  isPublished: boolean;
  questionCount: number;
  difficulty: QuestionDifficulty;
  language: 'en' | 'hi';
  questions?: QuizQuestionGenerated[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizAttemptResult {
  id: string;
  quizId: string;
  quizTitle: string;
  userId: string;
  scorePercentage: number;
  totalQuestions: number;
  correctAnswersCount: number;
  timeSpentSeconds: number;
  submittedAt: string;
  weakTopics: { topic: string; incorrectCount: number; reviewRecommendation: string }[];
  answers: {
    questionId: string;
    questionText: string;
    selectedOptions: string[];
    correctOptions: string[];
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface AIChatMessage {
  id: string;
  conversationId: string;
  userId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

export interface LearnerDashboardStats {
  profile: UserProfile;
  overallReadiness: number;
  completedCoursesCount: number;
  inProgressCoursesCount: number;
  totalLearningHours: number;
  totalQuizzesAttempted: number;
  averageQuizScore: number;
  topGaps: SkillGapItem[];
  recentAssessments: AssessmentAttempt[];
  recentQuizAttempts: QuizAttemptResult[];
  recommendedCourses: CourseRecommendation[];
  radarData: { skill: string; current: number; required: number }[];
}

export interface AdminAnalyticsStats {
  totalLearners: number;
  totalQuizzesGenerated: number;
  totalAssessmentsCompleted: number;
  avgPlatformReadiness: number;
  popularRoles: { roleTitle: string; learnerCount: number }[];
  commonSkillGaps: { skillName: string; gapFrequency: number; avgGap: number }[];
  domainDistribution: { domainName: string; skillCount: number; learnerCount: number }[];
  recentLearnerActivity: {
    id: string;
    learnerName: string;
    action: string;
    detail: string;
    timestamp: string;
  }[];
}
