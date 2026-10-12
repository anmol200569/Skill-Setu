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
  {
    "title": "CS50x: Introduction to Computer Science",
    "provider": "CS50",
    "destinationUrl": "https://cs50.harvard.edu/x/",
    "skillsCovered": [
      "python",
      "sql-db"
    ],
    "difficulty": "Beginner",
    "estimatedHours": 40,
    "language": "English",
    "isFree": true,
    "rating": 4.9,
    "ratingSource": "Harvard Online",
    "description": "An introduction to the intellectual enterprises of computer science and the art of programming."
  },
  {
    "title": "CS50's Introduction to Programming with Python",
    "provider": "CS50",
    "destinationUrl": "https://cs50.harvard.edu/python/",
    "skillsCovered": [
      "python"
    ],
    "difficulty": "Beginner",
    "estimatedHours": 35,
    "language": "English",
    "isFree": true,
    "rating": 4.9,
    "ratingSource": "Harvard Online",
    "description": "Learn Python fundamentals, functions, variables, conditionals, loops, exceptions, libraries, unit tests, and file I/O."
  },
  {
    "title": "CS50's Web Programming with Python and JavaScript",
    "provider": "CS50",
    "destinationUrl": "https://cs50.harvard.edu/web/",
    "skillsCovered": [
      "ts-js",
      "react",
      "python",
      "sql-db"
    ],
    "difficulty": "Intermediate",
    "estimatedHours": 45,
    "language": "English",
    "isFree": true,
    "rating": 4.9,
    "ratingSource": "Harvard Online",
    "description": "Dive deeper into the design and implementation of web apps with Python, JavaScript, React, and SQL."
  },
  {
    "title": "CS50's Introduction to Databases with SQL",
    "provider": "CS50",
    "destinationUrl": "https://cs50.harvard.edu/sql/",
    "skillsCovered": [
      "sql-db",
      "adv-sql"
    ],
    "difficulty": "Intermediate",
    "estimatedHours": 30,
    "language": "English",
    "isFree": true,
    "rating": 4.9,
    "ratingSource": "Harvard Online",
    "description": "Learn relational database modeling, normalization, indexing, transactions, and advanced queries with SQLite and PostgreSQL."
  },
  {
    "title": "CS50's Introduction to Artificial Intelligence with Python",
    "provider": "CS50",
    "destinationUrl": "https://cs50.harvard.edu/ai/",
    "skillsCovered": [
      "ml-foundations",
      "python"
    ],
    "difficulty": "Intermediate",
    "estimatedHours": 40,
    "language": "English",
    "isFree": true,
    "rating": 4.8,
    "ratingSource": "Harvard Online",
    "description": "Explores concepts and algorithms at the foundation of modern artificial intelligence, machine learning, and neural networks."
  },
  {
    "title": "CS50's Introduction to Cybersecurity",
    "provider": "CS50",
    "destinationUrl": "https://cs50.harvard.edu/cybersecurity/",
    "skillsCovered": [
      "appsec-owasp",
      "netsec-threat"
    ],
    "difficulty": "Beginner",
    "estimatedHours": 25,
    "language": "English",
    "isFree": true,
    "rating": 4.8,
    "ratingSource": "Harvard Online",
    "description": "Learn how to secure accounts, data, devices, and systems against threats, recognizing vulnerabilities and defense-in-depth."
  },
  {
    "title": "CS50's Understanding Technology",
    "provider": "CS50",
    "destinationUrl": "https://cs50.harvard.edu/technology/",
    "skillsCovered": [
      "netsec-threat",
      "tech-writing"
    ],
    "difficulty": "Beginner",
    "estimatedHours": 20,
    "language": "English",
    "isFree": true,
    "rating": 4.7,
    "ratingSource": "Harvard Online",
    "description": "Demystifies hardware, the Internet, multimedia, security, programming, and web technology for everyday professionals."
  },
  {
    "title": "CS50 for Business Professionals",
    "provider": "CS50",
    "destinationUrl": "https://cs50.harvard.edu/business/",
    "skillsCovered": [
      "stakeholder-mgt",
      "prod-discovery",
      "user-research"
    ],
    "difficulty": "Beginner",
    "estimatedHours": 20,
    "language": "English",
    "isFree": true,
    "rating": 4.8,
    "ratingSource": "Harvard Online",
    "description": "CS50's adaptation for business leaders, managers, and product founders making high-stakes technological decisions."
  },
  {
    "title": "JavaScript Algorithms and Data Structures",
    "provider": "freeCodeCamp",
    "destinationUrl": "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/",
    "skillsCovered": [
      "ts-js"
    ],
    "difficulty": "Beginner",
    "estimatedHours": 50,
    "language": "English",
    "isFree": true,
    "rating": 4.9,
    "ratingSource": "freeCodeCamp Curriculum",
    "description": "Learn JavaScript fundamentals, ES6+ features, functional programming, OOP, and algorithm problem-solving."
  },
  {
    "title": "Front End Development Libraries",
    "provider": "freeCodeCamp",
    "destinationUrl": "https://www.freecodecamp.org/learn/front-end-development-libraries/",
    "skillsCovered": [
      "react",
      "ts-js",
      "user-research"
    ],
    "difficulty": "Intermediate",
    "estimatedHours": 40,
    "language": "English",
    "isFree": true,
    "rating": 4.8,
    "ratingSource": "freeCodeCamp Curriculum",
    "description": "Build responsive UI applications using React, Redux, state management, components, and design systems."
  },
  {
    "title": "Back End Development and APIs",
    "provider": "freeCodeCamp",
    "destinationUrl": "https://www.freecodecamp.org/learn/back-end-development-and-apis/",
    "skillsCovered": [
      "nodejs",
      "sql-db"
    ],
    "difficulty": "Intermediate",
    "estimatedHours": 40,
    "language": "English",
    "isFree": true,
    "rating": 4.8,
    "ratingSource": "freeCodeCamp Curriculum",
    "description": "Build backend microservices and RESTful APIs using Node.js, Express, MongoDB, and Mongoose."
  },
  {
    "title": "Scientific Computing with Python",
    "provider": "freeCodeCamp",
    "destinationUrl": "https://www.freecodecamp.org/learn/scientific-computing-with-python/",
    "skillsCovered": [
      "python"
    ],
    "difficulty": "Beginner",
    "estimatedHours": 35,
    "language": "English",
    "isFree": true,
    "rating": 4.8,
    "ratingSource": "freeCodeCamp Curriculum",
    "description": "Master Python core algorithms, data structures, strings, files, tuples, and object-oriented paradigms."
  },
  {
    "title": "Data Analysis with Python",
    "provider": "freeCodeCamp",
    "destinationUrl": "https://www.freecodecamp.org/learn/data-analysis-with-python/",
    "skillsCovered": [
      "eda-pandas",
      "data-vis",
      "product-analytics"
    ],
    "difficulty": "Intermediate",
    "estimatedHours": 30,
    "language": "English",
    "isFree": true,
    "rating": 4.8,
    "ratingSource": "freeCodeCamp Curriculum",
    "description": "Clean, transform, and analyze datasets with NumPy, Pandas, Matplotlib, and Seaborn for business insights."
  },
  {
    "title": "Machine Learning with Python",
    "provider": "freeCodeCamp",
    "destinationUrl": "https://www.freecodecamp.org/learn/machine-learning-with-python/",
    "skillsCovered": [
      "ml-foundations",
      "pytorch-tf"
    ],
    "difficulty": "Intermediate",
    "estimatedHours": 45,
    "language": "English",
    "isFree": true,
    "rating": 4.8,
    "ratingSource": "freeCodeCamp Curriculum",
    "description": "Learn machine learning algorithms, classification, regression, neural networks, and computer vision with TensorFlow."
  },
  {
    "title": "Information Security Certification Track",
    "provider": "freeCodeCamp",
    "destinationUrl": "https://www.freecodecamp.org/learn/information-security/",
    "skillsCovered": [
      "appsec-owasp",
      "auth-iam",
      "netsec-threat"
    ],
    "difficulty": "Intermediate",
    "estimatedHours": 40,
    "language": "English",
    "isFree": true,
    "rating": 4.8,
    "ratingSource": "freeCodeCamp Curriculum",
    "description": "Web application security with HelmetJS, penetration testing, defensive coding, hashing, and cryptography."
  },
  {
    "title": "TypeScript in 50 Lessons & Production Practices",
    "provider": "freeCodeCamp",
    "destinationUrl": "https://www.freecodecamp.org/news/learn-typescript-beginners-guide/",
    "skillsCovered": [
      "ts-js"
    ],
    "difficulty": "Intermediate",
    "estimatedHours": 12,
    "language": "English",
    "isFree": true,
    "rating": 4.8,
    "ratingSource": "freeCodeCamp Community",
    "description": "Deep dive into TypeScript utility types, generics, interfaces, strict compiler options, and code patterns."
  },
  {
    "title": "The Docker Handbook for Beginners to Production",
    "provider": "freeCodeCamp",
    "destinationUrl": "https://www.freecodecamp.org/news/the-docker-handbook/",
    "skillsCovered": [
      "docker-k8s"
    ],
    "difficulty": "Beginner",
    "estimatedHours": 12,
    "language": "English",
    "isFree": true,
    "rating": 4.9,
    "ratingSource": "freeCodeCamp Community",
    "description": "Comprehensive guide to containerization, Dockerfiles, multi-stage builds, volumes, Compose, and security."
  },
  {
    "title": "Git and GitHub Crash Course for Developers",
    "provider": "freeCodeCamp",
    "destinationUrl": "https://www.freecodecamp.org/news/git-and-github-crash-course/",
    "skillsCovered": [
      "cicd-github"
    ],
    "difficulty": "Beginner",
    "estimatedHours": 8,
    "language": "English",
    "isFree": true,
    "rating": 4.9,
    "ratingSource": "freeCodeCamp Community",
    "description": "Version control mastery: branching, merging, rebasing, pull requests, workflows, and collaboration."
  },
  {
    "title": "SQL and Relational Databases Full Course",
    "provider": "freeCodeCamp",
    "destinationUrl": "https://www.freecodecamp.org/news/sql-and-databases-full-course/",
    "skillsCovered": [
      "sql-db",
      "adv-sql"
    ],
    "difficulty": "Beginner",
    "estimatedHours": 15,
    "language": "English",
    "isFree": true,
    "rating": 4.8,
    "ratingSource": "freeCodeCamp Community",
    "description": "Complete SQL course covering schema design, CRUD, joins, subqueries, group by, indexing, and ACID principles."
  },
  {
    "title": "How to Write Clear Technical Documentation and READMEs",
    "provider": "freeCodeCamp",
    "destinationUrl": "https://www.freecodecamp.org/news/how-to-write-a-good-readme-file/",
    "skillsCovered": [
      "tech-writing"
    ],
    "difficulty": "Beginner",
    "estimatedHours": 6,
    "language": "English",
    "isFree": true,
    "rating": 4.8,
    "ratingSource": "freeCodeCamp Community",
    "description": "Practical guide to structuring architecture docs, open-source READMEs, contribution guides, and API specs."
  },
  {
    "title": "Microsoft Azure Fundamentals (AZ-900)",
    "provider": "Microsoft Learn",
    "destinationUrl": "https://learn.microsoft.com/en-us/training/courses/az-900t00",
    "skillsCovered": [
      "aws-cloud"
    ],
    "difficulty": "Beginner",
    "estimatedHours": 16,
    "language": "English",
    "isFree": true,
    "rating": 4.8,
    "ratingSource": "Microsoft Learn",
    "description": "Foundational cloud concepts: compute, storage, networking, high availability, disaster recovery, and cost management."
  },
  {
    "title": "Microsoft Azure Data Fundamentals (DP-900)",
    "provider": "Microsoft Learn",
    "destinationUrl": "https://learn.microsoft.com/en-us/training/courses/dp-900t00",
    "skillsCovered": [
      "sql-db",
      "adv-sql",
      "bi-modeling"
    ],
    "difficulty": "Beginner",
    "estimatedHours": 14,
    "language": "English",
    "isFree": true,
    "rating": 4.7,
    "ratingSource": "Microsoft Learn",
    "description": "Core data concepts: relational databases, non-relational storage, analytical data warehousing, and Power BI visualization."
  },
  {
    "title": "Microsoft Azure AI Fundamentals (AI-900)",
    "provider": "Microsoft Learn",
    "destinationUrl": "https://learn.microsoft.com/en-us/training/courses/ai-900t00",
    "skillsCovered": [
      "ml-foundations",
      "llm-genai"
    ],
    "difficulty": "Beginner",
    "estimatedHours": 12,
    "language": "English",
    "isFree": true,
    "rating": 4.8,
    "ratingSource": "Microsoft Learn",
    "description": "Explore artificial intelligence workloads, computer vision, natural language processing, and conversational AI."
  },
  {
    "title": "Security, Compliance, and Identity Fundamentals (SC-900)",
    "provider": "Microsoft Learn",
    "destinationUrl": "https://learn.microsoft.com/en-us/training/courses/sc-900t00",
    "skillsCovered": [
      "auth-iam",
      "netsec-threat"
    ],
    "difficulty": "Beginner",
    "estimatedHours": 12,
    "language": "English",
    "isFree": true,
    "rating": 4.8,
    "ratingSource": "Microsoft Learn",
    "description": "Understand Zero Trust principles, identity management, access lifecycle, threat protection, and cloud compliance."
  },
  {
    "title": "Microsoft Power Platform Fundamentals (PL-900)",
    "provider": "Microsoft Learn",
    "destinationUrl": "https://learn.microsoft.com/en-us/training/courses/pl-900t00",
    "skillsCovered": [
      "bi-modeling",
      "prod-discovery"
    ],
    "difficulty": "Beginner",
    "estimatedHours": 12,
    "language": "English",
    "isFree": true,
    "rating": 4.7,
    "ratingSource": "Microsoft Learn",
    "description": "Learn business application modernization, Dataverse entities, Power Apps, automated flows, and Power BI dashboards."
  },
  {
    "title": "Microsoft Azure Administrator (AZ-104)",
    "provider": "Microsoft Learn",
    "destinationUrl": "https://learn.microsoft.com/en-us/training/courses/az-104t00",
    "skillsCovered": [
      "aws-cloud",
      "docker-k8s"
    ],
    "difficulty": "Intermediate",
    "estimatedHours": 24,
    "language": "English",
    "isFree": true,
    "rating": 4.8,
    "ratingSource": "Microsoft Learn",
    "description": "Implement, manage, and monitor virtual networks, storage accounts, compute VMs, container instances, and governance."
  },
  {
    "title": "Developing Solutions for Microsoft Azure (AZ-204)",
    "provider": "Microsoft Learn",
    "destinationUrl": "https://learn.microsoft.com/en-us/training/courses/az-204t00",
    "skillsCovered": [
      "nodejs",
      "ts-js",
      "docker-k8s"
    ],
    "difficulty": "Intermediate",
    "estimatedHours": 28,
    "language": "English",
    "isFree": true,
    "rating": 4.8,
    "ratingSource": "Microsoft Learn",
    "description": "Create serverless compute functions, containerized web apps, event-driven integrations, and caching tiers."
  },
  {
    "title": "Data Engineering on Microsoft Azure (DP-203)",
    "provider": "Microsoft Learn",
    "destinationUrl": "https://learn.microsoft.com/en-us/training/courses/dp-203t00",
    "skillsCovered": [
      "adv-sql",
      "eda-pandas",
      "bi-modeling"
    ],
    "difficulty": "Intermediate",
    "estimatedHours": 30,
    "language": "English",
    "isFree": true,
    "rating": 4.8,
    "ratingSource": "Microsoft Learn",
    "description": "Integrate, transform, and consolidate data from structured and unstructured systems using Spark, Synapse, and SQL."
  },
  {
    "title": "Designing and Implementing an Azure AI Solution (AI-102)",
    "provider": "Microsoft Learn",
    "destinationUrl": "https://learn.microsoft.com/en-us/training/courses/ai-102t00",
    "skillsCovered": [
      "llm-genai",
      "rag-vector"
    ],
    "difficulty": "Intermediate",
    "estimatedHours": 24,
    "language": "English",
    "isFree": true,
    "rating": 4.8,
    "ratingSource": "Microsoft Learn",
    "description": "Build enterprise AI applications utilizing Azure Cognitive Services, speech, computer vision, and language agents."
  },
  {
    "title": "Designing and Implementing DevOps Solutions (AZ-400)",
    "provider": "Microsoft Learn",
    "destinationUrl": "https://learn.microsoft.com/en-us/training/courses/az-400t00",
    "skillsCovered": [
      "cicd-github",
      "docker-k8s",
      "agile-teamwork"
    ],
    "difficulty": "Advanced",
    "estimatedHours": 26,
    "language": "English",
    "isFree": true,
    "rating": 4.9,
    "ratingSource": "Microsoft Learn",
    "description": "Design CI/CD release pipelines, code quality gates, Git branching strategies, infrastructure as code, and compliance."
  },
  {
    "title": "Microsoft Power BI Data Analyst (PL-300)",
    "provider": "Microsoft Learn",
    "destinationUrl": "https://learn.microsoft.com/en-us/training/courses/pl-300t00",
    "skillsCovered": [
      "data-vis",
      "bi-modeling",
      "product-analytics"
    ],
    "difficulty": "Intermediate",
    "estimatedHours": 22,
    "language": "English",
    "isFree": true,
    "rating": 4.9,
    "ratingSource": "Microsoft Learn",
    "description": "Clean data, build semantic data models, author complex DAX formulas, and publish interactive executive reports."
  },
  {
    "title": "Microsoft Security Operations Analyst (SC-200)",
    "provider": "Microsoft Learn",
    "destinationUrl": "https://learn.microsoft.com/en-us/training/courses/sc-200t00",
    "skillsCovered": [
      "netsec-threat",
      "appsec-owasp"
    ],
    "difficulty": "Intermediate",
    "estimatedHours": 20,
    "language": "English",
    "isFree": true,
    "rating": 4.8,
    "ratingSource": "Microsoft Learn",
    "description": "Mitigate active cyber threats using Microsoft Defender, investigate attacks, configure SIEM/SOAR alerts and mitigation."
  },
  {
    "title": "Designing Azure Infrastructure Solutions (AZ-305)",
    "provider": "Microsoft Learn",
    "destinationUrl": "https://learn.microsoft.com/en-us/training/courses/az-305t00",
    "skillsCovered": [
      "sys-design",
      "aws-cloud",
      "k8s-orch"
    ],
    "difficulty": "Advanced",
    "estimatedHours": 32,
    "language": "English",
    "isFree": true,
    "rating": 4.9,
    "ratingSource": "Microsoft Learn",
    "description": "Architect resilient enterprise solutions, business continuity, identity, governance, and hybrid networking topologies."
  },
  {
    "title": "Administering Microsoft Azure SQL Databases (DP-300)",
    "provider": "Microsoft Learn",
    "destinationUrl": "https://learn.microsoft.com/en-us/training/courses/dp-300t00",
    "skillsCovered": [
      "sql-db",
      "adv-sql"
    ],
    "difficulty": "Intermediate",
    "estimatedHours": 22,
    "language": "English",
    "isFree": true,
    "rating": 4.7,
    "ratingSource": "Microsoft Learn",
    "description": "Implement database high availability, disaster recovery, query performance tuning, indexing, and T-SQL optimization."
  },
  {
    "title": "Develop Generative AI Solutions with Azure OpenAI (AI-050)",
    "provider": "Microsoft Learn",
    "destinationUrl": "https://learn.microsoft.com/en-us/training/courses/ai-050t00",
    "skillsCovered": [
      "llm-genai",
      "rag-vector"
    ],
    "difficulty": "Intermediate",
    "estimatedHours": 16,
    "language": "English",
    "isFree": true,
    "rating": 4.9,
    "ratingSource": "Microsoft Learn",
    "description": "Configure Azure OpenAI models, engineer effective prompts, implement RAG with embeddings, and enforce safety guardrails."
  },
  {
    "title": "Microsoft Identity and Access Administrator (SC-300)",
    "provider": "Microsoft Learn",
    "destinationUrl": "https://learn.microsoft.com/en-us/training/courses/sc-300t00",
    "skillsCovered": [
      "auth-iam",
      "appsec-owasp"
    ],
    "difficulty": "Intermediate",
    "estimatedHours": 18,
    "language": "English",
    "isFree": true,
    "rating": 4.8,
    "ratingSource": "Microsoft Learn",
    "description": "Implement Microsoft Entra ID, OAuth/OIDC tokens, Conditional Access, multi-factor auth, and privileged access management."
  },
  {
    "title": "Microsoft Azure Security Technologies (AZ-500)",
    "provider": "Microsoft Learn",
    "destinationUrl": "https://learn.microsoft.com/en-us/training/courses/az-500t00",
    "skillsCovered": [
      "netsec-threat",
      "auth-iam",
      "appsec-owasp"
    ],
    "difficulty": "Advanced",
    "estimatedHours": 24,
    "language": "English",
    "isFree": true,
    "rating": 4.8,
    "ratingSource": "Microsoft Learn",
    "description": "Implement security controls and threat protection across networking, compute, storage, key vaults, and databases."
  },
  {
    "title": "Programming in Python (IIT Madras)",
    "provider": "NPTEL",
    "destinationUrl": "https://nptel.ac.in/courses/106106145",
    "skillsCovered": [
      "python"
    ],
    "difficulty": "Beginner",
    "estimatedHours": 30,
    "language": "Bilingual",
    "isFree": true,
    "rating": 4.7,
    "ratingSource": "NPTEL Swayam Portal",
    "description": "In-depth Python programming taught by IIT Madras faculty covering idioms, OOP, modules, and testing."
  },
  {
    "title": "Data Science for Engineers (IIT Kharagpur)",
    "provider": "NPTEL",
    "destinationUrl": "https://nptel.ac.in/courses/106105151",
    "skillsCovered": [
      "eda-pandas",
      "data-vis"
    ],
    "difficulty": "Intermediate",
    "estimatedHours": 28,
    "language": "English",
    "isFree": true,
    "rating": 4.6,
    "ratingSource": "NPTEL Swayam Portal",
    "description": "Linear algebra, optimization, statistics, R/Python programming, and hypothesis testing for data engineering."
  },
  {
    "title": "Cryptography and Network Security (IIT Kharagpur)",
    "provider": "NPTEL",
    "destinationUrl": "https://nptel.ac.in/courses/106105031",
    "skillsCovered": [
      "netsec-threat",
      "appsec-owasp"
    ],
    "difficulty": "Intermediate",
    "estimatedHours": 25,
    "language": "English",
    "isFree": true,
    "rating": 4.6,
    "ratingSource": "NPTEL Swayam Portal",
    "description": "Classical encryption, AES, RSA, digital signatures, message authentication codes, TLS protocols, and firewalls."
  },
  {
    "title": "Database Management System (IIT Madras)",
    "provider": "NPTEL",
    "destinationUrl": "https://nptel.ac.in/courses/106106166",
    "skillsCovered": [
      "sql-db",
      "adv-sql"
    ],
    "difficulty": "Intermediate",
    "estimatedHours": 32,
    "language": "English",
    "isFree": true,
    "rating": 4.7,
    "ratingSource": "NPTEL Swayam Portal",
    "description": "Relational algebra, SQL, normal forms, indexing (B+ trees), query processing, concurrency control, and transactions."
  },
  {
    "title": "Deep Learning (IIT Madras)",
    "provider": "NPTEL",
    "destinationUrl": "https://nptel.ac.in/courses/106106198",
    "skillsCovered": [
      "pytorch-tf",
      "ml-foundations"
    ],
    "difficulty": "Advanced",
    "estimatedHours": 35,
    "language": "English",
    "isFree": true,
    "rating": 4.7,
    "ratingSource": "NPTEL Swayam Portal",
    "description": "Feedforward neural networks, backpropagation, CNNs, RNNs, attention mechanisms, and deep generative models."
  },
  {
    "title": "Introduction to Machine Learning (IIT Madras)",
    "provider": "NPTEL",
    "destinationUrl": "https://nptel.ac.in/courses/106106139",
    "skillsCovered": [
      "ml-foundations",
      "python"
    ],
    "difficulty": "Intermediate",
    "estimatedHours": 30,
    "language": "English",
    "isFree": true,
    "rating": 4.7,
    "ratingSource": "NPTEL Swayam Portal",
    "description": "Supervised and unsupervised learning, decision trees, support vector machines, clustering, and ensemble methods."
  },
  {
    "title": "Software Engineering (IIT Kharagpur)",
    "provider": "NPTEL",
    "destinationUrl": "https://nptel.ac.in/courses/106105175",
    "skillsCovered": [
      "agile-teamwork",
      "sys-design"
    ],
    "difficulty": "Intermediate",
    "estimatedHours": 28,
    "language": "English",
    "isFree": true,
    "rating": 4.6,
    "ratingSource": "NPTEL Swayam Portal",
    "description": "Software development life cycle, Agile methodologies, UML modeling, modular design, software testing, and metrics."
  },
  {
    "title": "Cloud Computing (IIT Kharagpur)",
    "provider": "NPTEL",
    "destinationUrl": "https://nptel.ac.in/courses/106105216",
    "skillsCovered": [
      "aws-cloud",
      "docker-k8s"
    ],
    "difficulty": "Intermediate",
    "estimatedHours": 28,
    "language": "English",
    "isFree": true,
    "rating": 4.6,
    "ratingSource": "NPTEL Swayam Portal",
    "description": "Virtualization, hypervisors, cloud storage, service models (IaaS/PaaS/SaaS), distributed resource management, and SLA."
  },
  {
    "title": "Computer Networks and Internet Protocol (IIT Kanpur)",
    "provider": "NPTEL",
    "destinationUrl": "https://nptel.ac.in/courses/106104019",
    "skillsCovered": [
      "netsec-threat"
    ],
    "difficulty": "Intermediate",
    "estimatedHours": 30,
    "language": "English",
    "isFree": true,
    "rating": 4.7,
    "ratingSource": "NPTEL Swayam Portal",
    "description": "TCP/IP architecture, socket programming, routing algorithms, congestion control, transport protocols, and DNS."
  },
  {
    "title": "Technical Communication for Engineers (IIT Kanpur)",
    "provider": "NPTEL",
    "destinationUrl": "https://nptel.ac.in/courses/109104031",
    "skillsCovered": [
      "tech-writing",
      "stakeholder-mgt"
    ],
    "difficulty": "Beginner",
    "estimatedHours": 20,
    "language": "English",
    "isFree": true,
    "rating": 4.6,
    "ratingSource": "NPTEL Swayam Portal",
    "description": "Formal technical writing, engineering proposal creation, presentation skills, executive briefs, and documentation."
  },
  {
    "title": "Project Management for Engineers (IIT Kharagpur)",
    "provider": "NPTEL",
    "destinationUrl": "https://nptel.ac.in/courses/110105089",
    "skillsCovered": [
      "prod-discovery",
      "agile-teamwork",
      "user-research"
    ],
    "difficulty": "Intermediate",
    "estimatedHours": 24,
    "language": "English",
    "isFree": true,
    "rating": 4.7,
    "ratingSource": "NPTEL Swayam Portal",
    "description": "Project appraisal, risk mitigation, critical path method (CPM/PERT), stakeholder communication, and Agile execution."
  },
  {
    "title": "Getting Started with Google Cloud",
    "provider": "Google Cloud Skills Boost",
    "destinationUrl": "https://www.cloudskillsboost.google/paths/8",
    "skillsCovered": [
      "aws-cloud"
    ],
    "difficulty": "Beginner",
    "estimatedHours": 10,
    "language": "English",
    "isFree": true,
    "rating": 4.8,
    "ratingSource": "Google Cloud Training",
    "description": "Explore the fundamental computing, storage, networking, database, and management services of Google Cloud."
  },
  {
    "title": "Cloud Digital Leader Certification Track",
    "provider": "Google Cloud Skills Boost",
    "destinationUrl": "https://www.cloudskillsboost.google/paths/9",
    "skillsCovered": [
      "aws-cloud",
      "prod-discovery"
    ],
    "difficulty": "Beginner",
    "estimatedHours": 12,
    "language": "English",
    "isFree": true,
    "rating": 4.8,
    "ratingSource": "Google Cloud Training",
    "description": "Understand cloud capabilities, digital transformation, cloud financial management, and business impact."
  },
  {
    "title": "Associate Cloud Engineer Learning Path",
    "provider": "Google Cloud Skills Boost",
    "destinationUrl": "https://www.cloudskillsboost.google/paths/11",
    "skillsCovered": [
      "aws-cloud",
      "docker-k8s"
    ],
    "difficulty": "Intermediate",
    "estimatedHours": 25,
    "language": "English",
    "isFree": true,
    "rating": 4.8,
    "ratingSource": "Google Cloud Training",
    "description": "Deploy applications, monitor operations, configure access control, and manage cloud enterprise solutions."
  },
  {
    "title": "Professional Cloud Architect Learning Path",
    "provider": "Google Cloud Skills Boost",
    "destinationUrl": "https://www.cloudskillsboost.google/paths/12",
    "skillsCovered": [
      "sys-design",
      "aws-cloud"
    ],
    "difficulty": "Advanced",
    "estimatedHours": 35,
    "language": "English",
    "isFree": true,
    "rating": 4.9,
    "ratingSource": "Google Cloud Training",
    "description": "Design robust, secure, scalable, and dynamic solutions to drive business objectives using cloud architecture patterns."
  },
  {
    "title": "Professional Network Engineer Certification Track",
    "provider": "Google Cloud Skills Boost",
    "destinationUrl": "https://www.cloudskillsboost.google/paths/14",
    "skillsCovered": [
      "netsec-threat"
    ],
    "difficulty": "Advanced",
    "estimatedHours": 25,
    "language": "English",
    "isFree": true,
    "rating": 4.7,
    "ratingSource": "Google Cloud Training",
    "description": "Design, implement, and manage network architectures, VPCs, hybrid interconnects, load balancing, and network security."
  },
  {
    "title": "Professional Security Engineer Learning Path",
    "provider": "Google Cloud Skills Boost",
    "destinationUrl": "https://www.cloudskillsboost.google/paths/15",
    "skillsCovered": [
      "netsec-threat",
      "auth-iam",
      "appsec-owasp"
    ],
    "difficulty": "Advanced",
    "estimatedHours": 30,
    "language": "English",
    "isFree": true,
    "rating": 4.8,
    "ratingSource": "Google Cloud Training",
    "description": "Implement defense-in-depth security, IAM zero trust, data protection, security monitoring, and regulatory compliance."
  },
  {
    "title": "Professional Data Engineer Learning Path",
    "provider": "Google Cloud Skills Boost",
    "destinationUrl": "https://www.cloudskillsboost.google/paths/16",
    "skillsCovered": [
      "adv-sql",
      "eda-pandas",
      "bi-modeling"
    ],
    "difficulty": "Intermediate",
    "estimatedHours": 35,
    "language": "English",
    "isFree": true,
    "rating": 4.9,
    "ratingSource": "Google Cloud Training",
    "description": "Build data-driven solutions by collecting, transforming, and publishing data through BigQuery, Dataflow, and Pub/Sub."
  },
  {
    "title": "Professional Machine Learning Engineer Learning Path",
    "provider": "Google Cloud Skills Boost",
    "destinationUrl": "https://www.cloudskillsboost.google/paths/17",
    "skillsCovered": [
      "ml-foundations",
      "pytorch-tf",
      "python"
    ],
    "difficulty": "Advanced",
    "estimatedHours": 35,
    "language": "English",
    "isFree": true,
    "rating": 4.8,
    "ratingSource": "Google Cloud Training",
    "description": "Design, build, and deploy machine learning models on Vertex AI with pipeline automation and model monitoring."
  },
  {
    "title": "Data Analyst Learning Path",
    "provider": "Google Cloud Skills Boost",
    "destinationUrl": "https://www.cloudskillsboost.google/paths/18",
    "skillsCovered": [
      "eda-pandas",
      "bi-modeling",
      "product-analytics"
    ],
    "difficulty": "Beginner",
    "estimatedHours": 20,
    "language": "English",
    "isFree": true,
    "rating": 4.8,
    "ratingSource": "Google Cloud Training",
    "description": "Transform data into meaningful insights using BigQuery SQL, Looker Studio dashboards, and statistical models."
  },
  {
    "title": "Professional Cloud Developer Certification Track",
    "provider": "Google Cloud Skills Boost",
    "destinationUrl": "https://www.cloudskillsboost.google/paths/19",
    "skillsCovered": [
      "nodejs",
      "ts-js",
      "docker-k8s"
    ],
    "difficulty": "Intermediate",
    "estimatedHours": 28,
    "language": "English",
    "isFree": true,
    "rating": 4.8,
    "ratingSource": "Google Cloud Training",
    "description": "Build scalable and secure cloud-native applications using modern developer tooling, Cloud Run, and managed services."
  },
  {
    "title": "Professional Cloud DevOps Engineer Learning Path",
    "provider": "Google Cloud Skills Boost",
    "destinationUrl": "https://www.cloudskillsboost.google/paths/20",
    "skillsCovered": [
      "cicd-github",
      "k8s-orch",
      "docker-k8s"
    ],
    "difficulty": "Advanced",
    "estimatedHours": 30,
    "language": "English",
    "isFree": true,
    "rating": 4.8,
    "ratingSource": "Google Cloud Training",
    "description": "Implement SRE practices, CI/CD automated deployments, system monitoring with Cloud Logging, and incident response."
  },
  {
    "title": "Kubernetes Fundamentals and Cluster Architecture",
    "provider": "Google Cloud Skills Boost",
    "destinationUrl": "https://www.cloudskillsboost.google/course_templates/2",
    "skillsCovered": [
      "k8s-orch",
      "docker-k8s"
    ],
    "difficulty": "Intermediate",
    "estimatedHours": 16,
    "language": "English",
    "isFree": true,
    "rating": 4.8,
    "ratingSource": "Google Cloud Training",
    "description": "Deploying pods, services, ingress, horizontal pod autoscaling, config maps, and rolling zero-downtime updates."
  },
  {
    "title": "Building RAG Systems with Vector Databases",
    "provider": "Google Cloud Skills Boost",
    "destinationUrl": "https://www.cloudskillsboost.google/course_templates/536",
    "skillsCovered": [
      "rag-vector",
      "llm-genai"
    ],
    "difficulty": "Intermediate",
    "estimatedHours": 14,
    "language": "English",
    "isFree": true,
    "rating": 4.8,
    "ratingSource": "Google Cloud Skills Boost",
    "description": "Chunking strategies, text embeddings, vector search, semantic retrieval, and contextual LLM augmentation."
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
