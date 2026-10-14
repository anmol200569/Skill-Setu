import { UserRole } from '@skill-setu/shared';

export interface AuthRedirectParams {
  user: any;
  profile: any;
  role?: UserRole;
}

/**
 * Determines whether an authenticated user on the public landing page
 * should be redirected to their internal dashboard.
 * Logged-in users with a saved target role or who have completed onboarding
 * should never see the visitor wizard.
 */
export function getLandingPageRedirect({
  user,
  profile,
  role = 'learner'
}: AuthRedirectParams): string | null {
  if (!user) return null;

  // Logged-in users with a saved target role or completed onboarding navigate to dashboard
  if (profile?.targetRoleId || profile?.isOnboarded) {
    if (role === 'admin' || role === 'trainer') {
      return '/admin';
    }
    return '/dashboard';
  }

  return null;
}

/**
 * Derives the preselected wizard role from user profile if available,
 * avoiding hardcoded defaults (e.g. Data Analyst profile role must preselect data-analyst).
 */
export function getPrefilledWizardRole(
  profile: any,
  fallback: string = 'fullstack-dev'
): string {
  if (!profile) return fallback;

  const roleCodeOrTitle = (
    profile.targetRole?.code ||
    profile.targetRoleName ||
    profile.targetRole?.title ||
    profile.targetRoleId ||
    ''
  ).toLowerCase();

  if (
    roleCodeOrTitle.includes('data-analyst') ||
    roleCodeOrTitle.includes('analyst') ||
    roleCodeOrTitle.includes('data')
  ) {
    return 'data-analyst';
  }
  if (
    roleCodeOrTitle.includes('cloud') ||
    roleCodeOrTitle.includes('devops')
  ) {
    return 'cloud-engineer';
  }
  if (
    roleCodeOrTitle.includes('ml') ||
    roleCodeOrTitle.includes('machine') ||
    roleCodeOrTitle.includes('ai')
  ) {
    return 'ml-engineer';
  }
  if (
    roleCodeOrTitle.includes('sec') ||
    roleCodeOrTitle.includes('security')
  ) {
    return 'appsec-engineer';
  }
  if (
    roleCodeOrTitle.includes('fullstack') ||
    roleCodeOrTitle.includes('developer')
  ) {
    return 'fullstack-dev';
  }

  return fallback;
}
