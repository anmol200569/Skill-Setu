import { describe, it, expect } from 'vitest';

export interface MockSkill {
  id: string;
  code: string;
  name: string;
  category: string;
}

export interface MockRole {
  id: string;
  code: string;
  title: string;
  skillsRequired: Array<{ skillId: string; requiredProficiency: number }>;
}

export function resolveDiagnosticTargetSkill(
  skillParam: string | null | undefined,
  allSkills: MockSkill[]
): { targetSkill: MockSkill | null; error: string | null } {
  if (!skillParam || !skillParam.trim()) {
    return { targetSkill: null, error: null };
  }
  const trimmed = skillParam.trim();
  const found = allSkills.find(
    (s) =>
      s.id === trimmed ||
      (s.code && s.code.toLowerCase() === trimmed.toLowerCase()) ||
      s.name.toLowerCase() === trimmed.toLowerCase()
  );

  if (found) {
    return { targetSkill: found, error: null };
  }

  return {
    targetSkill: null,
    error: `The requested diagnostic skill ("${trimmed}") was not found. Please select an assessment from your target role requirements below.`
  };
}

export function filterSkillsToTargetRole(
  allSkills: MockSkill[],
  targetRole: MockRole | null
): MockSkill[] {
  if (!targetRole || !targetRole.skillsRequired || targetRole.skillsRequired.length === 0) {
    return allSkills;
  }
  const reqSkillIds = new Set(targetRole.skillsRequired.map((sr) => sr.skillId));
  return allSkills.filter((s) => reqSkillIds.has(s.id));
}

describe('Diagnostic Deep Links & Role Filtering (Item 4)', () => {
  const mockSkills: MockSkill[] = [
    { id: 'sk-sql', code: 'sql', name: 'SQL & Database Optimization', category: 'Data' },
    { id: 'sk-react', code: 'react', name: 'React', category: 'Frontend' },
    { id: 'sk-node', code: 'node', name: 'Node.js', category: 'Backend' },
    { id: 'sk-prod', code: 'product-strategy', name: 'Product Strategy & Vision', category: 'Product' }
  ];

  const productManagerRole: MockRole = {
    id: 'role-pm',
    code: 'product-manager',
    title: 'Product Manager',
    skillsRequired: [
      { skillId: 'sk-prod', requiredProficiency: 4 },
      { skillId: 'sk-sql', requiredProficiency: 3 }
    ]
  };

  it('resolves valid skill deep-link by skill ID directly', () => {
    const { targetSkill, error } = resolveDiagnosticTargetSkill('sk-sql', mockSkills);
    expect(error).toBeNull();
    expect(targetSkill).toBeDefined();
    expect(targetSkill?.id).toBe('sk-sql');
    expect(targetSkill?.name).toBe('SQL & Database Optimization');
  });

  it('resolves valid skill deep-link by skill code case-insensitively', () => {
    const { targetSkill, error } = resolveDiagnosticTargetSkill('SQL', mockSkills);
    expect(error).toBeNull();
    expect(targetSkill?.id).toBe('sk-sql');
  });

  it('returns clear actionable error when deep-link skill id is invalid or not found', () => {
    const { targetSkill, error } = resolveDiagnosticTargetSkill('non-existent-skill', mockSkills);
    expect(targetSkill).toBeNull();
    expect(error).toContain('The requested diagnostic skill ("non-existent-skill") was not found');
  });

  it('filters catalog strictly to target role required skills', () => {
    const filtered = filterSkillsToTargetRole(mockSkills, productManagerRole);
    expect(filtered).toHaveLength(2);
    const skillIds = filtered.map((s) => s.id);
    expect(skillIds).toContain('sk-prod');
    expect(skillIds).toContain('sk-sql');
    // React and Node.js must not be offered to Product Manager
    expect(skillIds).not.toContain('sk-react');
    expect(skillIds).not.toContain('sk-node');
  });
});
