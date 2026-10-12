import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '@skill-setu/shared';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export interface ProtectedRouteRedirectParams {
  user: any;
  profile: any;
  role: UserRole;
  pathname: string;
  allowedRoles?: UserRole[];
}

export function getProtectedRouteRedirect({
  user,
  profile,
  role,
  pathname,
  allowedRoles
}: ProtectedRouteRedirectParams): string | null {
  if (!user) {
    return '/login';
  }

  // Redirect to /onboarding when (!profile || !profile.isOnboarded) for learners (not admin/trainer), unless already on /onboarding
  const isLearner = role === 'learner';
  if (isLearner && (!profile || !profile.isOnboarded) && pathname !== '/onboarding') {
    return '/onboarding';
  }

  // Check role restrictions
  if (allowedRoles && !allowedRoles.includes(role)) {
    return '/dashboard';
  }

  return null;
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, profile, role, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#C2410C]" />
          <span className="text-sm font-medium text-muted-foreground">Authenticating session...</span>
        </div>
      </div>
    );
  }

  const redirectPath = getProtectedRouteRedirect({
    user,
    profile,
    role,
    pathname: location.pathname,
    allowedRoles
  });

  if (redirectPath) {
    if (redirectPath === '/login') {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}
