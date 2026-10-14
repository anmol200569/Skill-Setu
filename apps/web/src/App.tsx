import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public & Auth Pages (Lazy-loaded)
const LandingPage = lazy(() => import('./pages/LandingPage').then((m) => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('./pages/SignupPage').then((m) => ({ default: m.SignupPage })));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage').then((m) => ({ default: m.OnboardingPage })));
const AuthCallbackPage = lazy(() => import('./pages/AuthCallbackPage').then((m) => ({ default: m.AuthCallbackPage })));

// Learner Pages & Layout
import { LearnerLayout } from './components/layout/LearnerLayout';
const DashboardPage = lazy(() => import('./pages/learner/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const AssessmentsPage = lazy(() => import('./pages/learner/AssessmentsPage').then((m) => ({ default: m.AssessmentsPage })));
const CoursesPage = lazy(() => import('./pages/learner/CoursesPage').then((m) => ({ default: m.CoursesPage })));
const LearningPathPage = lazy(() => import('./pages/learner/LearningPathPage').then((m) => ({ default: m.LearningPathPage })));
const QuizzesPage = lazy(() => import('./pages/learner/QuizzesPage').then((m) => ({ default: m.QuizzesPage })));
const ProfilePage = lazy(() => import('./pages/learner/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const SkillGapsPage = lazy(() => import('./pages/learner/SkillGapsPage').then((m) => ({ default: m.SkillGapsPage })));

// Admin Pages & Layout
import { AdminLayout } from './components/layout/AdminLayout';
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })));
const CompetencyManagerPage = lazy(() => import('./pages/admin/CompetencyManagerPage').then((m) => ({ default: m.CompetencyManagerPage })));
const CourseManagerPage = lazy(() => import('./pages/admin/CourseManagerPage').then((m) => ({ default: m.CourseManagerPage })));
const QuizManagerPage = lazy(() => import('./pages/admin/QuizManagerPage').then((m) => ({ default: m.QuizManagerPage })));

// Guards
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { PublicOnlyRoute } from './components/layout/PublicOnlyRoute';

function PageFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-muted-foreground font-medium">Loading page...</span>
      </div>
    </div>
  );
}

export function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <SignupPage />
            </PublicOnlyRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* Onboarding Wizard */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />

        {/* Learner Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <LearnerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/assessments" element={<AssessmentsPage />} />
          <Route path="/skill-gaps" element={<SkillGapsPage />} />
          <Route path="/roadmap" element={<LearningPathPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/learning-path" element={<LearningPathPage />} />
          <Route path="/quizzes" element={<QuizzesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin', 'trainer']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="competency" element={<CompetencyManagerPage />} />
          <Route path="courses" element={<CourseManagerPage />} />
          <Route path="quizzes" element={<QuizManagerPage />} />
          <Route path="learners" element={<AdminDashboardPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
