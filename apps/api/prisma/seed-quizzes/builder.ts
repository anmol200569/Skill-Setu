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
        opts: [
          'const variables cannot be reassigned after declaration',
          'let variables are hoisted without an active temporal dead zone',
          'const declares immutable objects that prevent mutating properties',
          'let declarations create properties directly on the global object'
        ],
        correct: 0,
        exp: 'const prevents reassignment to the variable identifier, whereas let allows reassignment.',
        topic: 'Variables and Scope'
      },
      {
        q: 'Which primitive data type was introduced in ECMAScript 2015 (ES6) for unique object property keys?',
        opts: [
          'Symbol',
          'Decimal',
          'BigInt',
          'Binary'
        ],
        correct: 0,
        exp: 'Symbol produces a unique and immutable primitive value commonly used for private-like object properties.',
        topic: 'Primitive Data Types'
      },
      {
        q: 'What does the TypeScript "any" type indicate?',
        opts: [
          'Disables compile-time type checking for the variable',
          'Enforces dynamic runtime type assertions on variable assignments',
          'Restricts variable access to prototype properties exclusively',
          'Denotes an unknown shape requiring mandatory narrowing operations'
        ],
        correct: 0,
        exp: 'The any type effectively turns off TypeScript static type checking for that value.',
        topic: 'TypeScript Basics'
      },
      {
        q: 'What is the return value of typeof null in JavaScript?',
        opts: [
          '"object"',
          '"null"',
          '"undefined"',
          '"boolean"'
        ],
        correct: 0,
        exp: 'typeof null returns "object" due to a historical legacy artifact in early JavaScript engines.',
        topic: 'Type Coercion'
      },
      {
        q: 'Which operator performs strict equality comparison without type coercion in JavaScript?',
        opts: [
          '===',
          '!==',
          '==',
          '<='
        ],
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
          'Macrotasks take precedence over microtasks so timers like setTimeout execute ahead of resolved Promise callback queues',
          'Microtasks and macrotasks are interleaved alternately in a round-robin schedule across dedicated separate background threads',
          'Microtasks are deferred until all queued macrotasks finish, ensuring long-running background tasks complete before callbacks'
        ],
        correct: 0,
        exp: 'All pending jobs in the microtask queue run to exhaustion after the current synchronous frame and before picking the next task from the macrotask queue.',
        topic: 'Event Loop & Asynchrony'
      },
      {
        q: 'In TypeScript, what is the key difference between an interface and a type alias for object models?',
        opts: [
          'Interfaces can be declaration-merged by defining them multiple times, whereas type aliases cannot',
          'Type aliases allow recursive property structures, whereas interface models reject self-referential property references',
          'Interfaces can only describe object shapes with string keys, while type aliases support symbol and computed literal keys',
          'Type aliases generate compiled runtime validation checks, whereas interfaces are completely erased during compilation'
        ],
        correct: 0,
        exp: 'Multiple interface declarations with the same identifier in the same scope merge their property definitions.',
        topic: 'Type System Design'
      },
      {
        q: 'What is the purpose of the "unknown" type in TypeScript compared to "any"?',
        opts: [
          'unknown is type-safe: you must narrow its type with checks before calling methods or accessing properties',
          'unknown allows arbitrary member invocation at compile time while logging defensive deprecation warnings at runtime',
          'unknown automatically coerces incoming dynamic values into safe string primitives before property dereferencing',
          'unknown is restricted exclusively to asynchronous return signatures where Promise resolution types are unpredictable'
        ],
        correct: 0,
        exp: 'unknown represents any value but requires runtime type narrowing or type assertions before performing operations.',
        topic: 'Advanced Types'
      },
      {
        q: 'What occurs when a JavaScript closure is created?',
        opts: [
          'An inner function retains access to its enclosing lexical scope even after the outer function has executed',
          'The outer function scope variables are cloned into an isolated web worker heap to isolate asynchronous mutations',
          'Enclosing lexical variables are immediately frozen and detached to prevent future state updates by outer callers',
          'A new global execution context is generated that duplicates all module-level bindings for thread isolation'
        ],
        correct: 0,
        exp: 'A closure combines a function with references to its surrounding lexical environment.',
        topic: 'Closures & Scope'
      },
      {
        q: 'Which TypeScript utility type constructs a type with all properties of T set to optional?',
        opts: [
          'Partial<T>',
          'Required<T>',
          'Readonly<T>',
          'Nullable<T>'
        ],
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
          'When an interface definition extends multiple distinct parent interfaces with conflicting property value declarations',
          'When a mapped type utilizes template literal type operators to dynamically decompose string union member identifiers',
          'When an overloaded function signature specifies more than four distinct parameter combinations in the implementation'
        ],
        correct: 0,
        exp: 'Conditional types distribute over union members automatically when the checked type parameter is bare (not wrapped in a tuple or object).',
        topic: 'Metaprogramming'
      },
      {
        q: 'How does V8 optimize JavaScript object property lookups at runtime?',
        opts: [
          'Using Hidden Classes (Shapes) and Inline Caches (ICs) to bypass hash table dictionary lookups',
          'By compiling every object declaration into a rigid C++ vtable struct during lexical token parsing',
          'By hashing string property identifiers into sequential 32-bit contiguous array offsets dynamically',
          'By forcing all object instances into fixed-size contiguous memory blocks in the young generation heap'
        ],
        correct: 0,
        exp: 'V8 assigns hidden classes based on property addition order and uses inline caching at call sites to avoid dictionary lookups.',
        topic: 'Engine Internals'
      },
      {
        q: 'What technique ensures complete type narrowing for discriminated union types in TypeScript (exhaustiveness checking)?',
        opts: [
          'Assigning the remaining value in the default switch branch to a variable typed as "never"',
          'Invoking Object.freeze() on the discriminant tag property before entering conditional switch statements',
          'Casting unhandled discriminant cases to the unknown type inside an explicit assertion function',
          'Throwing a descriptive runtime Error with the discriminant value without type assertion checks'
        ],
        correct: 0,
        exp: 'Assigning to type "never" produces a compile-time error if any union variant was unhandled in the conditional branches.',
        topic: 'Exhaustiveness Checking'
      },
      {
        q: 'What is the memory impact of WeakMap and WeakSet in long-running Node.js processes?',
        opts: [
          'Keys in WeakMap are held weakly, permitting garbage collection when no other references exist',
          'WeakMap allocations are pinned in the large object space, preventing compaction cycles during garbage collection',
          'WeakMap values are stored in unmanaged C++ memory buffers that must be deallocated using explicit finalizers',
          'Keys in WeakMap cause cyclical reference memory retention unless manual clear() methods are invoked regularly'
        ],
        correct: 0,
        exp: 'WeakMap references to object keys are weak, allowing garbage collection when keys are otherwise unreferenced.',
        topic: 'Memory Management'
      },
      {
        q: 'How do JavaScript Symbol.asyncIterator and AsyncGenerators coordinate backpressure?',
        opts: [
          'Each call to .next() returns a Promise that only resolves when the generator yields, letting consumers pace production',
          'By buffering generated stream chunks in an OS-level socket until the consumer signals ready via an event listener',
          'By executing a synchronous spin-lock that pauses the V8 event loop until downstream subscribers acknowledge receipt',
          'By rejecting subsequent yield operations with a FlowControlError whenever the internal queue capacity is exceeded'
        ],
        correct: 0,
        exp: 'Async generators yield promises for each iterator step, allowing consumers to await each step before requesting the next.',
        topic: 'Streaming & Iterators'
      }
    ]
  }
};

// Skill-specific distractors for template-based questions
const skillDistractorBank: Record<string, {
  c0: [string, string, string];
  c1: [string, string, string];
  c2: [string, string, string];
  c3: [string, string, string];
  c4: [string, string, string];
}> = {
  // Batch 1 (skills 1..8)
  'react': {
    c0: [
      'Directly mutating component DOM trees with imperative JavaScript scripts rather than utilizing declarative reconciliation mechanisms.',
      'Coupling component lifecycle states directly to global window singletons without localized prop isolation.',
      'Bypassing functional component composition in favor of uncontrolled runtime prototype mutations across modules.'
    ],
    c1: [
      'Enforcing rigid synchronous point-to-point prop drilling across deep unisolated component hierarchies directly.',
      'Structuring internal state boundaries through informal custom event emitters rather than centralized context stores and reducers.',
      'Bypassing presentation standards to embed raw script injection handlers inside rendered JSX layout elements.'
    ],
    c2: [
      'Invoking blocking asynchronous operations directly inside component render functions without hook dependencies.',
      'Managing component render lifecycles through manual timing delays without clean cleanup subscriptions on unmount.',
      'Executing uncoordinated state dispatches across unmounted trees without automated cancellation tokens or cleanup handlers in components.'
    ],
    c3: [
      'Wrapping all simple leaf nodes in nested PureComponent layers without measuring re-render costs.',
      'Caching all primitive calculation values in global Maps to avoid local hook allocation overhead.',
      'Debouncing all render cycles through manual setTimeout loops across every interactive element.'
    ],
    c4: [
      'Injecting unescaped user markup directly through dangerouslySetInnerHTML sinks without automated sanitization or audit controls.',
      'Disabling synthetic event boundaries to process raw native browser events without context validation.',
      'Storing sensitive authentication access tokens in unprotected local React component state variables.'
    ]
  },
  'nodejs': {
    c0: [
      'Executing synchronous blocking file operations on the primary event loop thread rather than utilizing background worker pools.',
      'Spawning detached child processes for trivial calculations without managing concurrency limits.',
      'Swallowing uncaught promise rejections silently without recording diagnostic error stack traces.'
    ],
    c1: [
      'Tightly coupling HTTP route controllers directly to raw database drivers without repository layers.',
      'Structuring backend service layers around global process singletons rather than scoped dependency injection containers and factories.',
      'Sharing unisolated mutable state across concurrent asynchronous request execution contexts.'
    ],
    c2: [
      'Omitting stream backpressure handling when transferring large file buffers across network sockets.',
      'Bypassing structured error handling middleware and crashing worker instances on validation errors.',
      'Deploying backend service updates without verifying cluster worker health checks and graceful termination procedures in production.'
    ],
    c3: [
      'Allocating large unpooled memory buffers per connection without monitoring V8 heap consumption.',
      'Disabling HTTP keep-alive connections on upstream client pools to avoid idle socket overhead.',
      'Running intensive CPU-bound mathematical operations directly on the primary event loop thread.'
    ],
    c4: [
      'Exposing internal database error messages, file paths, and environment variables in public client response bodies during failures.',
      'Disabling TLS certificate verification on outbound microservice requests to bypass self-signed checks.',
      'Allowing unrestricted payload body sizes on multipart file upload endpoints without rate limits.'
    ]
  },
  'python': {
    c0: [
      'Bypassing interpreter reference counting mechanics through uncoordinated manual garbage collection invocations in production.',
      'Relying on mutable default argument lists in shared function definitions across module imports.',
      'Mixing heterogeneous dynamic types within critical numerical loops without type hint safety.'
    ],
    c1: [
      'Constructing deeply nested multiple inheritance trees instead of modular protocol composition.',
      'Structuring application packages using wildcard star imports that pollute and overwrite top-level namespaces indiscriminately.',
      'Coupling package components through circular module imports that trigger runtime initialization errors.'
    ],
    c2: [
      'Catching broad Exception classes blindly without specific error filtering or diagnostic logging.',
      'Ignoring context manager protocols and leaking unclosed file descriptors during unexpected crashes.',
      'Using arbitrary eval statements to parse untrusted user configuration payloads directly within core execution workflows in production.'
    ],
    c3: [
      'Spawning multithreaded workers for CPU-bound computations without circumventing GIL constraints.',
      'Converting lazy generator iterables into eager in-memory lists before streaming data processing.',
      'Repeatedly concatenating immutable string objects within tight loops instead of join operations.'
    ],
    c4: [
      'Deserializing untrusted pickle byte streams received from external network clients without cryptographic signature checks or schema verification.',
      'Interpolating unescaped user parameter strings into system shell execution commands directly.',
      'Storing sensitive API keys in plain text configuration files committed to public repositories.'
    ]
  },
  'sys-design': {
    c0: [
      'Executing synchronous point-to-point RPC calls across continental regions without distributed caching, fallback logic, or circuit breaking.',
      'Storing all application data in a single monolithic relational database node without read replicas.',
      'Polling downstream services continuously over HTTP rather than adopting event-driven webhooks.'
    ],
    c1: [
      'Hardcoding static IP addresses of dependent services directly within microservice configuration files.',
      'Structuring distributed workflows without circuit breakers, fallback degradation, or exponential retry policies during outages.',
      'Coupling domain event payloads tightly to internal database table schemas across microservices.'
    ],
    c2: [
      'Deploying breaking schema modifications to shared distributed queues without consumer migration phases.',
      'Executing multi-service updates across independent databases without distributed saga orchestration.',
      'Running manual shell scripts to apply unversioned configuration changes across production cluster nodes during peak active traffic windows.'
    ],
    c3: [
      'Enabling pessimistic distributed locks across volatile database rows during high-throughput peaks.',
      'Over-provisioning oversized cluster compute instances to compensate for unoptimized query paths.',
      'Bypassing edge content delivery networks and serving static media assets from core database disks.'
    ],
    c4: [
      'Transmitting unencrypted internal service traffic over private subnets without mutual TLS enforcement or certificate rotation.',
      'Granting unrestricted administrative permissions to application microservice service accounts.',
      'Allowing open ingress traffic from any public IP address to internal cache and database ports.'
    ]
  },
  'sql-db': {
    c0: [
      'Storing denormalized comma-separated scalar lists in text columns to avoid creating normalized child relational tables in schemas.',
      'Omitting foreign key integrity constraints on high-volume tables to accelerate raw insert speeds.',
      'Relying on client-side in-memory sorting rather than creating structured database query indexes.'
    ],
    c1: [
      'Duplicating core entity records across independent tables without synchronization trigger safeguards.',
      'Structuring transactional databases without normal form compliance, leading to persistent update anomalies and subtle data corruption over time.',
      'Coupling database schema column names directly to ephemeral client presentation view requirements.'
    ],
    c2: [
      'Executing long-running schema migration scripts during peak transactional traffic windows without locks.',
      'Applying structural database modifications without generating and testing automated rollback scripts.',
      'Executing table alteration statements that trigger full table rewrites and exclusive catalog locks on active production tables.'
    ],
    c3: [
      'Creating redundant composite indexes with overlapping column prefixes on frequently updated tables.',
      'Disabling prepared statement execution plan caching across high-frequency connection pool queries.',
      'Writing non-sargable WHERE predicates that force the query optimizer to perform full table scans.'
    ],
    c4: [
      'Concatenating unsanitized client form input directly into dynamic SQL query strings without parameterized query boundaries or escaping.',
      'Granting superuser database administrative credentials to general application web connection pools.',
      'Disabling write-ahead logging durability settings to achieve temporary performance improvements.'
    ]
  },
  'adv-sql': {
    c0: [
      'Iterating through database rows using procedural cursor loops instead of set-based join operations across partitioned table partitions.',
      'Nesting correlated subqueries inside repeated SELECT clauses rather than utilizing window functions.',
      'Ignoring collation and character set mismatches across joined columns in analytical queries.'
    ],
    c1: [
      'Embedding volatile business calculation logic exclusively within nested multi-level database views.',
      'Structuring large analytical fact tables without date range partitioning, columnar compression, or clustered storage indices.',
      'Coupling analytical reporting scripts directly to live primary OLTP database transaction replicas.'
    ],
    c2: [
      'Deploying complex analytical queries to production without inspecting execution plan operator costs.',
      'Manually overriding query optimizer join order hints without empirical benchmark verification.',
      'Executing unbatched analytical updates that monopolize database locks and block concurrent reads across active cluster shards.'
    ],
    c3: [
      'Materializing unnecessary high-cardinality intermediate columns in recursive CTE definitions.',
      'Forcing nested loop joins across multi-million row datasets instead of hash join algorithms.',
      'Disabling parallel query execution workers on large analytical scans to save memory overhead.'
    ],
    c4: [
      'Bypassing row-level security policies during bulk analytical exports by executing queries under system superuser privileges.',
      'Granting analytical service accounts unrestricted read permissions on sensitive audit trail tables.',
      'Executing dynamic SQL procedures constructed from untrusted reporting dashboard input parameters.'
    ]
  },
  'data-vis': {
    c0: [
      'Using three-dimensional chart projections that distort visual proportions and misrepresent metric scales to dashboard viewers.',
      'Truncating bar chart quantitative baseline axes to artificially exaggerate incremental metric trends.',
      'Relying on rainbow color palettes that create accessibility barriers for color-blind dashboard users.'
    ],
    c1: [
      'Plotting disparate metrics with conflicting measurement scales on a single uncalibrated dual axis.',
      'Structuring dashboard layouts with inconsistent visual encoding conventions, conflicting palettes, and missing unit markers.',
      'Omitting standardized legend labels, axis titles, and measurement units from executive dashboards.'
    ],
    c2: [
      'Publishing analytical dashboards without testing responsiveness across mobile and tablet viewports.',
      'Hardcoding report data figures manually without automated extraction and transformation pipelines.',
      'Delivering complex visual reports to stakeholders without documenting underlying data definitions and aggregation assumptions.'
    ],
    c3: [
      'Rendering tens of thousands of individual DOM canvas elements on a single dashboard viewport.',
      'Polling backend database endpoints continuously every few seconds for static historical metrics.',
      'Omitting data aggregation at the server level and computing percentiles entirely in browser memory.'
    ],
    c4: [
      'Exposing restricted customer identifiers and private financial figures in public chart tooltips without role-based redactions.',
      'Disabling role-based row-level filtering on embedded interactive customer analytics dashboards.',
      'Storing sensitive business metric extracts in unencrypted browser local storage cache files.'
    ]
  },
  'eda-pandas': {
    c0: [
      'Iterating over DataFrame rows with procedural iterrows loops instead of vectorized NumPy operations and columnar calculations.',
      'Dropping missing values arbitrarily without analyzing whether data is Missing Completely at Random.',
      'Casting low-cardinality string columns to generic object types rather than categorical types.'
    ],
    c1: [
      'Chaining multiple inplace mutations that trigger ambiguous SettingWithCopy warnings in pandas.',
      'Structuring data transformation pipelines with unverified implicit index alignments that introduce silent null row injections.',
      'Coupling exploratory feature engineering scripts to specific hardcoded spreadsheet column formats.'
    ],
    c2: [
      'Imputing missing numerical feature values using arbitrary constant defaults without domain review.',
      'Applying feature scaling transformations to the entire dataset before performing train-test splits.',
      'Skipping exploratory correlation and distribution skewness checks prior to model feature selection and dimensionality reduction.'
    ],
    c3: [
      'Loading entire multi-gigabyte CSV files into memory at once without chunked streaming iterations.',
      'Recomputing identical groupby aggregation aggregations repeatedly in data visualization loops.',
      'Omitting numeric memory downcasting on 64-bit integer columns containing small range values.'
    ],
    c4: [
      'Exporting unmasked customer personally identifiable information to unencrypted local CSV files on shared workstation network drives.',
      'Loading untrusted pickled DataFrame artifacts from external network drives without validation.',
      'Persisting database connection credentials in plaintext within exploratory Jupyter notebook cells.'
    ]
  }
};

function getDefaultDistractors(conceptIdx: number): [string, string, string] {
  if (conceptIdx === 0) {
    return [
      'Relying on unverified ad-hoc execution patterns that bypass structural contracts, type checks, and state boundaries in modules.',
      'Coupling component lifecycle states directly to global environment singletons without clean state isolation.',
      'Bypassing foundational type abstractions in favor of runtime dynamic evaluation across internal modules.'
    ];
  }
  if (conceptIdx === 1) {
    return [
      'Enforcing rigid point-to-point bindings that tightly couple distinct application components together.',
      'Structuring internal system boundaries through informal agreements rather than declarative interface specifications and contracts.',
      'Bypassing architectural standards to prioritize rapid single-use scripts without documentation or review.'
    ];
  }
  if (conceptIdx === 2) {
    return [
      'Deploying implementation modifications directly to live environments without staging validation checks.',
      'Relying solely on external post-release monitoring rather than automated integration test suites.',
      'Executing uncoordinated manual deployment steps without immutable version tags or automated rollback safety procedures in production.'
    ];
  }
  if (conceptIdx === 3) {
    return [
      'Enabling premature caching tiers across internal variables without profiling real bottleneck latencies.',
      'Allocating oversized hardware capacity indiscriminately to mask underlying execution inefficiencies.',
      'Bypassing standard resource pools and executing synchronous blocking loops to maximize raw throughput.'
    ];
  }
  return [
    'Disabling automated security validation boundaries and authorization checks to accelerate internal communication workflows.',
    'Trusting incoming external payloads implicitly without cryptographic signature or schema verification.',
    'Omitting centralized resilience logging and automated failover policies across production cluster nodes.'
  ];
}

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

      const correctOption = `Adopting standardized patterns that provide predictable state isolation, robust typing, and clear operational boundaries.`;

      const conceptKey = `c${idx}` as 'c0' | 'c1' | 'c2' | 'c3' | 'c4';
      const skillBank = skillDistractorBank[skill.code];
      const distractors = skillBank ? skillBank[conceptKey] : getDefaultDistractors(idx);

      const rawOptions = [correctOption, ...distractors];
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
