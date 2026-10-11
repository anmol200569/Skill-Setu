export const domainsData = [
  {
    code: 'prog-soft-dev',
    name: 'Programming & Software Development',
    description: 'Core programming languages, algorithms, web development, architecture, and system design.',
    icon: 'Code2',
    skills: [
      { code: 'ts-js', name: 'TypeScript & JavaScript', category: 'Frontend/Fullstack', description: 'Modern ECMAScript, static typing, asynchronous patterns, and runtime fundamentals.' },
      { code: 'react', name: 'React & Modern Frontend', category: 'Frontend', description: 'Component lifecycle, hooks, state management, render optimization, and SSR.' },
      { code: 'nodejs', name: 'Node.js & Backend APIs', category: 'Backend', description: 'RESTful architectures, event loop, Express/Fastify, streams, and middleware.' },
      { code: 'python', name: 'Python Core & Advanced', category: 'General/Data', description: 'Python data structures, OOP, functional patterns, typing, and ecosystem tooling.' },
      { code: 'sys-design', name: 'System Design & Scalability', category: 'Architecture', description: 'Distributed systems, caching, message queues, horizontal scaling, and fault tolerance.' },
      { code: 'sql-db', name: 'SQL & Database Modeling', category: 'Database', description: 'Relational schema design, normalization, indexing, query execution plans, and ACID.' }
    ]
  },
  {
    code: 'data-analytics',
    name: 'Data & Analytics',
    description: 'Data querying, business intelligence, exploratory data analysis, data warehousing, and ETL.',
    icon: 'BarChart3',
    skills: [
      { code: 'adv-sql', name: 'Advanced SQL & Query Optimization', category: 'Data Analysis', description: 'Window functions, CTEs, complex aggregations, partitioned tables, and query tuning.' },
      { code: 'data-vis', name: 'Data Visualization & Storytelling', category: 'BI', description: 'Translating complex datasets into actionable executive dashboards with Tableau, Power BI, and Recharts.' },
      { code: 'eda-pandas', name: 'Exploratory Data Analysis (Pandas/Polars)', category: 'Data Analysis', description: 'Data cleaning, feature engineering, statistical summaries, and handling missingness.' },
      { code: 'bi-modeling', name: 'BI Semantic Modeling & Metrics', category: 'BI', description: 'Star and snowflake schemas, KPI definition, metrics stores, and dimensional modeling.' }
    ]
  },
  {
    code: 'cloud-devops',
    name: 'Cloud & DevOps',
    description: 'Infrastructure as Code, CI/CD pipelines, container orchestration, and cloud reliability.',
    icon: 'Cloud',
    skills: [
      { code: 'docker-k8s', name: 'Containers & Docker', category: 'DevOps', description: 'Image optimization, multi-stage builds, container security, and containerized workflows.' },
      { code: 'k8s-orch', name: 'Kubernetes Orchestration', category: 'Cloud', description: 'Deployments, services, ingress controllers, config maps, and cluster autoscaling.' },
      { code: 'aws-cloud', name: 'AWS & Cloud Architecture', category: 'Cloud', description: 'IAM policies, VPC networking, serverless Lambda, S3, RDS, and high availability design.' },
      { code: 'cicd-github', name: 'CI/CD Automation & GitHub Actions', category: 'DevOps', description: 'Automated test runners, release tagging, secret masking, and blue-green deployments.' }
    ]
  },
  {
    code: 'ai-ml',
    name: 'AI & Machine Learning',
    description: 'Machine learning algorithms, generative AI, LLM prompting, embeddings, and vector search.',
    icon: 'Sparkles',
    skills: [
      { code: 'ml-foundations', name: 'Machine Learning Foundations', category: 'ML', description: 'Supervised and unsupervised learning, regularization, evaluation metrics, and bias-variance tradeoff.' },
      { code: 'llm-genai', name: 'Generative AI & LLM Engineering', category: 'GenAI', description: 'Prompt engineering, context windows, few-shot conditioning, structured output generation, and guardrails.' },
      { code: 'rag-vector', name: 'RAG & Vector Databases', category: 'GenAI', description: 'Chunking strategies, semantic similarity, embeddings, pgvector, and hybrid search.' },
      { code: 'pytorch-tf', name: 'Deep Learning & Model Training', category: 'ML', description: 'Neural network architectures, transformers, backpropagation, and PyTorch fine-tuning.' }
    ]
  },
  {
    code: 'cybersecurity',
    name: 'Cybersecurity & Digital Safety',
    description: 'Application security, identity management, threat modeling, and OWASP top 10 defense.',
    icon: 'ShieldCheck',
    skills: [
      { code: 'appsec-owasp', name: 'Application Security (OWASP Top 10)', category: 'Security', description: 'Preventing SQL injection, XSS, CSRF, broken access control, and insecure deserialization.' },
      { code: 'auth-iam', name: 'Auth, JWT & Zero Trust Identity', category: 'Security', description: 'OAuth 2.0 / OIDC, PKCE, secure cookie handling, RBAC, and token verification.' },
      { code: 'netsec-threat', name: 'Network Security & Threat Defense', category: 'Security', description: 'TLS/SSL termination, CORS policy enforcement, rate limiting, and DDoS mitigation.' }
    ]
  },
  {
    code: 'communication-leadership',
    name: 'Communication & Leadership',
    description: 'Technical writing, stakeholder alignment, team mentorship, and cross-functional leadership.',
    icon: 'Users',
    skills: [
      { code: 'tech-writing', name: 'Technical Documentation & RFCs', category: 'Soft Skills', description: 'Architectural Decision Records (ADRs), API documentation, RFC proposals, and post-mortems.' },
      { code: 'stakeholder-mgt', name: 'Stakeholder Communication', category: 'Soft Skills', description: 'Translating engineering constraints into business outcomes and executive presentation.' },
      { code: 'agile-teamwork', name: 'Agile Teamwork & Mentorship', category: 'Leadership', description: 'Sprint retrospectives, pair programming, code review culture, and constructive feedback.' }
    ]
  },
  {
    code: 'product-management',
    name: 'Product & Project Management',
    description: 'Product discovery, roadmap planning, KPI tracking, and user experience research.',
    icon: 'Kanban',
    skills: [
      { code: 'prod-discovery', name: 'Product Discovery & PRDs', category: 'Product', description: 'Writing high-clarity PRDs, problem validation, user interview synthesis, and MVP scoping.' },
      { code: 'product-analytics', name: 'Product Analytics & Metrics', category: 'Product', description: 'North star metrics, cohort retention, funnel analysis, and A/B test interpretation.' },
      { code: 'user-research', name: 'UX Design Thinking & User Journeys', category: 'Product', description: 'Wireframing, customer journey mapping, usability testing, and accessibility auditing.' }
    ]
  }
];

export const rolesData = [
  {
    code: 'fullstack-dev',
    title: 'Full-Stack Developer',
    description: 'Builds end-to-end web applications, responsive user interfaces, robust APIs, and manages relational databases.',
    industryDemand: 'Very High',
    requirements: [
      { skillCode: 'ts-js', requiredProficiency: 4, priority: 'must_have', weight: 1.5 },
      { skillCode: 'react', requiredProficiency: 4, priority: 'must_have', weight: 1.5 },
      { skillCode: 'nodejs', requiredProficiency: 4, priority: 'must_have', weight: 1.4 },
      { skillCode: 'sql-db', requiredProficiency: 3, priority: 'must_have', weight: 1.2 },
      { skillCode: 'sys-design', requiredProficiency: 3, priority: 'good_to_have', weight: 1.0 },
      { skillCode: 'docker-k8s', requiredProficiency: 2, priority: 'good_to_have', weight: 0.8 },
      { skillCode: 'appsec-owasp', requiredProficiency: 3, priority: 'good_to_have', weight: 0.9 },
      { skillCode: 'tech-writing', requiredProficiency: 3, priority: 'optional', weight: 0.7 }
    ]
  },
  {
    code: 'data-analyst',
    title: 'Data Analyst',
    description: 'Extracts, transforms, and visualizes company data to discover trends, evaluate business health, and guide decision-making.',
    industryDemand: 'High',
    requirements: [
      { skillCode: 'adv-sql', requiredProficiency: 4, priority: 'must_have', weight: 1.6 },
      { skillCode: 'data-vis', requiredProficiency: 4, priority: 'must_have', weight: 1.5 },
      { skillCode: 'eda-pandas', requiredProficiency: 3, priority: 'must_have', weight: 1.3 },
      { skillCode: 'bi-modeling', requiredProficiency: 3, priority: 'must_have', weight: 1.2 },
      { skillCode: 'stakeholder-mgt', requiredProficiency: 3, priority: 'good_to_have', weight: 1.0 },
      { skillCode: 'product-analytics', requiredProficiency: 3, priority: 'good_to_have', weight: 0.9 }
    ]
  },
  {
    code: 'ml-engineer',
    title: 'Machine Learning Engineer',
    description: 'Designs, deploys, and scales machine learning pipelines, LLM-powered applications, and vector search systems.',
    industryDemand: 'Critical',
    requirements: [
      { skillCode: 'python', requiredProficiency: 4, priority: 'must_have', weight: 1.5 },
      { skillCode: 'ml-foundations', requiredProficiency: 4, priority: 'must_have', weight: 1.5 },
      { skillCode: 'llm-genai', requiredProficiency: 4, priority: 'must_have', weight: 1.4 },
      { skillCode: 'rag-vector', requiredProficiency: 3, priority: 'must_have', weight: 1.3 },
      { skillCode: 'pytorch-tf', requiredProficiency: 3, priority: 'good_to_have', weight: 1.1 },
      { skillCode: 'docker-k8s', requiredProficiency: 3, priority: 'good_to_have', weight: 1.0 },
      { skillCode: 'sys-design', requiredProficiency: 3, priority: 'good_to_have', weight: 1.0 }
    ]
  },
  {
    code: 'product-manager',
    title: 'Product Manager',
    description: 'Drives product strategy, customer research, feature prioritization, and coordinates engineering and design execution.',
    industryDemand: 'High',
    requirements: [
      { skillCode: 'prod-discovery', requiredProficiency: 4, priority: 'must_have', weight: 1.6 },
      { skillCode: 'product-analytics', requiredProficiency: 4, priority: 'must_have', weight: 1.4 },
      { skillCode: 'stakeholder-mgt', requiredProficiency: 4, priority: 'must_have', weight: 1.4 },
      { skillCode: 'user-research', requiredProficiency: 3, priority: 'must_have', weight: 1.2 },
      { skillCode: 'agile-teamwork', requiredProficiency: 3, priority: 'good_to_have', weight: 1.0 },
      { skillCode: 'tech-writing', requiredProficiency: 3, priority: 'good_to_have', weight: 0.9 }
    ]
  },
  {
    code: 'business-analyst',
    title: 'Business Analyst',
    description: 'Bridges technical teams and business stakeholders, gathers functional requirements, models workflows, and tracks KPIs.',
    industryDemand: 'High',
    requirements: [
      { skillCode: 'adv-sql', requiredProficiency: 3, priority: 'must_have', weight: 1.4 },
      { skillCode: 'data-vis', requiredProficiency: 4, priority: 'must_have', weight: 1.4 },
      { skillCode: 'stakeholder-mgt', requiredProficiency: 4, priority: 'must_have', weight: 1.5 },
      { skillCode: 'prod-discovery', requiredProficiency: 3, priority: 'good_to_have', weight: 1.1 },
      { skillCode: 'tech-writing', requiredProficiency: 4, priority: 'must_have', weight: 1.2 }
    ]
  },
  {
    code: 'cloud-architect',
    title: 'Cloud Solutions Architect',
    description: 'Architects reliable, resilient, secure, and cost-effective multi-cloud environments and automated deployments.',
    industryDemand: 'Critical',
    requirements: [
      { skillCode: 'aws-cloud', requiredProficiency: 5, priority: 'must_have', weight: 1.6 },
      { skillCode: 'docker-k8s', requiredProficiency: 4, priority: 'must_have', weight: 1.4 },
      { skillCode: 'k8s-orch', requiredProficiency: 4, priority: 'must_have', weight: 1.3 },
      { skillCode: 'cicd-github', requiredProficiency: 4, priority: 'must_have', weight: 1.2 },
      { skillCode: 'netsec-threat', requiredProficiency: 3, priority: 'must_have', weight: 1.1 },
      { skillCode: 'sys-design', requiredProficiency: 4, priority: 'must_have', weight: 1.4 }
    ]
  }
];

export const curatedCoursesData = [
  // 1 to 10: Programming & Software Development
  {
    title: 'TypeScript in 50 Lessons & Production Practices',
    provider: 'freeCodeCamp',
    destinationUrl: 'https://www.freecodecamp.org/news/learn-typescript-beginners-guide/',
    skillsCovered: ['ts-js'],
    difficulty: 'Intermediate',
    estimatedHours: 12,
    language: 'English',
    isFree: true,
    rating: 4.8,
    ratingSource: 'freeCodeCamp Community',
    description: 'Comprehensive walkthrough of TypeScript utility types, generics, strict null checks, and modern configuration.'
  },
  {
    title: 'Full Stack Open — Deep Dive Into Modern Web Development',
    provider: 'University of Helsinki',
    destinationUrl: 'https://fullstackopen.com/en/',
    skillsCovered: ['ts-js', 'react', 'nodejs', 'sql-db'],
    difficulty: 'Intermediate',
    estimatedHours: 65,
    language: 'English',
    isFree: true,
    rating: 4.9,
    ratingSource: 'Course Platform Reviews',
    description: 'Gold-standard open curriculum covering React, Redux, Node.js, Express, REST APIs, GraphQL, and TypeScript.'
  },
  {
    title: 'React Documentation & Official Interactive Tutorials',
    provider: 'React.dev',
    destinationUrl: 'https://react.dev/learn',
    skillsCovered: ['react'],
    difficulty: 'Beginner',
    estimatedHours: 15,
    language: 'English',
    isFree: true,
    rating: 4.9,
    ratingSource: 'Official Docs Benchmark',
    description: 'Learn modern React with pure functional components, hooks, suspense, state preservation, and custom hooks.'
  },
  {
    title: 'CS50x: Introduction to Computer Science',
    provider: 'Harvard / edX',
    destinationUrl: 'https://cs50.harvard.edu/x/',
    skillsCovered: ['python', 'sql-db'],
    difficulty: 'Beginner',
    estimatedHours: 40,
    language: 'English',
    isFree: true,
    rating: 4.9,
    ratingSource: 'Class Central Top Rated',
    description: 'Legendary introductory course on algorithmic thinking, memory management, data structures, and web foundations.'
  },
  {
    title: 'Node.js & Express API Development Track',
    provider: 'freeCodeCamp',
    destinationUrl: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/',
    skillsCovered: ['nodejs'],
    difficulty: 'Beginner',
    estimatedHours: 20,
    language: 'English',
    isFree: true,
    rating: 4.7,
    ratingSource: 'freeCodeCamp Reviews',
    description: 'Hands-on projects building REST endpoints, routing, middleware, URL shorteners, and authentication services.'
  },
  {
    title: 'Relational Database Design and SQL Mastery',
    provider: 'Microsoft Learn',
    destinationUrl: 'https://learn.microsoft.com/en-us/training/paths/query-data-with-transact-sql/',
    skillsCovered: ['sql-db', 'adv-sql'],
    difficulty: 'Intermediate',
    estimatedHours: 16,
    language: 'English',
    isFree: true,
    rating: 4.8,
    ratingSource: 'Microsoft Learn Feedback',
    description: 'Master joins, aggregations, subqueries, indices, execution plans, and data integrity constraints.'
  },
  {
    title: 'Modern Python Programming for Developers (हिंदी & English)',
    provider: 'NPTEL',
    destinationUrl: 'https://nptel.ac.in/courses/106106145',
    skillsCovered: ['python'],
    difficulty: 'Beginner',
    estimatedHours: 30,
    language: 'Bilingual',
    isFree: true,
    rating: 4.7,
    ratingSource: 'NPTEL Swayam Portal',
    description: 'In-depth Python programming taught by IIT Madras faculty covering idioms, OOP, modules, and testing.'
  },
  {
    title: 'System Design Primer & Architectural Patterns',
    provider: 'GitHub Open Source',
    destinationUrl: 'https://github.com/donnemartin/system-design-primer',
    skillsCovered: ['sys-design'],
    difficulty: 'Advanced',
    estimatedHours: 25,
    language: 'English',
    isFree: true,
    rating: 4.9,
    ratingSource: 'GitHub 270k+ Stars',
    description: 'Learn how to design large-scale distributed architectures, load balancing, replication, CAP theorem, and CDN caching.'
  },

  // 9 to 18: Data & Analytics
  {
    title: 'Advanced SQL for Data Analysts & BI Engineers',
    provider: 'Microsoft Learn',
    destinationUrl: 'https://learn.microsoft.com/en-us/training/modules/optimize-query-performance-sql-server/',
    skillsCovered: ['adv-sql', 'bi-modeling'],
    difficulty: 'Intermediate',
    estimatedHours: 14,
    language: 'English',
    isFree: true,
    rating: 4.8,
    ratingSource: 'Microsoft Learn',
    description: 'Window functions, analytical ranking, cumulative sums, index optimization, and semantic data models.'
  },
  {
    title: 'Data Visualization and Executive Storytelling with Power BI',
    provider: 'Microsoft Learn',
    destinationUrl: 'https://learn.microsoft.com/en-us/training/paths/create-use-analytics-reports-power-bi/',
    skillsCovered: ['data-vis', 'bi-modeling'],
    difficulty: 'Beginner',
    estimatedHours: 18,
    language: 'English',
    isFree: true,
    rating: 4.7,
    ratingSource: 'Microsoft Learn',
    description: 'Build interactive dashboards, DAX measures, data relationships, and impactful executive summaries.'
  },
  {
    title: 'Applied Data Analysis with Pandas & Python',
    provider: 'freeCodeCamp',
    destinationUrl: 'https://www.freecodecamp.org/learn/data-analysis-with-python/',
    skillsCovered: ['eda-pandas', 'python'],
    difficulty: 'Intermediate',
    estimatedHours: 22,
    language: 'English',
    isFree: true,
    rating: 4.8,
    ratingSource: 'freeCodeCamp',
    description: 'Numpy, Pandas, Matplotlib, and Seaborn for data wrangling, cleaning missing values, and statistical exploration.'
  },
  {
    title: 'Data Science & Visual Analytics (Hindi Explained)',
    provider: 'NPTEL',
    destinationUrl: 'https://nptel.ac.in/courses/106105151',
    skillsCovered: ['data-vis', 'eda-pandas'],
    difficulty: 'Intermediate',
    estimatedHours: 28,
    language: 'Hindi',
    isFree: true,
    rating: 4.6,
    ratingSource: 'NPTEL India',
    description: 'Statistical foundation for data analysis and visualization presented with Hindi commentary and English notes.'
  },
  {
    title: 'Data Modeling & Dimensional Warehousing Essentials',
    provider: 'Google Cloud Skills Boost',
    destinationUrl: 'https://www.cloudskillsboost.google/course_templates/14',
    skillsCovered: ['bi-modeling', 'adv-sql'],
    difficulty: 'Intermediate',
    estimatedHours: 12,
    language: 'English',
    isFree: true,
    rating: 4.8,
    ratingSource: 'Google Cloud Skills Boost',
    description: 'Star schemas, slowly changing dimensions, BigQuery query optimization, and metric definitions.'
  },

  // 19 to 26: Cloud & DevOps
  {
    title: 'Docker for Beginners to Production Workflows',
    provider: 'freeCodeCamp',
    destinationUrl: 'https://www.freecodecamp.org/news/the-docker-handbook/',
    skillsCovered: ['docker-k8s'],
    difficulty: 'Beginner',
    estimatedHours: 10,
    language: 'English',
    isFree: true,
    rating: 4.9,
    ratingSource: 'freeCodeCamp Handbook',
    description: 'Containers, Dockerfiles, multi-stage builds, volumes, Docker Compose networking, and container image hardening.'
  },
  {
    title: 'Kubernetes Fundamentals and Cluster Architecture',
    provider: 'Google Cloud Skills Boost',
    destinationUrl: 'https://www.cloudskillsboost.google/course_templates/2',
    skillsCovered: ['k8s-orch', 'docker-k8s'],
    difficulty: 'Intermediate',
    estimatedHours: 16,
    language: 'English',
    isFree: true,
    rating: 4.8,
    ratingSource: 'Google Cloud Training',
    description: 'Deploying pods, services, ingress, horizontal pod autoscaling, config maps, and rolling zero-downtime updates.'
  },
  {
    title: 'AWS Cloud Practitioner & Architecting on AWS',
    provider: 'AWS Skill Builder',
    destinationUrl: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials',
    skillsCovered: ['aws-cloud'],
    difficulty: 'Beginner',
    estimatedHours: 14,
    language: 'English',
    isFree: true,
    rating: 4.8,
    ratingSource: 'AWS Skill Builder',
    description: 'Core AWS cloud services: EC2, S3, RDS, DynamoDB, VPC, IAM, serverless Lambda, and cost optimization.'
  },
  {
    title: 'Automated CI/CD with GitHub Actions',
    provider: 'GitHub Skills',
    destinationUrl: 'https://skills.github.com/',
    skillsCovered: ['cicd-github'],
    difficulty: 'Intermediate',
    estimatedHours: 8,
    language: 'English',
    isFree: true,
    rating: 4.9,
    ratingSource: 'GitHub Skills Platform',
    description: 'Writing workflow YAMLs, matrix test pipelines, automated artifact generation, secret management, and CD deployments.'
  },

  // 27 to 36: AI & Machine Learning
  {
    title: 'Machine Learning Specialization by Andrew Ng',
    provider: 'DeepLearning.AI / Coursera',
    destinationUrl: 'https://www.deeplearning.ai/courses/machine-learning-specialization/',
    skillsCovered: ['ml-foundations', 'python'],
    difficulty: 'Beginner',
    estimatedHours: 35,
    language: 'English',
    isFree: true,
    rating: 4.9,
    ratingSource: 'Coursera (Over 500k students)',
    description: 'Linear regression, logistic regression, neural networks, decision trees, bias-variance tradeoff, and recommender systems.'
  },
  {
    title: 'Generative AI for Everyone & Prompt Engineering',
    provider: 'DeepLearning.AI',
    destinationUrl: 'https://www.deeplearning.ai/courses/generative-ai-for-everyone/',
    skillsCovered: ['llm-genai'],
    difficulty: 'Beginner',
    estimatedHours: 8,
    language: 'English',
    isFree: true,
    rating: 4.9,
    ratingSource: 'DeepLearning.AI Reviews',
    description: 'How LLMs work, prompt engineering techniques, capabilities, real-world constraints, and ethical AI deployment.'
  },
  {
    title: 'Building RAG Systems with Vector Databases',
    provider: 'Google Cloud Skills Boost',
    destinationUrl: 'https://www.cloudskillsboost.google/course_templates/536',
    skillsCovered: ['rag-vector', 'llm-genai'],
    difficulty: 'Intermediate',
    estimatedHours: 14,
    language: 'English',
    isFree: true,
    rating: 4.8,
    ratingSource: 'Google Cloud Skills Boost',
    description: 'Chunking strategies, text embeddings, pgvector / vector stores, cosine similarity, and contextual augmentation.'
  },
  {
    title: 'Deep Learning with PyTorch: Zero to GANs',
    provider: 'freeCodeCamp',
    destinationUrl: 'https://www.freecodecamp.org/news/learn-pytorch-for-deep-learning/',
    skillsCovered: ['pytorch-tf', 'ml-foundations'],
    difficulty: 'Intermediate',
    estimatedHours: 26,
    language: 'English',
    isFree: true,
    rating: 4.8,
    ratingSource: 'freeCodeCamp PyTorch Handbook',
    description: 'Tensors, gradients, convolutional neural networks (CNNs), recurrent nets, transformers, and model inference.'
  },

  // 37 to 43: Cybersecurity
  {
    title: 'OWASP Top 10 Web Application Security Fundamentals',
    provider: 'freeCodeCamp',
    destinationUrl: 'https://www.freecodecamp.org/news/web-application-security-fundamentals/',
    skillsCovered: ['appsec-owasp'],
    difficulty: 'Intermediate',
    estimatedHours: 10,
    language: 'English',
    isFree: true,
    rating: 4.8,
    ratingSource: 'OWASP Foundation Guides',
    description: 'Deep dive into SQLi, Cross-Site Scripting (XSS), CSRF, IDOR, sensitive data exposure, and security headers.'
  },
  {
    title: 'Identity & Access Management (OAuth 2.0 & JWT Security)',
    provider: 'Microsoft Learn',
    destinationUrl: 'https://learn.microsoft.com/en-us/training/modules/implement-secure-identities/',
    skillsCovered: ['auth-iam', 'appsec-owasp'],
    difficulty: 'Intermediate',
    estimatedHours: 10,
    language: 'English',
    isFree: true,
    rating: 4.7,
    ratingSource: 'Microsoft Learn',
    description: 'PKCE authorization flow, access/refresh token rotation, RBAC, cryptographically signed claims, and session hygiene.'
  },
  {
    title: 'Network Defense, TLS and API Hardening',
    provider: 'NPTEL',
    destinationUrl: 'https://nptel.ac.in/courses/106105031',
    skillsCovered: ['netsec-threat'],
    difficulty: 'Intermediate',
    estimatedHours: 20,
    language: 'Bilingual',
    isFree: true,
    rating: 4.6,
    ratingSource: 'NPTEL Security Track',
    description: 'Cryptographic handshakes, TLS 1.3, rate limiting algorithms (token bucket, leaky bucket), and DDoS mitigation.'
  },

  // 44 to 50: Leadership, Communication & Product
  {
    title: 'Writing Technical Documentation & Architectural RFCs',
    provider: 'Google Open Source Peer Track',
    destinationUrl: 'https://developers.google.com/tech-writing',
    skillsCovered: ['tech-writing'],
    difficulty: 'Beginner',
    estimatedHours: 8,
    language: 'English',
    isFree: true,
    rating: 4.9,
    ratingSource: 'Google Tech Writing Course',
    description: 'Techniques for clear technical communication, writing design documents, structuring READMEs, and API docs.'
  },
  {
    title: 'Product Discovery, PRD Craft & User Interviews',
    provider: 'Product School & Open Guides',
    destinationUrl: 'https://productschool.com/blog/product-management-2/product-discovery',
    skillsCovered: ['prod-discovery', 'user-research'],
    difficulty: 'Intermediate',
    estimatedHours: 14,
    language: 'English',
    isFree: true,
    rating: 4.7,
    ratingSource: 'Product School Guides',
    description: 'Synthesizing user pain points, writing unambiguous Product Requirements Documents, and prioritization frameworks (RICE).'
  },
  {
    title: 'Data-Informed Product Analytics and Metrics Frameworks',
    provider: 'Amplitude Open Academy',
    destinationUrl: 'https://amplitude.com/product-analytics-playbook',
    skillsCovered: ['product-analytics', 'bi-modeling'],
    difficulty: 'Intermediate',
    estimatedHours: 12,
    language: 'English',
    isFree: true,
    rating: 4.8,
    ratingSource: 'Amplitude Academy',
    description: 'Master North Star metric trees, activation funnels, retention curves, cohort segmentation, and feature adoption.'
  },
  {
    title: 'Agile Team Dynamics and Engineering Mentorship',
    provider: 'Atlassian Agile Coach',
    destinationUrl: 'https://www.atlassian.com/agile',
    skillsCovered: ['agile-teamwork', 'stakeholder-mgt'],
    difficulty: 'All Levels',
    estimatedHours: 8,
    language: 'English',
    isFree: true,
    rating: 4.8,
    ratingSource: 'Atlassian Guides',
    description: 'Scrum vs Kanban, effective sprint retrospectives, psychological safety, and fostering collaborative engineering culture.'
  }
];

export const diagnosticQuestionsData = [
  // TypeScript & JS
  {
    skillCode: 'ts-js',
    questionText: 'What is the primary difference between TypeScript "unknown" and "any" types?',
    type: 'single_mcq',
    difficulty: 'intermediate',
    options: [
      { id: 'opt1', text: 'unknown permits any property access without checking, whereas any enforces type guards' },
      { id: 'opt2', text: 'unknown is type-safe and forces narrowing or assertion before operations, while any bypasses all compiler checks' },
      { id: 'opt3', text: 'unknown can only hold primitive values, while any can hold objects' },
      { id: 'opt4', text: 'unknown is an alias for null and undefined' }
    ],
    correctAnswers: ['opt2'],
    explanation: 'The unknown type is the type-safe counterpart of any. Anything is assignable to unknown, but unknown is not assignable to anything else without a type assertion or control flow based narrowing.'
  },
  {
    skillCode: 'ts-js',
    questionText: 'How does the JavaScript event loop handle microtasks (e.g., Promise.then callbacks) relative to macrotasks (e.g., setTimeout)?',
    type: 'single_mcq',
    difficulty: 'intermediate',
    options: [
      { id: 'opt1', text: 'Microtasks run only once every animation frame' },
      { id: 'opt2', text: 'Macrotasks always preempt microtasks when timers expire' },
      { id: 'opt3', text: 'The entire microtask queue is drained to completion immediately after each task before picking the next macrotask' },
      { id: 'opt4', text: 'Microtasks and macrotasks run in parallel worker threads' }
    ],
    correctAnswers: ['opt3'],
    explanation: 'The microtask queue has priority over macrotasks; before each new macrotask, the browser drains all microtasks that have been enqueued.'
  },
  // React
  {
    skillCode: 'react',
    questionText: 'Which scenario will cause a React component using React.memo to re-render despite its primitive props remaining identical?',
    type: 'single_mcq',
    difficulty: 'intermediate',
    options: [
      { id: 'opt1', text: 'A parent passes a new inline arrow function callback on every render without useCallback' },
      { id: 'opt2', text: 'The child component has internal CSS classes' },
      { id: 'opt3', text: 'The component is rendered inside a React Fragment' },
      { id: 'opt4', text: 'The child component has defaultProps defined' }
    ],
    correctAnswers: ['opt1'],
    explanation: 'React.memo performs shallow comparison of props. If a new object or function reference is created on each parent render, the shallow equality check fails and forces a re-render.'
  },
  // Advanced SQL
  {
    skillCode: 'adv-sql',
    questionText: 'What does the SQL window function DENSE_RANK() do when two rows have identical sorting values?',
    type: 'single_mcq',
    difficulty: 'intermediate',
    options: [
      { id: 'opt1', text: 'It skips the next numerical rank (e.g., 1, 1, 3)' },
      { id: 'opt2', text: 'It assigns both rows the same rank and assigns the immediately consecutive integer to the next row (e.g., 1, 1, 2)' },
      { id: 'opt3', text: 'It throws a runtime collision error unless a secondary key is specified' },
      { id: 'opt4', text: 'It assigns ranks randomly among tied rows' }
    ],
    correctAnswers: ['opt2'],
    explanation: 'DENSE_RANK() does not leave gaps in the ranking sequence when ties occur, unlike RANK() which leaves gaps.'
  },
  // LLM GenAI
  {
    skillCode: 'llm-genai',
    questionText: 'What is temperature in LLM generation, and how does setting temperature to 0.0 affect model output?',
    type: 'single_mcq',
    difficulty: 'intermediate',
    options: [
      { id: 'opt1', text: 'It sets execution speed; 0.0 means maximum latency' },
      { id: 'opt2', text: 'It controls output sampling randomness; 0.0 yields greedy decoding with deterministic top-token choices' },
      { id: 'opt3', text: 'It limits maximum token length to zero' },
      { id: 'opt4', text: 'It enables multi-modal image inputs' }
    ],
    correctAnswers: ['opt2'],
    explanation: 'Temperature scales logits before the softmax operation. At 0.0, the model strictly selects the token with the highest probability at each step (greedy decoding), minimizing stochastic variation.'
  },
  // RAG & Vector
  {
    skillCode: 'rag-vector',
    questionText: 'Which similarity metric is most commonly preferred for normalized text embedding vector comparison in pgvector?',
    type: 'single_mcq',
    difficulty: 'intermediate',
    options: [
      { id: 'opt1', text: 'Manhattan distance (L1)' },
      { id: 'opt2', text: 'Cosine distance / Inner product' },
      { id: 'opt3', text: 'Hamming distance' },
      { id: 'opt4', text: 'Levenshtein distance' }
    ],
    correctAnswers: ['opt2'],
    explanation: 'For unit-normalized vectors, cosine distance is mathematically equivalent to 1 minus the inner product, making inner product or cosine distance standard for semantic similarity.'
  },
  // System Design
  {
    skillCode: 'sys-design',
    questionText: 'What is the primary difference between a write-through cache and a write-back (write-behind) cache?',
    type: 'single_mcq',
    difficulty: 'advanced',
    options: [
      { id: 'opt1', text: 'Write-through writes synchronously to both cache and backing DB before returning; write-back writes to cache first and asynchronously writes to DB' },
      { id: 'opt2', text: 'Write-through only stores read keys, whereas write-back stores write keys' },
      { id: 'opt3', text: 'Write-back guarantees zero data loss on node failure compared to write-through' },
      { id: 'opt4', text: 'Write-through requires NoSQL while write-back requires SQL' }
    ],
    correctAnswers: ['opt1'],
    explanation: 'Write-through provides strong consistency by updating both cache and storage simultaneously. Write-back provides lower latency by writing to cache and flushing asynchronously to storage, with higher risk if cache nodes fail before flushing.'
  },
  // AppSec OWASP
  {
    skillCode: 'appsec-owasp',
    questionText: 'Which security defense effectively neutralizes SQL Injection in modern web backends?',
    type: 'single_mcq',
    difficulty: 'beginner',
    options: [
      { id: 'opt1', text: 'Storing database passwords in base64 strings' },
      { id: 'opt2', text: 'Using parameterized queries / prepared statements instead of string concatenation' },
      { id: 'opt3', text: 'Enabling CORS with Access-Control-Allow-Origin: *' },
      { id: 'opt4', text: 'Encrypting client IP addresses in session logs' }
    ],
    correctAnswers: ['opt2'],
    explanation: 'Parameterized queries and prepared statements ensure the database engine treats user input strictly as data rather than executable SQL syntax.'
  }
];
