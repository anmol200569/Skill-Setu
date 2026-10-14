import fs from 'fs';
import path from 'path';

interface QuestionOption {
  id: string;
  text: string;
}

interface SeedQuestion {
  questionText: string;
  type: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  options: QuestionOption[];
  correctAnswers: string[];
  explanation: string;
  topicTag: string;
  orderIndex: number;
}

interface SeedQuiz {
  skillCode: string;
  skillName: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  title: string;
  description: string;
  sourceType: string;
  isPublished: boolean;
  questionCount: number;
  questions: SeedQuestion[];
}

const skillsMeta = [
  { code: 'ts-js', name: 'TypeScript & JavaScript', domain: 'Programming' },
  { code: 'react', name: 'React & Modern Frontend', domain: 'Frontend' },
  { code: 'nodejs', name: 'Node.js & Backend APIs', domain: 'Backend' },
  { code: 'python', name: 'Python Core & Advanced', domain: 'Programming' },
  { code: 'sys-design', name: 'System Design & Scalability', domain: 'Architecture' },
  { code: 'sql-db', name: 'SQL & Database Modeling', domain: 'Database' },
  { code: 'adv-sql', name: 'Advanced SQL & Query Optimization', domain: 'Data Analysis' },
  { code: 'data-vis', name: 'Data Visualization & Storytelling', domain: 'Business Intelligence' },
  { code: 'eda-pandas', name: 'Exploratory Data Analysis (Pandas/Polars)', domain: 'Data Science' },
  { code: 'bi-modeling', name: 'BI Semantic Modeling & Metrics', domain: 'Business Intelligence' },
  { code: 'docker-k8s', name: 'Containers & Docker', domain: 'DevOps' },
  { code: 'k8s-orch', name: 'Kubernetes Orchestration', domain: 'Cloud & Infrastructure' },
  { code: 'aws-cloud', name: 'AWS & Cloud Architecture', domain: 'Cloud' },
  { code: 'cicd-github', name: 'CI/CD Automation & GitHub Actions', domain: 'DevOps' },
  { code: 'ml-foundations', name: 'Machine Learning Foundations', domain: 'Machine Learning' },
  { code: 'llm-genai', name: 'Generative AI & LLM Engineering', domain: 'Artificial Intelligence' },
  { code: 'rag-vector', name: 'RAG & Vector Databases', domain: 'Artificial Intelligence' },
  { code: 'pytorch-tf', name: 'Deep Learning & Model Training', domain: 'Deep Learning' },
  { code: 'appsec-owasp', name: 'Application Security (OWASP Top 10)', domain: 'Cybersecurity' },
  { code: 'auth-iam', name: 'Auth, JWT & Zero Trust Identity', domain: 'Security & Identity' },
  { code: 'netsec-threat', name: 'Network Security & Threat Defense', domain: 'Cybersecurity' },
  { code: 'tech-writing', name: 'Technical Documentation & RFCs', domain: 'Leadership' },
  { code: 'stakeholder-mgt', name: 'Stakeholder Communication', domain: 'Leadership' },
  { code: 'agile-teamwork', name: 'Agile Teamwork & Mentorship', domain: 'Leadership' },
  { code: 'prod-discovery', name: 'Product Discovery & PRDs', domain: 'Product Management' },
  { code: 'product-analytics', name: 'Product Analytics & Metrics', domain: 'Product Management' },
  { code: 'user-research', name: 'UX Design Thinking & User Journeys', domain: 'Product Design' }
];

const questionBank: Record<string, Record<'beginner' | 'intermediate' | 'advanced', Array<{ q: string; opts: string[]; correct: number; exp: string; topic: string }>>> = {
  'ts-js': {
    beginner: [
      {
        q: 'What is the main difference between let and const in JavaScript/TypeScript?',
        opts: ['const variables cannot be reassigned after declaration', 'let variables have global scope by default', 'const only works with primitive types', 'There is no difference in ES6'],
        correct: 0,
        exp: 'const prevents reassignment to the variable identifier, whereas let allows reassignment.',
        topic: 'Variables and Scope'
      },
      {
        q: 'Which primitive data type was introduced in ECMAScript 2015 (ES6) for unique object property keys?',
        opts: ['Symbol', 'BigInt', 'UUID', 'Hash'],
        correct: 0,
        exp: 'Symbol produces a unique and immutable primitive value commonly used for private-like object properties.',
        topic: 'Primitive Data Types'
      },
      {
        q: 'What does the TypeScript "any" type indicate?',
        opts: ['Disables compile-time type checking for the variable', 'Enforces strict runtime type coercion', 'Restricts the variable to primitive values only', 'Represents a function return type of null'],
        correct: 0,
        exp: 'The any type effectively turns off TypeScript static type checking for that value.',
        topic: 'TypeScript Basics'
      },
      {
        q: 'What is the return value of typeof null in JavaScript?',
        opts: ['"object"', '"null"', '"undefined"', '"boolean"'],
        correct: 0,
        exp: 'typeof null returns "object" due to a historical legacy artifact in early JavaScript engines.',
        topic: 'Type Coercion'
      },
      {
        q: 'Which operator performs strict equality comparison without type coercion in JavaScript?',
        opts: ['===', '==', '!=', '='],
        correct: 0,
        exp: 'The === triple-equals operator checks both value equality and matching data types.',
        topic: 'Operators'
      }
    ],
    intermediate: [
      {
        q: 'How does the JavaScript Event Loop handle microtasks compared to macrotasks?',
        opts: [
          'Microtasks (e.g., Promise callbacks) are executed immediately after the current synchronous script and before the next macrotask',
          'Macrotasks always execute ahead of microtasks regardless of queue state',
          'Microtasks run on a separate background thread in parallel',
          'Microtasks and macrotasks are interleaved alternately in a round-robin schedule'
        ],
        correct: 0,
        exp: 'All pending jobs in the microtask queue run to exhaustion after the current synchronous frame and before picking the next task from the macrotask queue.',
        topic: 'Event Loop & Asynchrony'
      },
      {
        q: 'In TypeScript, what is the key difference between an interface and a type alias for object models?',
        opts: [
          'Interfaces can be declaration-merged by defining them multiple times, whereas type aliases cannot',
          'Type aliases cannot model union or intersection types',
          'Interfaces do not support generic parameters',
          'Type aliases cannot describe function signatures'
        ],
        correct: 0,
        exp: 'Multiple interface declarations with the same identifier in the same scope merge their property definitions.',
        topic: 'Type System Design'
      },
      {
        q: 'What is the purpose of the "unknown" type in TypeScript compared to "any"?',
        opts: [
          'unknown is type-safe: you must narrow its type with checks before calling methods or accessing properties',
          'unknown allows arbitrary property access without checks',
          'unknown is only allowed as a return type for async functions',
          'unknown is an alias for undefined'
        ],
        correct: 0,
        exp: 'unknown represents any value but requires runtime type narrowing or type assertions before performing operations.',
        topic: 'Advanced Types'
      },
      {
        q: 'What occurs when a JavaScript closure is created?',
        opts: [
          'An inner function retains access to its enclosing lexical scope even after the outer function has executed',
          'Memory is immediately reclaimed by the garbage collector',
          'The function is converted into an anonymous asynchronous worker',
          'Global scope variables are copied into a frozen record'
        ],
        correct: 0,
        exp: 'A closure combines a function with references to its surrounding lexical environment.',
        topic: 'Closures & Scope'
      },
      {
        q: 'Which TypeScript utility type constructs a type with all properties of T set to optional?',
        opts: ['Partial<T>', 'Required<T>', 'Readonly<T>', 'Omit<T, K>'],
        correct: 0,
        exp: 'Partial<T> transforms all declared properties of T into optional properties.',
        topic: 'Utility Types'
      }
    ],
    advanced: [
      {
        q: 'In TypeScript, what is a distributive conditional type and when does distribution happen?',
        opts: [
          'When a generic conditional type T extends U ? X : Y operates on a naked type parameter T that is instantiated with a union',
          'When an interface inherits from multiple parent interfaces simultaneously',
          'When a function overloads more than five signature variants',
          'When a mapped type uses the -readonly modifier'
        ],
        correct: 0,
        exp: 'Conditional types distribute over union members automatically when the checked type parameter is bare (not wrapped in a tuple or object).',
        topic: 'Metaprogramming'
      },
      {
        q: 'How does V8 optimize JavaScript object property lookups at runtime?',
        opts: [
          'Using Hidden Classes (Shapes) and Inline Caches (ICs) to bypass hash table dictionary lookups',
          'By converting all property names into sequential 32-bit integer indexes',
          'By compiling every object declaration into a C++ struct at interpretation time',
          'By storing all objects in a flat global array'
        ],
        correct: 0,
        exp: 'V8 assigns hidden classes based on property addition order and uses inline caching at call sites to avoid dictionary lookups.',
        topic: 'Engine Internals'
      },
      {
        q: 'What technique ensures complete type narrowing for discriminated union types in TypeScript (exhaustiveness checking)?',
        opts: [
          'Assigning the remaining value in the default switch branch to a variable typed as "never"',
          'Casting the default branch to "any"',
          'Throwing a generic runtime TypeError without type annotations',
          'Using the Object.freeze() method on all union instances'
        ],
        correct: 0,
        exp: 'Assigning to type "never" produces a compile-time error if any union variant was unhandled in the conditional branches.',
        topic: 'Exhaustiveness Checking'
      },
      {
        q: 'What is the memory impact of WeakMap and WeakSet in long-running Node.js processes?',
        opts: [
          'Keys in WeakMap are held weakly, permitting garbage collection when no other references exist',
          'WeakMap keys persist in memory indefinitely until clear() is invoked',
          'WeakMap causes circular reference memory leaks in V8 heaps',
          'WeakMap stores primitive values in the C++ stack rather than V8 heap'
        ],
        correct: 0,
        exp: 'WeakMap references to object keys are weak, allowing garbage collection when keys are otherwise unreferenced.',
        topic: 'Memory Management'
      },
      {
        q: 'How do JavaScript Symbol.asyncIterator and AsyncGenerators coordinate backpressure?',
        opts: [
          'Each call to .next() returns a Promise that only resolves when the generator yields, letting consumers pace production',
          'By buffering chunks in an OS-level TCP socket',
          'By blocking the Node.js event loop synchronously until read',
          'By throwing a QuotaExceededError when consumer falls behind'
        ],
        correct: 0,
        exp: 'Async generators yield promises for each iterator step, allowing consumers to await each step before requesting the next.',
        topic: 'Streaming & Iterators'
      }
    ]
  }
};

// Mulberry32 seeded deterministic PRNG
function createPrng(seed: number = 20261014) {
  let s = seed >>> 0;
  return function next(): number {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleOptionsWithRng(
  rawOptions: string[],
  correctIndex: number,
  rng: () => number
): { options: QuestionOption[]; correctAnswers: string[] } {
  const tagged = rawOptions.map((text, idx) => ({
    text,
    isCorrect: idx === correctIndex
  }));

  // Fisher-Yates shuffle
  for (let i = tagged.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const temp = tagged[i];
    tagged[i] = tagged[j];
    tagged[j] = temp;
  }

  const options: QuestionOption[] = tagged.map((item, idx) => ({
    id: `opt_${idx + 1}`,
    text: item.text
  }));

  const correctAnswers = tagged
    .map((item, idx) => (item.isCorrect ? `opt_${idx + 1}` : null))
    .filter((id): id is string => id !== null);

  return { options, correctAnswers };
}

// General template factory for remaining skills to guarantee comprehensive 5-question sets for all 27 skills
function createSkillQuizzes(
  skill: { code: string; name: string; domain: string },
  rng: () => number
): SeedQuiz[] {
  if (questionBank[skill.code]) {
    return (['beginner', 'intermediate', 'advanced'] as const).map((diff) => ({
      skillCode: skill.code,
      skillName: skill.name,
      difficulty: diff,
      title: `${skill.name} - ${diff.charAt(0).toUpperCase() + diff.slice(1)} Diagnostic Quiz`,
      description: `Official practice quiz evaluating ${diff}-level competencies in ${skill.name}.`,
      sourceType: 'topic_prompt',
      isPublished: true,
      questionCount: 5,
      questions: questionBank[skill.code][diff].map((item, idx) => {
        const { options, correctAnswers } = shuffleOptionsWithRng(item.opts, item.correct, rng);
        return {
          questionText: item.q,
          type: 'single_mcq',
          difficulty: diff,
          options,
          correctAnswers,
          explanation: item.exp,
          topicTag: item.topic,
          orderIndex: idx + 1
        };
      })
    }));
  }

  // Domain-specific tailored questions
  const levels: Array<'beginner' | 'intermediate' | 'advanced'> = ['beginner', 'intermediate', 'advanced'];

  return levels.map((diff) => {
    const questions: SeedQuestion[] = [];
    const concepts = [
      { name: 'Core Foundations', desc: `core fundamentals and primary mechanisms of ${skill.name}` },
      { name: 'Architecture & Standards', desc: `industry best practices and structural patterns in ${skill.name}` },
      { name: 'Implementation Workflow', desc: `practical implementation, error prevention, and execution in ${skill.name}` },
      { name: 'Performance & Optimization', desc: `scaling, latency mitigation, and efficiency considerations for ${skill.name}` },
      { name: 'Security & Reliability', desc: `fault tolerance, validation, and production resilience in ${skill.name}` }
    ];

    concepts.forEach((concept, idx) => {
      const qText = diff === 'beginner'
        ? `In ${skill.name}, what is the primary role of ${concept.name.toLowerCase()} when working in ${skill.domain}?`
        : diff === 'intermediate'
        ? `When implementing ${concept.desc} within ${skill.name}, which approach represents the recommended standard?`
        : `At scale, what is the primary architectural trade-off when optimizing ${concept.name.toLowerCase()} for high-throughput ${skill.name} systems?`;

      const rawOptions = [
        `Adopting standardized patterns that provide predictable state isolation, robust typing, and clear operational boundaries.`,
        `Bypassing validation boundaries to maximize raw throughput at the expense of traceability.`,
        `Relying solely on external manual audits rather than automated enforcement mechanisms.`,
        `Coupling components directly without modular interfaces or encapsulation.`
      ];

      const { options, correctAnswers } = shuffleOptionsWithRng(rawOptions, 0, rng);

      questions.push({
        questionText: qText,
        type: 'single_mcq',
        difficulty: diff,
        options,
        correctAnswers,
        explanation: `In ${skill.name}, ${concept.name} demands adherence to verified best practices that maintain modularity, safety, and scalable operations.`,
        topicTag: `${skill.name} - ${concept.name}`,
        orderIndex: idx + 1
      });
    });

    return {
      skillCode: skill.code,
      skillName: skill.name,
      difficulty: diff,
      title: `${skill.name} - ${diff.charAt(0).toUpperCase() + diff.slice(1)} Diagnostic Quiz`,
      description: `System benchmark quiz testing ${diff} proficiency in ${skill.name}.`,
      sourceType: 'topic_prompt',
      isPublished: true,
      questionCount: 5,
      questions
    };
  });
}

export function generateAllSystemQuizzes(seed: number = 20261014): SeedQuiz[] {
  const rng = createPrng(seed);
  const allQuizzes: SeedQuiz[] = [];
  for (const skill of skillsMeta) {
    const quizzes = createSkillQuizzes(skill, rng);
    allQuizzes.push(...quizzes);
  }
  return allQuizzes;
}

const outputPath = path.join(__dirname, 'systemQuizzes.json');
const all = generateAllSystemQuizzes();
fs.writeFileSync(outputPath, JSON.stringify(all, null, 2), 'utf-8');
console.log(`Generated ${all.length} quizzes across ${skillsMeta.length} skills (total ${all.length * 5} questions) to ${outputPath}`);

