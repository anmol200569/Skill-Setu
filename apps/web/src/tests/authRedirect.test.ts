import { describe, it, expect } from 'vitest';
import { getLandingPageRedirect, getPrefilledWizardRole, getAuthCallbackRedirect } from '../lib/authRedirect';
import { getProtectedRouteRedirect } from '../components/layout/ProtectedRoute';

describe('BUG 1: Visitor Wizard Redirect & Role Prefill Logic', () => {
  describe('getLandingPageRedirect', () => {
    it('redirects authenticated learner with saved targetRoleId to /dashboard', () => {
      const redirect = getLandingPageRedirect({
        user: { id: 'user-123', email: 'learner@example.com' },
        profile: { id: 'prof-1', targetRoleId: 'role-da-1', isOnboarded: true },
        role: 'learner'
      });
      expect(redirect).toBe('/dashboard');
    });

    it('redirects authenticated learner who is onboarded to /dashboard', () => {
      const redirect = getLandingPageRedirect({
        user: { id: 'user-123', email: 'learner@example.com' },
        profile: { id: 'prof-1', targetRoleId: null, isOnboarded: true },
        role: 'learner'
      });
      expect(redirect).toBe('/dashboard');
    });

    it('redirects authenticated admin with saved role to /admin', () => {
      const redirect = getLandingPageRedirect({
        user: { id: 'admin-123', email: 'admin@example.com' },
        profile: { id: 'prof-admin', targetRoleId: 'role-any', isOnboarded: true },
        role: 'admin'
      });
      expect(redirect).toBe('/admin');
    });

    it('returns null for unauthenticated visitor (user: null)', () => {
      const redirect = getLandingPageRedirect({
        user: null,
        profile: null,
        role: 'learner'
      });
      expect(redirect).toBeNull();
    });

    it('returns null for authenticated learner without target role and not onboarded', () => {
      const redirect = getLandingPageRedirect({
        user: { id: 'user-new', email: 'new@example.com' },
        profile: { id: 'prof-new', targetRoleId: null, isOnboarded: false },
        role: 'learner'
      });
      expect(redirect).toBeNull();
    });
  });

  describe('getPrefilledWizardRole', () => {
    it('prefills data-analyst when profile targetRole is Data Analyst', () => {
      const profile = {
        targetRoleId: 'role-da-uuid',
        targetRoleName: 'Data Analyst',
        targetRole: {
          id: 'role-da-uuid',
          code: 'data-analyst',
          title: 'Data Analyst'
        }
      };
      const prefilled = getPrefilledWizardRole(profile);
      expect(prefilled).toBe('data-analyst');
    });

    it('prefills data-analyst when profile only has targetRoleName: "Junior Data Analyst"', () => {
      const profile = {
        targetRoleId: 'role-da-uuid',
        targetRoleName: 'Junior Data Analyst'
      };
      const prefilled = getPrefilledWizardRole(profile);
      expect(prefilled).toBe('data-analyst');
    });

    it('prefills cloud-engineer when profile role is Cloud / DevOps', () => {
      const profile = {
        targetRole: { code: 'cloud-devops', title: 'Cloud & DevOps Engineer' }
      };
      expect(getPrefilledWizardRole(profile)).toBe('cloud-engineer');
    });

    it('prefills ml-engineer when profile role is AI / ML Engineer', () => {
      const profile = {
        targetRole: { code: 'ai-ml', title: 'Machine Learning Engineer' }
      };
      expect(getPrefilledWizardRole(profile)).toBe('ml-engineer');
    });

    it('prefills appsec-engineer when profile role is Cybersecurity', () => {
      const profile = {
        targetRole: { code: 'cybersecurity', title: 'Application Security Engineer' }
      };
      expect(getPrefilledWizardRole(profile)).toBe('appsec-engineer');
    });

    it('falls back to default fallback role if profile is null', () => {
      expect(getPrefilledWizardRole(null, 'fullstack-dev')).toBe('fullstack-dev');
    });
  });

  describe('ProtectedRoute /onboarding guard', () => {
    it('redirects an already onboarded learner with targetRoleId away from /onboarding to /dashboard', () => {
      const redirect = getProtectedRouteRedirect({
        user: { id: 'learner-1', email: 'learner@example.com' },
        profile: { id: 'prof-1', isOnboarded: true, targetRoleId: 'role-da-1' },
        role: 'learner',
        pathname: '/onboarding'
      });
      expect(redirect).toBe('/dashboard');
    });

    it('allows a non-onboarded learner to stay on /onboarding', () => {
      const redirect = getProtectedRouteRedirect({
        user: { id: 'learner-1', email: 'learner@example.com' },
        profile: { id: 'prof-1', isOnboarded: false, targetRoleId: null },
        role: 'learner',
        pathname: '/onboarding'
      });
      expect(redirect).toBeNull();
    });
  });

  describe('OAuth AuthCallback Redirect Logic', () => {
    it('redirects to /onboarding when profile is null (new OAuth user without profile)', () => {
      const dest = getAuthCallbackRedirect({
        profile: null,
        savedReturnPath: '/dashboard'
      });
      expect(dest).toBe('/onboarding');
    });

    it('redirects to /onboarding when profile.isOnboarded is false', () => {
      const dest = getAuthCallbackRedirect({
        profile: { isOnboarded: false },
        savedReturnPath: '/assessments?skill=sql-123'
      });
      expect(dest).toBe('/onboarding');
    });

    it('redirects to /dashboard when onboarded and no savedReturnPath', () => {
      const dest = getAuthCallbackRedirect({
        profile: { isOnboarded: true },
        savedReturnPath: null
      });
      expect(dest).toBe('/dashboard');
    });

    it('redirects to savedReturnPath when onboarded and valid path provided', () => {
      const dest = getAuthCallbackRedirect({
        profile: { isOnboarded: true },
        savedReturnPath: '/assessments?skill=sql-123'
      });
      expect(dest).toBe('/assessments?skill=sql-123');
    });

    it('ignores auth routes in savedReturnPath and falls back to /dashboard', () => {
      expect(getAuthCallbackRedirect({ profile: { isOnboarded: true }, savedReturnPath: '/login' })).toBe('/dashboard');
      expect(getAuthCallbackRedirect({ profile: { isOnboarded: true }, savedReturnPath: '/signup' })).toBe('/dashboard');
      expect(getAuthCallbackRedirect({ profile: { isOnboarded: true }, savedReturnPath: '/auth/callback' })).toBe('/dashboard');
    });

    it('ignores external or malformed URLs and falls back to /dashboard', () => {
      expect(getAuthCallbackRedirect({ profile: { isOnboarded: true }, savedReturnPath: 'https://malicious.com' })).toBe('/dashboard');
      expect(getAuthCallbackRedirect({ profile: { isOnboarded: true }, savedReturnPath: 'javascript:alert(1)' })).toBe('/dashboard');
    });
  });
});
