import { describe, it, expect } from 'vitest';

export function determineOnboardingCompletionRedirect(
  selectedRoleId: string,
  roles: Array<{
    id: string;
    skillsRequired?: Array<{ skillId?: string; skill?: { id: string } }>;
  }>
): string {
  const selectedRole = roles.find((r) => r.id === selectedRoleId);
  const firstSkillId =
    selectedRole?.skillsRequired?.[0]?.skillId ||
    selectedRole?.skillsRequired?.[0]?.skill?.id ||
    '';

  if (firstSkillId) {
    return `/assessments?skillId=${encodeURIComponent(firstSkillId)}&startBaseline=true`;
  }
  return '/assessments?startBaseline=true';
}

describe('Onboarding Post-Submission Redirect (Task D1)', () => {
  const mockRoles = [
    {
      id: 'role-fullstack',
      code: 'fullstack-developer',
      title: 'Full Stack Developer',
      skillsRequired: [
        { skillId: 'skill-react-101', skill: { id: 'skill-react-101' } },
        { skillId: 'skill-node-201', skill: { id: 'skill-node-201' } }
      ]
    },
    {
      id: 'role-empty-skills',
      code: 'general-track',
      title: 'General Track',
      skillsRequired: []
    }
  ];

  it('navigates to /assessments with the first required unassessed skill preselected and startBaseline prompt', () => {
    const destination = determineOnboardingCompletionRedirect('role-fullstack', mockRoles);

    // MUST navigate to /assessments with first skill and startBaseline (NOT straight to /dashboard)
    expect(destination).toBe('/assessments?skillId=skill-react-101&startBaseline=true');
    expect(destination).not.toBe('/dashboard');
    expect(destination).toContain('startBaseline=true');
    expect(destination).toContain('skillId=skill-react-101');
  });

  it('falls back to /assessments?startBaseline=true if the selected role has no explicit skills list', () => {
    const destination = determineOnboardingCompletionRedirect('role-empty-skills', mockRoles);

    expect(destination).toBe('/assessments?startBaseline=true');
    expect(destination).not.toBe('/dashboard');
  });
});
