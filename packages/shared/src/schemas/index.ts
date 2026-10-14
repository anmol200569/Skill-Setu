import { z } from 'zod';

// ==========================================
// Authentication Schemas
// ==========================================
export const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  role: z.enum(['learner', 'trainer']).default('learner'),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const resetPasswordRequestSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const updatePasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

// ==========================================
// Profile & Onboarding Schemas
// ==========================================
export const onboardingSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  education: z.string().min(2, 'Education level is required'),
  experienceYears: z.number().min(0).max(50),
  currentStatus: z.enum(['student', 'job_seeker', 'employed', 'career_changer']),
  currentRole: z.string().optional(),
  targetRoleId: z.string().min(1, 'Target career role is required'),
  careerGoals: z.string().optional(),
  preferredLanguage: z.enum(['en', 'hi']).default('en'),
  weeklyStudyHours: z.number().min(1).max(60).default(10),
  learningPreferences: z.array(z.string()).default([]),
  initialSkills: z
    .array(
      z.object({
        skillId: z.string(),
        selfAssessedLevel: z.number().min(1).max(5),
      })
    )
    .optional(),
});

export const profileUpdateSchema = onboardingSchema.partial();

// ==========================================
// Competency Schemas
// ==========================================
export const createDomainSchema = z.object({
  code: z.string().min(2).max(50),
  name: z.string().min(2).max(100),
  description: z.string().min(5),
  icon: z.string().optional(),
});

export const createSkillSchema = z.object({
  domainId: z.string().min(1, 'Domain is required'),
  code: z.string().min(2).max(50),
  name: z.string().min(2).max(100),
  description: z.string().min(5),
  category: z.string().default('Technical'),
});

export const createRoleSchema = z.object({
  code: z.string().min(2).max(50),
  title: z.string().min(2).max(100),
  description: z.string().min(5),
  industryDemand: z.enum(['Moderate', 'High', 'Very High', 'Critical']).default('High'),
  skills: z.array(
    z.object({
      skillId: z.string(),
      requiredProficiency: z.number().min(1).max(5),
      priority: z.enum(['must_have', 'good_to_have', 'optional']),
      weight: z.number().min(0.1).max(2.0).default(1.0),
    })
  ),
});

// ==========================================
// Assessment Schemas
// ==========================================
export const submitAssessmentSchema = z.object({
  skillId: z.string().min(1, 'Skill is required'),
  targetRoleId: z.string().optional(),
  answers: z.array(
    z.object({
      questionId: z.string(),
      selectedOptions: z.array(z.string()),
      timeSpentSeconds: z.number().optional().default(0),
    })
  ),
});

// ==========================================
// AI Quiz Generator Schemas
// ==========================================
export const quizGenerateInputSchema = z.object({
  title: z.string().min(3, 'Title is required').max(150),
  topicOrText: z.string().min(20, 'Text content or topic must be at least 20 characters'),
  questionCount: z.number().int().min(3).max(20).default(5),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
  language: z.enum(['en', 'hi']).default('en'),
  allowedTypes: z.array(z.enum(['single_mcq', 'multi_mcq', 'true_false'])).default(['single_mcq']),
  sourceType: z.enum(['uploaded_document', 'pasted_text', 'topic_prompt']).default('pasted_text'),
  sourceFilename: z.string().optional(),
  skillId: z.string().optional().nullable(),
});

export type QuizGenerateInput = z.infer<typeof quizGenerateInputSchema>;

// Strict validation of Gemini generated question JSON
export const aiGeneratedQuestionSchema = z.object({
  questionText: z.string().min(5),
  type: z.enum(['single_mcq', 'multi_mcq', 'true_false']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  options: z.array(
    z.object({
      id: z.string(),
      text: z.string().min(1),
    })
  ).min(2),
  correctAnswers: z.array(z.string()).min(1),
  explanation: z.string().min(5),
  topicTag: z.string().min(2),
});

export const aiGeneratedQuizOutputSchema = z.object({
  quizTitle: z.string().min(3),
  description: z.string(),
  questions: z.array(aiGeneratedQuestionSchema).min(1),
});

export const submitQuizAttemptSchema = z.object({
  quizId: z.string().min(1, 'Quiz ID is required'),
  timeSpentSeconds: z.number().min(0).default(0),
  answers: z.array(
    z.object({
      questionId: z.string(),
      selectedOptions: z.array(z.string()),
    })
  ),
});

// ==========================================
// AI Learning Assistant Chat Schemas
// ==========================================
export const aiChatRequestSchema = z.object({
  conversationId: z.string().optional(),
  message: z.string().min(1, 'Message cannot be empty').max(2000, 'Message is too long'),
  skillContextId: z.string().optional(),
});

// ==========================================
// Course & Recommendation Schemas
// ==========================================
export const courseFilterSchema = z.object({
  domainId: z.string().optional(),
  skillId: z.string().optional(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced', 'All Levels']).optional(),
  language: z.enum(['English', 'Hindi', 'Bilingual']).optional(),
  isFree: z.boolean().optional(),
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});
