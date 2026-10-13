import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const clientSignupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  role: z.enum(['learner', 'trainer'])
});

describe('Client-Side Auth Validation', () => {
  it('validates robust password meeting complexity criteria', () => {
    const valid = clientSignupSchema.safeParse({
      fullName: 'Anmol Singh',
      email: 'anmol@skillsetu.dev',
      password: 'SecurePassword123',
      role: 'learner'
    });
    expect(valid.success).toBe(true);
  });

  it('rejects passwords without numbers or uppercase characters', () => {
    const invalidNoNumber = clientSignupSchema.safeParse({
      fullName: 'Anmol Singh',
      email: 'anmol@skillsetu.dev',
      password: 'passwordonly',
      role: 'learner'
    });
    expect(invalidNoNumber.success).toBe(false);

    const invalidShort = clientSignupSchema.safeParse({
      fullName: 'Anmol Singh',
      email: 'anmol@skillsetu.dev',
      password: 'Pass1',
      role: 'learner'
    });
    expect(invalidShort.success).toBe(false);
  });

  it('rejects invalid email addresses', () => {
    const invalidEmail = clientSignupSchema.safeParse({
      fullName: 'Anmol Singh',
      email: 'not-an-email',
      password: 'ValidPassword1',
      role: 'learner'
    });
    expect(invalidEmail.success).toBe(false);
  });
});

describe('Onboarding Role Prefill Isolation', () => {
  const roles = [
    { id: 'role-1', code: 'frontend-developer', title: 'Frontend Developer' },
    { id: 'role-2', code: 'data-engineer', title: 'Data Engineer' }
  ];

  function resolveInitialOnboardingRole(
    wizardParam: string | null,
    fetchedRoles: Array<{ id: string; code: string }>
  ): { selectedRoleId: string; isPrefilled: boolean } {
    let selectedRoleId = '';
    let isPrefilled = false;

    if (wizardParam) {
      const matched = fetchedRoles.find(
        (r) => r.code === wizardParam || r.id === wizardParam
      );
      if (matched) {
        selectedRoleId = matched.id;
        isPrefilled = true;
      }
    }

    return { selectedRoleId, isPrefilled };
  }

  it('does NOT preselect any role when user lands without wizard answers (no default to first role)', () => {
    const result = resolveInitialOnboardingRole(null, roles);
    expect(result.selectedRoleId).toBe('');
    expect(result.isPrefilled).toBe(false);
  });

  it('preselects matching role and applies Prefilled badge when valid wizard answer is provided', () => {
    const result = resolveInitialOnboardingRole('frontend-developer', roles);
    expect(result.selectedRoleId).toBe('role-1');
    expect(result.isPrefilled).toBe(true);
  });

  it('does NOT preselect any role when wizard param does not match any existing role', () => {
    const result = resolveInitialOnboardingRole('unknown-role', roles);
    expect(result.selectedRoleId).toBe('');
    expect(result.isPrefilled).toBe(false);
  });
});

