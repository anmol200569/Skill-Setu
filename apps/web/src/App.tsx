import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { OnboardingPage } from './pages/OnboardingPage';

// Learner pages & layout
import { LearnerLayout } from './components/layout/LearnerLayout';
import { DashboardPage } from './pages/learner/DashboardPage';
import { AssessmentsPage } from './pages/learner/AssessmentsPage';
import { CoursesPage } from './pages/learner/CoursesPage';
import { LearningPathPage } from './pages/learner/LearningPathPage';
import { QuizzesPage } from './pages/learner/QuizzesPage';
import { ProfilePage } from './pages/learner/ProfilePage';

// Admin pages & layout
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { CompetencyManagerPage } from './pages/admin/CompetencyManagerPage';
import { CourseManagerPage } from './pages/admin/CourseManagerPage';
import { QuizManagerPage } from './pages/admin/QuizManagerPage';

// Guards
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { PublicOnlyRoute } from './components/layout/PublicOnlyRoute';
import { AuthCallbackPage } from './pages/AuthCallbackPage';

export function App() {
  return (
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
  );
}
export default App;
