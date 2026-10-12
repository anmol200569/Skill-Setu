import { describe, it, expect } from 'vitest';
import { getProtectedRouteRedirect } from '../components/layout/ProtectedRoute';

describe('ProtectedRoute redirection logic', () => {
  it('redirects unauthenticated users to /login', () => {
    const result = getProtectedRouteRedirect({
      user: null,
      profile: null,
      role: 'learner',
      pathname: '/dashboard'
    });
    expect(result).toBe('/login');
  });

  it('redirects new learner with profile === null to /onboarding when visiting /dashboard', () => {
    const result = getProtectedRouteRedirect({
      user: { id: 'usr-1', email: 'learner@example.com' },
      profile: null,
      role: 'learner',
      pathname: '/dashboard'
    });
    expect(result).toBe('/onboarding');
  });

  it('redirects learner with profile.isOnboarded === false to /onboarding', () => {
    const result = getProtectedRouteRedirect({
      user: { id: 'usr-1', email: 'learner@example.com' },
      profile: { id: 'prof-1', isOnboarded: false },
      role: 'learner',
      pathname: '/dashboard'
    });
    expect(result).toBe('/onboarding');
  });

  it('does NOT redirect learner when already on /onboarding', () => {
    const result = getProtectedRouteRedirect({
      user: { id: 'usr-1', email: 'learner@example.com' },
      profile: null,
      role: 'learner',
      pathname: '/onboarding'
    });
    expect(result).toBeNull();
  });

  it('does NOT redirect onboarded learner on /dashboard', () => {
    const result = getProtectedRouteRedirect({
      user: { id: 'usr-1', email: 'learner@example.com' },
      profile: { id: 'prof-1', isOnboarded: true },
      role: 'learner',
      pathname: '/dashboard'
    });
    expect(result).toBeNull();
  });

  it('does NOT force admin with null profile to /onboarding', () => {
    const result = getProtectedRouteRedirect({
      user: { id: 'admin-1', email: 'admin@skillsetu.dev' },
      profile: null,
      role: 'admin',
      pathname: '/admin'
    });
    expect(result).toBeNull();
  });

  it('does NOT force trainer with null profile to /onboarding', () => {
    const result = getProtectedRouteRedirect({
      user: { id: 'trainer-1', email: 'trainer@skillsetu.dev' },
      profile: null,
      role: 'trainer',
      pathname: '/admin'
    });
    expect(result).toBeNull();
  });

  it('redirects learner attempting to access admin route to /dashboard', () => {
    const result = getProtectedRouteRedirect({
      user: { id: 'usr-1', email: 'learner@example.com' },
      profile: { id: 'prof-1', isOnboarded: true },
      role: 'learner',
      pathname: '/admin',
      allowedRoles: ['admin', 'trainer']
    });
    expect(result).toBe('/dashboard');
  });
});
