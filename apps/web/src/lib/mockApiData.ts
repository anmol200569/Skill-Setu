/**
 * Offline Mock Responses for Local Verification & Test Users.
 * Used when backend API server is unreachable, ensuring local UI testing works offline.
 */

export const mockRoles = [
  {
    id: 'role-fullstack',
    title: 'Full Stack Developer (React & Node.js)',
    description: 'Build end-to-end web applications with modern frontend and scalable APIs',
    code: 'FS-01'
  },
  {
    id: 'role-frontend',
    title: 'Frontend Engineer (React & TypeScript)',
    description: 'Design accessible, responsive user interfaces and client architecture',
    code: 'FE-01'
  },
  {
    id: 'role-backend',
    title: 'Backend Engineer (Node.js & Databases)',
    description: 'Develop high-throughput REST APIs and reliable database systems',
    code: 'BE-01'
  }
];

export const mockLearnerStats = {
  status: 'active',
  targetRoleId: 'role-fullstack',
  targetRoleTitle: 'Full Stack Developer (React & Node.js)',
  overallReadiness: 74,
  assessedSkillsCount: 5,
  totalSkillsCount: 6,
  hoursStudied: 18.5,
  completedCoursesCount: 2,
  diagnosticAttemptsCount: 5,
  avgScore: 84,
  readinessTrend: [
    { date: '10 Sep', score: 52 },
    { date: '22 Sep', score: 61 },
    { date: '04 Oct', score: 68 },
    { date: '14 Oct', score: 74 }
  ],
  radarData: [
    { skill: 'React Architecture', current: 3.8, required: 4.5 },
    { skill: 'Node.js REST APIs', current: 3.4, required: 4.0 },
    { skill: 'SQL Database Optimization', current: 2.2, required: 4.0 },
    { skill: 'Docker & Containers', current: 1.5, required: 3.5 },
    { skill: 'TypeScript Type Safety', current: 4.2, required: 4.0 },
    { skill: 'System Security & Auth', current: null, required: 3.5 }
  ],
  topGaps: [
    {
      skillId: 'skill-docker',
      skillName: 'Docker & Containers',
      domainName: 'DevOps & Cloud',
      requiredLevel: 3.5,
      currentLevel: 1.5,
      gap: 2.0,
      weight: 1.5,
      priority: 'critical',
      isAssessed: true,
      topics: ['Containerization', 'Multi-stage Builds', 'Docker Compose', 'Volume Mapping'],
      evidence: 'Diagnostic Assessment #3 (42% accuracy)',
      mappedCourses: [
        { title: 'Docker Essentials & Container Workflows', provider: 'freeCodeCamp', hours: 6 }
      ]
    },
    {
      skillId: 'skill-sql',
      skillName: 'SQL Database Optimization',
      domainName: 'Data Management',
      requiredLevel: 4.0,
      currentLevel: 2.2,
      gap: 1.8,
      weight: 1.4,
      priority: 'high',
      isAssessed: true,
      topics: ['Indexing Strategies', 'Query Execution Plans', 'ACID Transactions', 'Connection Pooling'],
      evidence: 'Diagnostic Assessment #2 (55% accuracy)',
      mappedCourses: [
        { title: 'Database Systems & Index Tuning', provider: 'Coursera', hours: 8 }
      ]
    },
    {
      skillId: 'skill-react',
      skillName: 'React Architecture',
      domainName: 'Frontend Engineering',
      requiredLevel: 4.5,
      currentLevel: 3.8,
      gap: 0.7,
      weight: 1.2,
      priority: 'medium',
      isAssessed: true,
      topics: ['Custom Hooks', 'State Colocation', 'Suspense & Lazy', 'Accessibility (a11y)'],
      evidence: 'Diagnostic Assessment #1 (84% accuracy)',
      mappedCourses: [
        { title: 'Advanced React Patterns & Performance', provider: 'Frontend Masters', hours: 10 }
      ]
    },
    {
      skillId: 'skill-ts',
      skillName: 'TypeScript Type Safety',
      domainName: 'Programming Languages',
      requiredLevel: 4.0,
      currentLevel: 4.2,
      gap: 0,
      weight: 1.0,
      priority: 'low',
      isAssessed: true,
      topics: ['Generics', 'Conditional Types', 'Discriminated Unions'],
      evidence: 'Diagnostic Assessment #4 (90% accuracy)'
    }
  ],
  unassessedSkills: [
    {
      skillId: 'skill-sec',
      skillName: 'System Security & Auth',
      requiredLevel: 3.5,
      weight: 1.3,
      priority: 'high',
      domainName: 'Security'
    }
  ],
  recommendedCourses: [
    {
      course: {
        id: 'c-docker',
        title: 'Docker Essentials & Container Workflows',
        provider: 'freeCodeCamp',
        estimatedHours: 6,
        difficulty: 'Intermediate',
        isFree: true,
        destinationUrl: 'https://www.freecodecamp.org',
        skillsCovered: ['Docker & Containers']
      },
      matchingSkill: 'Docker & Containers',
      recommendationReason: 'Bridges your highest impact container deficit (-2.0)'
    },
    {
      course: {
        id: 'c-sql',
        title: 'Database Systems & Index Tuning',
        provider: 'Coursera',
        estimatedHours: 8,
        difficulty: 'Intermediate',
        isFree: true,
        destinationUrl: 'https://www.coursera.org',
        skillsCovered: ['SQL Database Optimization']
      },
      matchingSkill: 'SQL Database Optimization',
      recommendationReason: 'Strengthens SQL query planning before capstone project'
    }
  ]
};

export const mockLearningPath = {
  id: 'lp-01',
  targetRoleTitle: 'Full Stack Developer (React & Node.js)',
  totalHours: 32,
  items: [
    {
      step: 1,
      courseId: 'c-docker',
      status: 'in_progress',
      progressPercent: 65,
      reason: 'Directly addresses highest-priority container deficit (-2.0)',
      course: {
        id: 'c-docker',
        title: 'Docker Essentials & Container Workflows',
        provider: 'freeCodeCamp',
        destinationUrl: 'https://www.freecodecamp.org',
        estimatedHours: 6,
        difficulty: 'Intermediate',
        language: 'English',
        skillsCovered: ['Docker & Containers', 'DevOps']
      }
    },
    {
      step: 2,
      courseId: 'c-sql',
      status: 'not_started',
      progressPercent: 0,
      reason: 'Addresses SQL database optimization gap (-1.8)',
      course: {
        id: 'c-sql',
        title: 'Database Systems & Index Tuning',
        provider: 'Coursera',
        destinationUrl: 'https://www.coursera.org',
        estimatedHours: 8,
        difficulty: 'Intermediate',
        language: 'English',
        skillsCovered: ['SQL Database Optimization', 'Indexing']
      }
    },
    {
      step: 3,
      courseId: 'c-react',
      status: 'completed',
      progressPercent: 100,
      reason: 'Advanced React patterns & performance optimization',
      course: {
        id: 'c-react',
        title: 'Advanced React Patterns & Performance',
        provider: 'Frontend Masters',
        destinationUrl: 'https://frontendmasters.com',
        estimatedHours: 10,
        difficulty: 'Advanced',
        language: 'English',
        skillsCovered: ['React Architecture', 'Performance']
      }
    }
  ]
};

export function generate61Courses() {
  const providers = ['freeCodeCamp', 'Coursera', 'Frontend Masters', 'edX', 'Udemy', 'Microsoft Learn'];
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
  const languages = ['English', 'Hindi'];
  const skillsPool = [
    'React Architecture', 'Node.js REST APIs', 'SQL Database Optimization',
    'Docker & Containers', 'TypeScript Type Safety', 'System Security & Auth',
    'GraphQL APIs', 'Redis Caching', 'Kubernetes Orchestration', 'Microservices Architecture'
  ];

  const courses = [];
  for (let i = 1; i <= 61; i++) {
    const prov = providers[i % providers.length];
    const diff = difficulties[i % difficulties.length];
    const lang = languages[i % languages.length];
    const skill1 = skillsPool[i % skillsPool.length];
    const skill2 = skillsPool[(i + 3) % skillsPool.length];

    courses.push({
      id: `course-${i}`,
      title: i === 1
        ? 'Docker Essentials & Container Workflows'
        : i === 2
        ? 'Database Systems & Index Tuning'
        : i === 3
        ? 'Advanced React Patterns & Performance'
        : `Practical ${skill1} Mastery (Module ${i})`,
      provider: prov,
      destinationUrl: 'https://www.example.com',
      skillsCovered: [skill1, skill2],
      difficulty: diff,
      estimatedHours: 4 + (i % 12),
      language: lang,
      isFree: i % 3 !== 0,
      rating: 4.5 + ((i % 5) * 0.1),
      ratingSource: prov,
      description: `Comprehensive hands-on course covering core principles, code patterns, and real-world case studies in ${skill1}.`
    });
  }
  return courses;
}
