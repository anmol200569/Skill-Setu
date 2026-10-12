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
  {
    "skillCode": "ts-js",
    "questionText": "What will be the output of the following JavaScript code snippet?\n\n```javascript\nconsole.log(typeof typeof 1);\n```",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "\"number\""
      },
      {
        "id": "opt2",
        "text": "\"string\""
      },
      {
        "id": "opt3",
        "text": "\"undefined\""
      },
      {
        "id": "opt4",
        "text": "\"object\""
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "The `typeof 1` evaluates to the string `\"number\"`. Subsequently, `typeof \"number\"` evaluates to the string `\"string\"`, because the `typeof` operator always returns a string indicating the type of the operand."
  },
  {
    "skillCode": "ts-js",
    "questionText": "Which of the following methods can be used to remove the last element from an array and return that element in JavaScript?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "shift()"
      },
      {
        "id": "opt2",
        "text": "unshift()"
      },
      {
        "id": "opt3",
        "text": "pop()"
      },
      {
        "id": "opt4",
        "text": "push()"
      }
    ],
    "correctAnswers": [
      "opt3"
    ],
    "explanation": "`pop()` removes the last element from an array and returns that element. `shift()` removes the first element, `unshift()` adds elements to the beginning, and `push()` adds elements to the end."
  },
  {
    "skillCode": "ts-js",
    "questionText": "In TypeScript, interfaces and type aliases can both be used to define the shape of objects. However, interfaces can be merged (declaration merging), whereas type aliases cannot.",
    "type": "true_false",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "True"
      },
      {
        "id": "opt2",
        "text": "False"
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "True. TypeScript supports declaration merging for interfaces, meaning if you define the same interface multiple times, TypeScript will merge their members. Type aliases (`type X = ...`) throw a duplicate identifier error if declared more than once."
  },
  {
    "skillCode": "ts-js",
    "questionText": "Consider the following asynchronous JavaScript code. What is the execution order of the console logs?\n\n```javascript\nconsole.log('A');\nsetTimeout(() => console.log('B'), 0);\nPromise.resolve().then(() => console.log('C'));\nconsole.log('D');\n```",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "A, B, C, D"
      },
      {
        "id": "opt2",
        "text": "A, D, C, B"
      },
      {
        "id": "opt3",
        "text": "A, D, B, C"
      },
      {
        "id": "opt4",
        "text": "C, A, D, B"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Synchronous code runs first ('A', then 'D'). Microtasks (Promises) have higher priority than macrotasks (setTimeout), so 'C' runs before the macrotask queue executes 'B'. Thus, the order is A, D, C, B."
  },
  {
    "skillCode": "ts-js",
    "questionText": "Which of the following features are introduced or natively supported in modern ECMAScript (ES6+) and TypeScript? (Select all that apply)",
    "type": "multi_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Optional Chaining (`?.`)"
      },
      {
        "id": "opt2",
        "text": "Nullish Coalescing (`??`)"
      },
      {
        "id": "opt3",
        "text": "Block-scoped variables via `let` and `const`"
      },
      {
        "id": "opt4",
        "text": "Built-in garbage collection manual override (`gc()`) in strict mode"
      }
    ],
    "correctAnswers": [
      "opt1",
      "opt2",
      "opt3"
    ],
    "explanation": "Optional chaining, nullish coalescing, and block-scoped variables (`let`/`const`) are standard features of modern JS/TS. There is no standard built-in `gc()` manual override in strict mode JavaScript."
  },
  {
    "skillCode": "ts-js",
    "questionText": "What is the primary difference between `interface` and `type` when creating object structures in TypeScript?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Type aliases can represent primitive types, unions, and tuples, whereas interfaces are strictly for object shapes."
      },
      {
        "id": "opt2",
        "text": "Interfaces cannot implement classes, but type aliases can."
      },
      {
        "id": "opt3",
        "text": "Type aliases support declaration merging, but interfaces do not."
      },
      {
        "id": "opt4",
        "text": "Interfaces compile down to runtime JavaScript objects, while type aliases disappear completely."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "Type aliases can alias primitives, unions, and tuples, while interfaces are primarily designed to describe object-oriented shapes. Interfaces support declaration merging, not type aliases, and neither remains at runtime."
  },
  {
    "skillCode": "ts-js",
    "questionText": "What does the following TypeScript utility type evaluate to?\n\n```typescript\ntype Result = Pick<{ a: string; b: number; c: boolean }, 'a' | 'c'>;\n```",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "{ b: number }"
      },
      {
        "id": "opt2",
        "text": "{ a: string; c: boolean }"
      },
      {
        "id": "opt3",
        "text": "\"a\" | \"c\""
      },
      {
        "id": "opt4",
        "text": "{ a: string; b: number; c: boolean }"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "The `Pick<T, K>` utility type constructs a type by picking the set of properties `K` from `T`. Thus, picking 'a' and 'c' leaves `{ a: string; c: boolean }`."
  },
  {
    "skillCode": "ts-js",
    "questionText": "How does TypeScript's structural typing system handle object assignments compared to nominal typing languages like Java or C#?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "TypeScript checks explicit type names; if two objects have different class/interface names, they cannot be assigned."
      },
      {
        "id": "opt2",
        "text": "TypeScript checks if the target type has at least the same properties with compatible types, regardless of explicit naming."
      },
      {
        "id": "opt3",
        "text": "TypeScript relies entirely on runtime type checking via hidden metadata tags."
      },
      {
        "id": "opt4",
        "text": "TypeScript disallows object assignment entirely unless explicit casting (`as`) is used."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "TypeScript uses structural typing (duck typing), meaning if an object has the required properties and types specified by a target type, it is considered compatible, regardless of its explicit interface or class name."
  },
  {
    "skillCode": "ts-js",
    "questionText": "What is the outcome of utilizing TypeScript's `as const` assertion on an object literal?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "It turns the object into an immutable runtime instance using `Object.freeze` automatically."
      },
      {
        "id": "opt2",
        "text": "It infers the narrowest possible literal types and makes all properties readonly recursively."
      },
      {
        "id": "opt3",
        "text": "It forces the compiler to treat all properties as optional `string | undefined` types."
      },
      {
        "id": "opt4",
        "text": "It converts the object into a mapped type where keys are symbols."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "`as const` is a const assertion that tells TypeScript to infer literal types (e.g., `\"hello\"` instead of `string`) and marks all properties as `readonly` recursively, preventing mutations at the type level."
  },
  {
    "skillCode": "ts-js",
    "questionText": "What does conditional type distribution mean in TypeScript when applied to generic types?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Conditional types automatically distribute over union types when the checked type is a naked generic type parameter."
      },
      {
        "id": "opt2",
        "text": "Conditional types distribute execution loads across multiple worker threads at runtime."
      },
      {
        "id": "opt3",
        "text": "Conditional types distribute properties evenly across interface extensions."
      },
      {
        "id": "opt4",
        "text": "It forces union types to merge into a single broad primitive type during compilation."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "When conditional types act on a generic type that is a 'naked' type parameter (unwrapped by tuples, arrays, or functions), they become distributive. This means the conditional type is applied to each member of the union separately (e.g., `T extends U ? X : Y` applied to `A | B` results in `(A extends U ? X : Y) | (B extends U ? X : Y)`)."
  },
  {
    "skillCode": "react",
    "questionText": "What is the primary purpose of the `useState` hook in React?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "To fetch data from an external API and store it."
      },
      {
        "id": "opt2",
        "text": "To add stateful logic and reactive variables to functional components."
      },
      {
        "id": "opt3",
        "text": "To directly manipulate the real DOM elements outside the React tree."
      },
      {
        "id": "opt4",
        "text": "To optimize component re-renders by memoizing the return value."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "useState is a React Hook that lets you add a state variable to your component, allowing it to remember information and re-render when it changes. Option 1 is typically handled by useEffect, Option 3 breaks the declarative model (use refs instead), and Option 4 describes useMemo."
  },
  {
    "skillCode": "react",
    "questionText": "In React, props are passed from parent to child components and are considered mutable by the receiving child component.",
    "type": "true_false",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "True"
      },
      {
        "id": "opt2",
        "text": "False"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Props in React are strictly read-only (immutable) from the perspective of the child component receiving them. React components must act like pure functions with respect to their props."
  },
  {
    "skillCode": "react",
    "questionText": "Which hook should you use if you need to perform side effects such as data fetching, subscriptions, or manually changing the DOM?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "useContext"
      },
      {
        "id": "opt2",
        "text": "useReducer"
      },
      {
        "id": "opt3",
        "text": "useEffect"
      },
      {
        "id": "opt4",
        "text": "useRef"
      }
    ],
    "correctAnswers": [
      "opt3"
    ],
    "explanation": "useEffect lets you synchronize a component with an external system, which includes side effects like data fetching, subscriptions, or DOM manipulation. The other hooks serve different purposes: useContext for consuming context, useReducer for complex state logic, and useRef for holding mutable values without triggering re-renders."
  },
  {
    "skillCode": "react",
    "questionText": "When designing a custom hook that manages asynchronous data fetching, which of the following return patterns are idiomatic and commonly used in modern React applications?",
    "type": "multi_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Returning an object containing `data`, `loading`, and `error` states."
      },
      {
        "id": "opt2",
        "text": "Returning a mutate or refetch function along with the data."
      },
      {
        "id": "opt3",
        "text": "Using global window events directly inside the hook to communicate with other components."
      },
      {
        "id": "opt4",
        "text": "Accepting a callback function or dependency array to trigger re-fetches."
      }
    ],
    "correctAnswers": [
      "opt1",
      "opt2",
      "opt4"
    ],
    "explanation": "Idiomatic data-fetching hooks (like those in React Query or custom implementations) typically return state variables like data, loading, and error, expose a refetch/mutate handler, and accept dependencies or configuration options. Option 3 is an anti-pattern as it bypasses React's declarative data flow."
  },
  {
    "skillCode": "react",
    "questionText": "How does `useCallback` differ fundamentally from `useMemo`?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "useCallback caches a computed value, whereas useMemo caches a function definition."
      },
      {
        "id": "opt2",
        "text": "useCallback caches a function definition, whereas useMemo caches the result of a function call."
      },
      {
        "id": "opt3",
        "text": "useCallback runs synchronously on every render, while useMemo runs asynchronously."
      },
      {
        "id": "opt4",
        "text": "There is no difference; they are interchangeable aliases introduced in React 18."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "useCallback(fn, deps) is equivalent to useMemo(() => fn, deps). It caches the function instance itself between renders. useMemo(fn, deps) calls fn and caches its return value. Confusing them can lead to unnecessary computations or failing reference-equality checks."
  },
  {
    "skillCode": "react",
    "questionText": "You notice a performance bottleneck in a parent component where updating a frequently changing state causes a heavy child component to re-render unnecessarily. Which strategies effectively mitigate this?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Wrap the child component in React.memo and pass unstable inline callback functions directly."
      },
      {
        "id": "opt2",
        "text": "Lift all state up to the root component so the entire application shares the same state scope."
      },
      {
        "id": "opt3",
        "text": "Wrap the child component in React.memo and ensure passed functions are memoized using useCallback."
      },
      {
        "id": "opt4",
        "text": "Convert the functional component back to a legacy Class component with shouldComponentUpdate."
      }
    ],
    "correctAnswers": [
      "opt3"
    ],
    "explanation": "React.memo prevents re-renders if props are shallowly equal. However, inline functions create new references on every render, breaking memoization. Combining React.memo with useCallback ensures stable prop references. Option 1 fails because inline functions break memoization."
  },
  {
    "skillCode": "react",
    "questionText": "What is the primary benefit of using `useReducer` over `useState` in a React component?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "It automatically persists state to localStorage without additional code."
      },
      {
        "id": "opt2",
        "text": "It handles complex state logic involving multiple sub-values or state transitions dependent on previous states."
      },
      {
        "id": "opt3",
        "text": "It renders components twice as fast by avoiding the virtual DOM diffing phase."
      },
      {
        "id": "opt4",
        "text": "It allows components to bypass parent-child prop drilling automatically."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "useReducer is usually preferable to useState when you have complex state logic that involves multiple sub-values or when the next state depends on the previous one. It centralizes state transition logic into a single reducer function."
  },
  {
    "skillCode": "react",
    "questionText": "When implementing Server-Side Rendering (SSR) with Next.js or React Server Components (RSCs), which of the following statements regarding execution environments are accurate?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "React Server Components can directly access browser APIs like `window` and `localStorage` during the server-side rendering pass."
      },
      {
        "id": "opt2",
        "text": "Client Components execute entirely on the server and never run code in the browser."
      },
      {
        "id": "opt3",
        "text": "React Server Components execute exclusively on the server, keeping large dependencies out of the client-side JavaScript bundle."
      },
      {
        "id": "opt4",
        "text": "State hooks like `useState` and `useEffect` are fully supported inside React Server Components."
      }
    ],
    "correctAnswers": [
      "opt3"
    ],
    "explanation": "React Server Components (RSCs) run only on the server. This allows developers to leverage heavy backend libraries or database drivers without shipping that code to the client bundle. They cannot use browser APIs or state/effect hooks, which are reserved for Client Components."
  },
  {
    "skillCode": "react",
    "questionText": "Consider a custom hook that sets up an event listener inside `useEffect`. Why might referencing a rapidly changing variable or callback inside the effect without including it in the dependency array lead to stale closure bugs?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Because React garbage collects closures that do not match the current render phase."
      },
      {
        "id": "opt2",
        "text": "Because the effect function captures the variable's value from the initial render scope, failing to see updates on subsequent renders unless listed as a dependency."
      },
      {
        "id": "opt3",
        "text": "Because omitting dependencies automatically triggers an infinite render loop in React 18."
      },
      {
        "id": "opt4",
        "text": "Because event listeners cannot access variables defined outside their callback scope in JavaScript."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "A closure 'captures' the variables from the lexical scope in which it was created. If an effect doesn't re-run when a variable changes (because it's missing from the dependency array), the event listener callback retains the old, stale value from the render when the effect was first set up."
  },
  {
    "skillCode": "react",
    "questionText": "How does React 18's Concurrent Rendering model and features like `useTransition` or `useDeferredValue` improve user experience?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "By executing all JavaScript tasks in a single synchronous thread, preventing multi-threading race conditions."
      },
      {
        "id": "opt2",
        "text": "By allowing React to interrupt, pause, or resume rendering updates so urgent user interactions (like typing) remain responsive while heavy background updates process."
      },
      {
        "id": "opt3",
        "text": "By automatically memoizing all components in the React tree without requiring `React.memo` or `useMemo`."
      },
      {
        "id": "opt4",
        "text": "By replacing the Virtual DOM entirely with direct native OS compiled bindings."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Concurrent Rendering allows React to prepare multiple versions of the UI at the same time. With useTransition, non-urgent state updates can be marked as transitions, allowing React to interrupt them to keep high-priority updates (like input typing or button clicks) smooth and lag-free."
  },
  {
    "skillCode": "nodejs",
    "questionText": "Which of the following functions is typically used in Node.js to read a file asynchronously without blocking the event loop?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "fs.readFileSync()"
      },
      {
        "id": "opt2",
        "text": "fs.readFile()"
      },
      {
        "id": "opt3",
        "text": "fs.openSync()"
      },
      {
        "id": "opt4",
        "text": "fs.readStreamSync()"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "fs.readFile() is the asynchronous method that reads a file and invokes a callback upon completion, preventing the main event loop from blocking. The other methods listed are synchronous (blocking)."
  },
  {
    "skillCode": "nodejs",
    "questionText": "What is the primary role of middleware functions in an Express.js application?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "To compile TypeScript code into JavaScript before execution."
      },
      {
        "id": "opt2",
        "text": "To connect directly to the database layer without using drivers."
      },
      {
        "id": "opt3",
        "text": "To have access to the request and response objects, and invoke the next middleware function in the stack."
      },
      {
        "id": "opt4",
        "text": "To automatically manage server hosting infrastructure and scaling."
      }
    ],
    "correctAnswers": [
      "opt3"
    ],
    "explanation": "Express middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle."
  },
  {
    "skillCode": "nodejs",
    "questionText": "In Node.js, the global 'process' object is an instance of EventEmitter.",
    "type": "true_false",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "True"
      },
      {
        "id": "opt2",
        "text": "False"
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "True. The process object is an instance of EventEmitter, which allows it to emit and listen to events such as 'exit', 'uncaughtException', and 'unhandledRejection'."
  },
  {
    "skillCode": "nodejs",
    "questionText": "Which phase of the Node.js Event Loop handles callbacks for asynchronous I/O operations, such as returned data from fs or network requests?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Timers phase"
      },
      {
        "id": "opt2",
        "text": "Poll phase"
      },
      {
        "id": "opt3",
        "text": "Check phase"
      },
      {
        "id": "opt4",
        "text": "Close callbacks phase"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "The Poll phase retrieves new I/O events; executes I/O callbacks almost all to which are executed under system conditions, and then node will block here when appropriate."
  },
  {
    "skillCode": "nodejs",
    "questionText": "Which of the following statements regarding Node.js Streams are true? (Select all that apply)",
    "type": "multi_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Streams reduce memory consumption when processing large files because data is processed in chunks."
      },
      {
        "id": "opt2",
        "text": "All streams in Node.js are automatically duplex by default."
      },
      {
        "id": "opt3",
        "text": "The .pipe() method can be used to connect a readable stream source to a writable stream destination."
      },
      {
        "id": "opt4",
        "text": "Streams inherit from the EventEmitter class."
      }
    ],
    "correctAnswers": [
      "opt1",
      "opt3",
      "opt4"
    ],
    "explanation": "Streams are EventEmitters (opt4), allow chunk-based processing saving memory (opt1), and use .pipe() to easily chain inputs and outputs (opt3). Option 2 is false because streams can be readable, writable, duplex, or transform, not exclusively duplex."
  },
  {
    "skillCode": "nodejs",
    "questionText": "When designing a RESTful API in Express, which HTTP status code is most appropriate to return upon successfully creating a new resource?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "200 OK"
      },
      {
        "id": "opt2",
        "text": "201 Created"
      },
      {
        "id": "opt3",
        "text": "204 No Content"
      },
      {
        "id": "opt4",
        "text": "302 Found"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "HTTP status code 201 Created indicates that the request has succeeded and has led to the creation of a resource, typically accompanied by a Location header pointing to the new resource."
  },
  {
    "skillCode": "nodejs",
    "questionText": "How does calling setImmediate() compare to setTimeout(fn, 0) within an I/O cycle in the Node.js event loop?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "setTimeout is always executed before setImmediate regardless of the execution context."
      },
      {
        "id": "opt2",
        "text": "setImmediate() is guaranteed to execute before any setTimeout(fn, 0) if both are called from within an I/O callback cycle."
      },
      {
        "id": "opt3",
        "text": "They both execute in the microtask queue alongside process.nextTick."
      },
      {
        "id": "opt4",
        "text": "setImmediate is deprecated in modern Node.js versions in favor of setTimeout."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "When called inside an I/O cycle, setImmediate() callbacks are always executed before setTimeout(fn, 0) because the check phase (where setImmediate runs) comes immediately after the poll phase in the event loop sequence."
  },
  {
    "skillCode": "nodejs",
    "questionText": "What happens if an unhandled error occurs inside a Promise chain and there is no .catch() block attached, and 'unhandledRejection' listener is not defined?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Node.js silently ignores the error and continues execution normally."
      },
      {
        "id": "opt2",
        "text": "Node.js throws a synchronous exception that can be caught by a standard try/catch block."
      },
      {
        "id": "opt3",
        "text": "In modern Node.js versions, it prints an unhandled rejection warning and will eventually crash the process with a non-zero exit code."
      },
      {
        "id": "opt4",
        "text": "The HTTP server automatically sends a 500 status code to the active request."
      }
    ],
    "correctAnswers": [
      "opt3"
    ],
    "explanation": "Unhandled promise rejections print a warning and, in newer Node.js runtimes, result in an unhandledRejection which terminates the process with a non-zero exit code to prevent silent failures."
  },
  {
    "skillCode": "nodejs",
    "questionText": "Which mechanism does Node.js use under the hood to execute non-blocking asynchronous system operations like file system calls or DNS lookups across multi-threads?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "V8 Isolate Threads"
      },
      {
        "id": "opt2",
        "text": "libuv thread pool"
      },
      {
        "id": "opt3",
        "text": "Cluster Module Workers"
      },
      {
        "id": "opt4",
        "text": "Express Application Workers"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Node.js relies on libuv, which maintains a thread pool (defaulting to 4 threads, configurable via UV_THREADPOOL_SIZE) to handle operations that don't have native non-blocking OS support, such as fs and crypto operations."
  },
  {
    "skillCode": "nodejs",
    "questionText": "When implementing backpressure in custom Node.js readable/writable stream pipelines, what does a false return value from the writable.write(chunk) method signify?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "The chunk was corrupted during transmission and must be resent."
      },
      {
        "id": "opt2",
        "text": "The internal highWaterMark has been exceeded, signaling that the readable stream should pause sending data until the 'drain' event fires."
      },
      {
        "id": "opt3",
        "text": "The writable stream has finished and closed permanently."
      },
      {
        "id": "opt4",
        "text": "An unhandled exception occurred in the stream pipeline, triggering an automatic abort."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "If the internal buffer of the writable stream exceeds the highWaterMark limit, write() returns false. This is the core backpressure signal indicating that the producer should pause until the 'drain' event is emitted."
  },
  {
    "skillCode": "python",
    "questionText": "What is the primary difference between a list and a tuple in Python?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "Lists are immutable, while tuples are mutable."
      },
      {
        "id": "opt2",
        "text": "Lists are mutable, while tuples are immutable."
      },
      {
        "id": "opt3",
        "text": "Lists can only store integers, while tuples can store any data type."
      },
      {
        "id": "opt4",
        "text": "Tuples cannot be indexed or sliced, whereas lists can."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Lists in Python are mutable (their elements can be modified, added, or removed after creation), whereas tuples are immutable (once created, their elements cannot be changed). Both can store mixed data types and support indexing and slicing."
  },
  {
    "skillCode": "python",
    "questionText": "Which of the following built-in data structures are unordered collections of unique elements? (Select all that apply)",
    "type": "multi_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "list"
      },
      {
        "id": "opt2",
        "text": "set"
      },
      {
        "id": "opt3",
        "text": "dict"
      },
      {
        "id": "opt4",
        "text": "frozenset"
      }
    ],
    "correctAnswers": [
      "opt2",
      "opt4"
    ],
    "explanation": "Sets and frozensets are unordered collections designed to store unique elements. Lists are ordered and allow duplicates. Standard dictionaries store key-value pairs (keys must be unique, but keys themselves form a view, though dictionaries are primarily mappings rather than simple collections of unique elements)."
  },
  {
    "skillCode": "python",
    "questionText": "In Python, string objects are immutable.",
    "type": "true_false",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "True"
      },
      {
        "id": "opt2",
        "text": "False"
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "Strings in Python are immutable. Any operation that appears to modify a string actually creates and returns a new string object in memory."
  },
  {
    "skillCode": "python",
    "questionText": "What will be the output of the following code snippet?\n\n```python\ndef add_to_list(element, target_list=[])\n    target_list.append(element)\n    return target_list\n\nprint(add_to_list(1))\nprint(add_to_list(2))\n```",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "[1] and [2]"
      },
      {
        "id": "opt2",
        "text": "[1] and [1, 2]"
      },
      {
        "id": "opt3",
        "text": "TypeError: default argument mutable"
      },
      {
        "id": "opt4",
        "text": "[1, 2] and [1, 2]"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Default arguments in Python are evaluated once when the function is defined, not each time it is called. Therefore, `target_list` retains its state across multiple calls. The first call returns `[1]`, and the second call appends `2` to the same list, returning `[1, 2]`."
  },
  {
    "skillCode": "python",
    "questionText": "How does the `__slots__` attribute optimize memory usage in a Python class?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "It compresses bytecode execution inside methods."
      },
      {
        "id": "opt2",
        "text": "It prevents the creation of a per-instance `__dict__`, storing attributes in a fixed-size array instead."
      },
      {
        "id": "opt3",
        "text": "It forces all attributes to be private, avoiding dynamic lookup overhead."
      },
      {
        "id": "opt4",
        "text": "It garbage-collects inactive methods automatically."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "By default, Python instances use a dictionary (`__dict__`) to store instance attributes, which has overhead. Defining `__slots__` tells Python to use a fixed allocation structure, disabling `__dict__` and significantly reducing memory consumption for classes with many instances."
  },
  {
    "skillCode": "python",
    "questionText": "Which of the following describes the behavior of a generator function using the `yield` keyword?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "It pauses execution, saves its local state, and returns a value to the caller, resuming from the same point on the next call."
      },
      {
        "id": "opt2",
        "text": "It terminates execution permanently and flushes all local variables to disk."
      },
      {
        "id": "opt3",
        "text": "It spawns a new OS thread to execute the code concurrently."
      },
      {
        "id": "opt4",
        "text": "It caches all computed values in memory to avoid recalculation."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "A generator function uses `yield` to return values lazily. When `yield` is encountered, the function's execution state is suspended and saved, allowing it to pick up right where it left off during the next `__next__()` call."
  },
  {
    "skillCode": "python",
    "questionText": "What is the purpose of the `functools.lru_cache` decorator?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "To lock functions for safe concurrent execution across threads."
      },
      {
        "id": "opt2",
        "text": "To memoize function results based on arguments, improving performance for repeated calls with identical inputs."
      },
      {
        "id": "opt3",
        "text": "To restrict function execution to local resources only."
      },
      {
        "id": "opt4",
        "text": "To automatically convert synchronous functions into asynchronous coroutines."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "`functools.lru_cache` implements a Least Recently Used cache strategy, memoizing the return values of a function so that subsequent calls with the same arguments return cached results instantly."
  },
  {
    "skillCode": "python",
    "questionText": "How does Method Resolution Order (MRO) in Python handle multiple inheritance, and what algorithm does it use?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Depth-first search (DFS) with backtracking."
      },
      {
        "id": "opt2",
        "text": "Breadth-first search (BFS) across all base classes."
      },
      {
        "id": "opt3",
        "text": "C3 Linearization algorithm, ensuring monotonicity and precedence preservation."
      },
      {
        "id": "opt4",
        "text": "Alphabetical sorting of class names."
      }
    ],
    "correctAnswers": [
      "opt3"
    ],
    "explanation": "Python uses the C3 Linearization algorithm (also known as the MRO algorithm) to determine the order in which base classes are searched. It guarantees properties such as children preceding parents and preservation of monotonic inheritance graphs."
  },
  {
    "skillCode": "python",
    "questionText": "What is the primary function of a metaclass in Python?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "To create and customize class objects, acting as a 'class of a class'."
      },
      {
        "id": "opt2",
        "text": "To handle exception propagation across package boundaries."
      },
      {
        "id": "opt3",
        "text": "To optimize runtime type-checking for static analysis tools like mypy."
      },
      {
        "id": "opt4",
        "text": "To define private attributes within standard instances."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "Just as a class defines how an instance behaves, a metaclass defines how a class behaves. Classes are instances of metaclasses (default is `type`), allowing developers to intercept and modify class creation."
  },
  {
    "skillCode": "python",
    "questionText": "When writing a context manager using the `contextlib.contextmanager` decorator, what happens if an exception occurs inside the `with` block?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "The exception is silently ignored and swallowed by the generator."
      },
      {
        "id": "opt2",
        "text": "The exception is raised into the generator at the point of the `yield` statement, allowing cleanup code to run in a `try...finally` block."
      },
      {
        "id": "opt3",
        "text": "The generator immediately terminates without executing any code after `yield`."
      },
      {
        "id": "opt4",
        "text": "Python converts the exception into a standard warning and continues execution."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "When an exception occurs inside the `with` block, Python raises that exception back into the generator at the `yield` line. Using a `try...finally` block around `yield` ensures that critical cleanup (like closing files or DB connections) always executes."
  },
  {
    "skillCode": "sys-design",
    "questionText": "What is the primary difference between horizontal scaling and vertical scaling?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "Horizontal scaling adds more CPU/RAM to a single machine, while vertical scaling adds more machines to a cluster."
      },
      {
        "id": "opt2",
        "text": "Horizontal scaling adds more machines to a cluster, while vertical scaling adds more CPU/RAM to a single machine."
      },
      {
        "id": "opt3",
        "text": "Horizontal scaling is used only for databases, while vertical scaling is used only for web servers."
      },
      {
        "id": "opt4",
        "text": "Horizontal scaling involves migrating to the cloud, while vertical scaling involves on-premise hardware."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Horizontal scaling (scaling out) means adding more servers to handle increased load, whereas vertical scaling (scaling up) means upgrading the resources (CPU, RAM, storage) of an existing server. Vertical scaling has a physical hardware limit, while horizontal scaling is theoretically limitless."
  },
  {
    "skillCode": "sys-design",
    "questionText": "Which of the following best describes a content delivery network (CDN)?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "A centralized database cluster used for long-term data archival."
      },
      {
        "id": "opt2",
        "text": "A globally distributed network of proxy servers that cache content close to end users."
      },
      {
        "id": "opt3",
        "text": "A secure protocol for transferring encrypted files across private subnets."
      },
      {
        "id": "opt4",
        "text": "A load balancer algorithm that distributes traffic based on packet size."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "A CDN caches static assets (images, videos, stylesheets, JS files) at edge locations distributed globally. This reduces latency by serving content from a location physically closer to the user."
  },
  {
    "skillCode": "sys-design",
    "questionText": "Caching frequently accessed read-only data in memory can significantly reduce database load.",
    "type": "true_false",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "True"
      },
      {
        "id": "opt2",
        "text": "False"
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "Caching stores hot data in fast in-memory stores like Redis or Memcached, reducing the number of expensive disk reads and queries hitting the primary database."
  },
  {
    "skillCode": "sys-design",
    "questionText": "When implementing a caching layer using a Cache-Aside (Lazy Loading) pattern, what happens on a cache miss?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "The application queries the database, retrieves the data, returns it to the client, and populates the cache for subsequent requests."
      },
      {
        "id": "opt2",
        "text": "The database automatically updates the cache before responding to the application."
      },
      {
        "id": "opt3",
        "text": "The application throws an error and fails the user request."
      },
      {
        "id": "opt4",
        "text": "The cache layer blocks all incoming requests until data is refilled by a background worker."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "In the Cache-Aside pattern, the application first checks the cache. On a miss, the application is responsible for fetching data directly from the database, returning it to the caller, and updating the cache asynchronously or synchronously so future reads hit the cache."
  },
  {
    "skillCode": "sys-design",
    "questionText": "Which scenarios are primary use cases for utilizing a message queue (e.g., RabbitMQ, Apache Kafka) in a distributed architecture? (Select all that apply)",
    "type": "multi_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Decoupling microservices so they do not depend on each other's immediate availability."
      },
      {
        "id": "opt2",
        "text": "Handling traffic spikes through asynchronous task buffering and load leveling."
      },
      {
        "id": "opt3",
        "text": "Executing real-time, synchronous database transactions across multiple independent datacenters with zero latency."
      },
      {
        "id": "opt4",
        "text": "Enabling event-driven architectures where multiple consumers can process the same message independently."
      }
    ],
    "correctAnswers": [
      "opt1",
      "opt2",
      "opt4"
    ],
    "explanation": "Message queues provide asynchronous communication, decoupling services, and buffering spikes (load leveling). They do not provide synchronous, zero-latency distributed transactions (which typically require consensus protocols like Two-Phase Commit or Paxos/Raft)."
  },
  {
    "skillCode": "sys-design",
    "questionText": "Which load balancing algorithm directs incoming requests to the server with the fewest active connections at that moment?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Round Robin"
      },
      {
        "id": "opt2",
        "text": "IP Hash"
      },
      {
        "id": "opt3",
        "text": "Least Connections"
      },
      {
        "id": "opt4",
        "text": "Weighted Random"
      }
    ],
    "correctAnswers": [
      "opt3"
    ],
    "explanation": "The 'Least Connections' dynamic load balancing algorithm tracks active connections and routes new requests to the backend server currently handling the fewest open connections, making it ideal for servers handling requests of varying durations."
  },
  {
    "skillCode": "sys-design",
    "questionText": "What is the primary purpose of database sharding in a high-scale system?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "To create real-time synchronous backups for disaster recovery."
      },
      {
        "id": "opt2",
        "text": "To horizontally partition data across multiple database instances to bypass single-node storage and throughput limits."
      },
      {
        "id": "opt3",
        "text": "To automatically convert unstructured JSON data into relational tables."
      },
      {
        "id": "opt4",
        "text": "To encrypt sensitive columns at rest using distributed keys."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Database sharding is a horizontal partitioning strategy where rows of a large table are split across multiple database servers (shards), enabling scale-out for write and storage bottlenecks that a single node cannot handle."
  },
  {
    "skillCode": "sys-design",
    "questionText": "According to the CAP Theorem, in the presence of a network partition, a distributed data store can choose to guarantee which two properties?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Consistency and Availability (CA)"
      },
      {
        "id": "opt2",
        "text": "Consistency and Partition Tolerance (CP)"
      },
      {
        "id": "opt3",
        "text": "Scalability and Availability (SA)"
      },
      {
        "id": "opt4",
        "text": "Durability and Consistency (DC)"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Network partitions are a reality in distributed systems and cannot be avoided (P is mandatory). Therefore, systems must choose between Consistency (every read receives the most recent write or an error) and Availability (every non-failing node returns a non-error response, without guaranteeing it contains the latest write)."
  },
  {
    "skillCode": "sys-design",
    "questionText": "In distributed systems, what is the 'Thundering Herd' problem and how can it be mitigated?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "A surge of incoming HTTP requests caused by DDoS attacks, mitigated by rate limiting."
      },
      {
        "id": "opt2",
        "text": "A situation where a cached item expires and numerous concurrent requests hit the database simultaneously; mitigated by cache locking or probabilistic early expiration."
      },
      {
        "id": "opt3",
        "text": "When database replicas fall out of sync due to high network latency, mitigated by quorum reads."
      },
      {
        "id": "opt4",
        "text": "When background workers process duplicate queue messages, mitigated by idempotency keys."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "The Thundering Herd problem occurs when a heavily requested cache key expires, causing thousands of threads/processes to simultaneously realize the cache miss and bombard the underlying database. It is mitigated using mutex locks (single flight pattern) or calculating random expiration offsets."
  },
  {
    "skillCode": "sys-design",
    "questionText": "When designing a globally distributed system with multi-region active-active writes, what is the main trade-off introduced by eventual consistency models?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Increased latency for local read operations."
      },
      {
        "id": "opt2",
        "text": "Risk of read anomalies, stale reads, and conflicting concurrent writes requiring conflict resolution strategies."
      },
      {
        "id": "opt3",
        "text": "Complete inability to scale horizontally across regions."
      },
      {
        "id": "opt4",
        "text": "Elimination of fault tolerance during network partitions."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Multi-region active-active setups with eventual consistency allow low-latency writes globally, but introduce challenges like data replication lag, stale reads, and write conflicts (e.g., Last-Write-Wins, CRDTs, or vector clocks) when the same record is modified concurrently in two different regions."
  },
  {
    "skillCode": "sql-db",
    "questionText": "Which SQL clause is used to filter rows after a GROUP BY aggregation has been applied?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "WHERE"
      },
      {
        "id": "opt2",
        "text": "HAVING"
      },
      {
        "id": "opt3",
        "text": "FILTER"
      },
      {
        "id": "opt4",
        "text": "LIMIT"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "The WHERE clause filters rows before aggregation occurs, whereas the HAVING clause is specifically designed to filter groups after the GROUP BY aggregation has been calculated."
  },
  {
    "skillCode": "sql-db",
    "questionText": "In a relational database, what is the primary purpose of a Foreign Key?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "To uniquely identify every row in a table."
      },
      {
        "id": "opt2",
        "text": "To enforce referential integrity between two tables."
      },
      {
        "id": "opt3",
        "text": "To automatically index search columns for faster retrieval."
      },
      {
        "id": "opt4",
        "text": "To encrypt sensitive column values during insertion."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "A Foreign Key establishes a relationship between two tables by referencing the Primary Key of another table, thereby enforcing referential integrity so orphaned records cannot exist."
  },
  {
    "skillCode": "sql-db",
    "questionText": "Which normal form (NF) requires that a table is in 2NF and has no transitive dependencies (i.e., non-key attributes depend only on the primary key)?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "First Normal Form (1NF)"
      },
      {
        "id": "opt2",
        "text": "Second Normal Form (2NF)"
      },
      {
        "id": "opt3",
        "text": "Third Normal Form (3NF)"
      },
      {
        "id": "opt4",
        "text": "Boyce-Codd Normal Form (BCNF)"
      }
    ],
    "correctAnswers": [
      "opt3"
    ],
    "explanation": "Third Normal Form (3NF) requires 2NF compliance and the elimination of transitive dependencies, meaning non-prime attributes must depend solely on the candidate keys directly, not through another non-key attribute."
  },
  {
    "skillCode": "sql-db",
    "questionText": "Which of the following statements about database indexes are true? (Select all that apply)",
    "type": "multi_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Indexes can significantly speed up SELECT query execution by avoiding full table scans."
      },
      {
        "id": "opt2",
        "text": "Indexes speed up INSERT, UPDATE, and DELETE operations because the database engine does not need to maintain the index tree."
      },
      {
        "id": "opt3",
        "text": "B-Tree indexes are effective for range queries (e.g., WHERE age BETWEEN 20 AND 30)."
      },
      {
        "id": "opt4",
        "text": "Creating an index on every single column always improves overall system performance."
      }
    ],
    "correctAnswers": [
      "opt1",
      "opt3"
    ],
    "explanation": "Indexes accelerate reads (SELECT) and support range queries via structures like B-Trees. However, they slow down write operations (INSERT, UPDATE, DELETE) because the index structures must also be updated, and creating an index on every column wastes storage and severely degrades write performance."
  },
  {
    "skillCode": "sql-db",
    "questionText": "What does the 'I' stand for in ACID properties, and what does it guarantee?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Isolation: Ensures that concurrent transactions execute as if they were running sequentially, preventing unintended data interference."
      },
      {
        "id": "opt2",
        "text": "Integrity: Ensures that foreign key constraints are never violated during execution."
      },
      {
        "id": "opt3",
        "text": "Idempotency: Ensures that running the same transaction multiple times produces the exact same state."
      },
      {
        "id": "opt4",
        "text": "Immutability: Ensures that historical data records can never be modified or deleted."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "Isolation guarantees that concurrent transactions do not expose intermediate, uncommitted states to other transactions, maintaining consistency depending on the chosen isolation level."
  },
  {
    "skillCode": "sql-db",
    "questionText": "In the context of query optimization, what does a 'Sequential Scan' (or Full Table Scan) typically indicate when executed on a large table with millions of rows?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "The query optimizer is utilizing the clustered index efficiently."
      },
      {
        "id": "opt2",
        "text": "The query lacks a usable index on the filter columns, forcing the database to inspect every single row."
      },
      {
        "id": "opt3",
        "text": "The database is currently performing a checkpoint write operation."
      },
      {
        "id": "opt4",
        "text": "The isolation level is set toSerializable."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "A sequential scan reads every row from disk or memory sequentially. On large tables, this usually means an appropriate index is missing or the query predicate prevents index utilization (e.g., using functions on columns)."
  },
  {
    "skillCode": "sql-db",
    "questionText": "Consider two tables: `Customers` and `Orders`. You want to retrieve a list of all customers, along with their order IDs if they have placed any. If a customer has no orders, their order ID should appear as NULL. Which join operation should you use?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "INNER JOIN"
      },
      {
        "id": "opt2",
        "text": "LEFT JOIN (or LEFT OUTER JOIN)"
      },
      {
        "id": "opt3",
        "text": "RIGHT JOIN"
      },
      {
        "id": "opt4",
        "text": "FULL OUTER JOIN"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "A LEFT JOIN returns all records from the left table (Customers), and the matched records from the right table (Orders). If there is no match, the result is NULL on the right side."
  },
  {
    "skillCode": "sql-db",
    "questionText": "In MVCC (Multi-Version Concurrency Control) databases, readers block writers and writers block readers under standard snapshot isolation.",
    "type": "true_false",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "True"
      },
      {
        "id": "opt2",
        "text": "False"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "False. One of the primary advantages of MVCC is that readers do not block writers and writers do not block readers. Readers access a consistent snapshot of the data, while writers create new versions, allowing high concurrency."
  },
  {
    "skillCode": "sql-db",
    "questionText": "Which transaction isolation level prevents 'Non-Repeatable Reads' but is still susceptible to 'Phantom Reads'?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Read Uncommitted"
      },
      {
        "id": "opt2",
        "text": "Read Committed"
      },
      {
        "id": "opt3",
        "text": "Repeatable Read"
      },
      {
        "id": "opt4",
        "text": "Serializable"
      }
    ],
    "correctAnswers": [
      "opt3"
    ],
    "explanation": "Repeatable Read ensures that any data read cannot be changed by other transactions (preventing non-repeatable reads), but newly inserted rows matching a range query by other transactions can still appear, which are known as phantom reads."
  },
  {
    "skillCode": "sql-db",
    "questionText": "When analyzing an execution plan, you notice a 'Nested Loop' join being used on two massive tables (each with 10 million rows) without an index on the join condition column of the inner table. What is the expected performance impact?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Optimal performance, because Nested Loops are always the fastest join strategy."
      },
      {
        "id": "opt2",
        "text": "Catastrophic performance degradation, resulting in O(N × M) complexity and high disk/CPU overhead."
      },
      {
        "id": "opt3",
        "text": "The query optimizer will automatically convert it to a Hash Join without any performance penalty."
      },
      {
        "id": "opt4",
        "text": "The database will throw a compilation error due to missing statistics."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "A Nested Loop join without an inner index forces a full scan of the inner table for every single row of the outer table, resulting in O(N × M) time complexity, which causes severe performance degradation on large datasets."
  },
  {
    "skillCode": "adv-sql",
    "questionText": "Which SQL clause is used to filter results *after* aggregate functions and grouping have been applied?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "WHERE"
      },
      {
        "id": "opt2",
        "text": "HAVING"
      },
      {
        "id": "opt3",
        "text": "FILTER"
      },
      {
        "id": "opt4",
        "text": "GROUP BY"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "The HAVING clause is evaluated after the GROUP BY clause and allows filtering on aggregated values, whereas WHERE filters rows before aggregation."
  },
  {
    "skillCode": "adv-sql",
    "questionText": "What is the primary purpose of a Common Table Expression (CTE) defined using the WITH clause?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "To permanently store a query result set on disk like a materialized view."
      },
      {
        "id": "opt2",
        "text": "To improve query readability and create temporary, named result sets scoped to a single statement execution."
      },
      {
        "id": "opt3",
        "text": "To automatically create indexes on unindexed tables."
      },
      {
        "id": "opt4",
        "text": "To bypass the need for JOIN conditions in complex multi-table queries."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "CTEs provide a way to write cleaner, modular code by defining a temporary result set that exists only for the duration of the query. They do not permanently store data."
  },
  {
    "skillCode": "adv-sql",
    "questionText": "In SQL, standard aggregate functions (like SUM, AVG, COUNT) automatically ignore NULL values in the target column.",
    "type": "true_false",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "True"
      },
      {
        "id": "opt2",
        "text": "False"
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "True. Standard SQL aggregate functions ignore NULL values, except for COUNT(*) which counts total rows regardless of NULLs."
  },
  {
    "skillCode": "adv-sql",
    "questionText": "Which window function allows you to access data from a previous row in the same result set without using a self-join?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "LEAD()"
      },
      {
        "id": "opt2",
        "text": "LAG()"
      },
      {
        "id": "opt3",
        "text": "PREVIOUS()"
      },
      {
        "id": "opt4",
        "text": "BACK()"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "The LAG() window function accesses a row at a given physical offset that comes before the current row. LEAD() does the opposite for subsequent rows."
  },
  {
    "skillCode": "adv-sql",
    "questionText": "Consider a query with a CTE that is referenced multiple times in the main query block. How do modern relational database optimizers typically handle execution in standard SQL engines (like PostgreSQL)?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "They always materialize the CTE once into a temporary table and reuse it."
      },
      {
        "id": "opt2",
        "text": "They inline the CTE query definition into every reference point, though some databases support materialization hints."
      },
      {
        "id": "opt3",
        "text": "They throw a compilation error because CTEs cannot be referenced more than once."
      },
      {
        "id": "opt4",
        "text": "They convert the CTE automatically into an index-organized table."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Historically, CTEs acted as optimization fences (materializing results), but modern optimizers (like PostgreSQL 12+) inline CTEs by default unless they are marked MATERIALIZED or contain side effects."
  },
  {
    "skillCode": "adv-sql",
    "questionText": "What is the key difference in behavior between RANK() and DENSE_RANK() window functions when there is a tie?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "RANK() leaves gaps in ranking numbers after ties, while DENSE_RANK() does not leave gaps."
      },
      {
        "id": "opt2",
        "text": "DENSE_RANK() leaves gaps in ranking numbers, while RANK() does not."
      },
      {
        "id": "opt3",
        "text": "RANK() only works with descending order, whereas DENSE_RANK() works with ascending order."
      },
      {
        "id": "opt4",
        "text": "There is no difference; they are synonyms for each other."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "RANK() assigns the same rank to ties and skips subsequent numbers (e.g., 1, 2, 2, 4). DENSE_RANK() assigns consecutive ranks without gaps (e.g., 1, 2, 2, 3)."
  },
  {
    "skillCode": "adv-sql",
    "questionText": "When analyzing query performance using an execution plan, which of the following operations generally indicates a high-cost execution path for large datasets?",
    "type": "multi_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Sequential Scan / Full Table Scan"
      },
      {
        "id": "opt2",
        "text": "Index Seek / Index Lookup"
      },
      {
        "id": "opt3",
        "text": "Nested Loop Join on unindexed large tables"
      },
      {
        "id": "opt4",
        "text": "Hash Join with spill to disk (temp storage)"
      }
    ],
    "correctAnswers": [
      "opt1",
      "opt3",
      "opt4"
    ],
    "explanation": "Full table scans (for selective queries), nested loops on unindexed large tables, and hash joins that exceed memory and spill to disk are major indicators of poor query performance. Index seeks are typically efficient."
  },
  {
    "skillCode": "adv-sql",
    "questionText": "You need to write a recursive CTE to traverse an organizational hierarchy (manager-employee relationship). Which component is mandatory in a recursive CTE structure?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "An anchor member combined with a recursive member using UNION or UNION ALL."
      },
      {
        "id": "opt2",
        "text": "An explicit COMMIT statement after each recursive iteration."
      },
      {
        "id": "opt3",
        "text": "A materialized index hint on the recursive table reference."
      },
      {
        "id": "opt4",
        "text": "A mandatory GROUP BY clause in the recursive member."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "A recursive CTE requires an anchor member (base query that returns the initial seed rows) and a recursive member (joined to the working table), combined via UNION or UNION ALL."
  },
  {
    "skillCode": "adv-sql",
    "questionText": "What does a Window Frame clause (e.g., 'ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW') default to when an ORDER BY clause is specified inside the OVER() clause, but no explicit frame is provided?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING"
      },
      {
        "id": "opt2",
        "text": "ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW"
      },
      {
        "id": "opt3",
        "text": "RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW"
      },
      {
        "id": "opt4",
        "text": "ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "If ORDER BY is specified without an explicit frame clause, the default window frame is 'RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW' in standard SQL (though some functions default to UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING when ORDER BY is omitted)."
  },
  {
    "skillCode": "adv-sql",
    "questionText": "Which query optimization technique involves partitioning a very large table into smaller physical pieces, allowing the query optimizer to completely skip scanning partitions that do not match the WHERE clause criteria?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Query folding"
      },
      {
        "id": "opt2",
        "text": "Partition pruning (Partition elimination)"
      },
      {
        "id": "opt3",
        "text": "Index intersection"
      },
      {
        "id": "opt4",
        "text": "Materialized view rewriting"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Partition pruning is the optimization technique where the database engine analyzes the WHERE clause and excludes irrelevant partitions from the query execution plan entirely, drastically reducing I/O."
  },
  {
    "skillCode": "data-vis",
    "questionText": "When designing a dashboard for executive leadership who need to track monthly revenue against a target, which chart type is generally the most effective and space-efficient choice?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "Pie chart with 12 slices for each month"
      },
      {
        "id": "opt2",
        "text": "Bullet graph or KPI card with trend line"
      },
      {
        "id": "opt3",
        "text": "3D stacked bar chart"
      },
      {
        "id": "opt4",
        "text": "Network diagram"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Bullet graphs and KPI cards are specifically designed for executive dashboards to show actual performance versus a target cleanly and compactly. Pie charts with many slices are hard to read, 3D charts distort data, and network diagrams are meant for relational data, not KPI tracking."
  },
  {
    "skillCode": "data-vis",
    "questionText": "Which of the following is a recommended best practice when using color in an executive dashboard?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "Use a rainbow color palette to make every category distinct and vibrant."
      },
      {
        "id": "opt2",
        "text": "Use a neutral gray palette for background elements and a single accent color (like bold blue or red) to draw attention to key insights."
      },
      {
        "id": "opt3",
        "text": "Change the color scheme on every page to keep users engaged."
      },
      {
        "id": "opt4",
        "text": "Always use bright red and green for all categorical data comparisons."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Using a neutral palette with a single accent color (often called 'intentional color' or 'alert coloring') guides the user's eye to important metrics without causing visual fatigue. Rainbow palettes create false visual hierarchy, inconsistent palettes disorient users, and red/green should be avoided for general categories due to color blindness and emotional connotation."
  },
  {
    "skillCode": "data-vis",
    "questionText": "True or False: Dual-axis charts are universally praised in data storytelling because they allow users to easily compare two different measures with completely different scales without any risk of misinterpretation.",
    "type": "true_false",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "True"
      },
      {
        "id": "opt2",
        "text": "False"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Dual-axis charts are frequently criticized in data visualization because they can easily mislead the audience by manipulating the alignment of the axes, creating false correlations where none exist. Alternatives like small multiples are usually preferred."
  },
  {
    "skillCode": "data-vis",
    "questionText": "In Power BI, when you want to filter multiple visuals across a page using a selection from a primary visual, but you want to prevent one specific KPI card from changing, which feature should you configure?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Edit interactions"
      },
      {
        "id": "opt2",
        "text": "Row-Level Security (RLS)"
      },
      {
        "id": "opt3",
        "text": "DAX calculated table"
      },
      {
        "id": "opt4",
        "text": "Sync slicers"
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "'Edit interactions' in Power BI allows you to control how visual selections impact other visuals on the canvas, enabling you to set cross-filtering to 'none' for specific cards. RLS is for security, calculated tables are for data modeling, and sync slicers synchronize slicer states across different pages."
  },
  {
    "skillCode": "data-vis",
    "questionText": "When building a Tableau dashboard intended for global stakeholders, which design choices should you incorporate to ensure accessibility and clear communication? (Select all that apply)",
    "type": "multi_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Select color palettes that are accessible for color-blind users (e.g., avoiding red-green combinations alone)."
      },
      {
        "id": "opt2",
        "text": "Design using fixed pixel widths that fit your personal monitor perfectly."
      },
      {
        "id": "opt3",
        "text": "Use direct labeling on lines and bars instead of relying entirely on complex legends."
      },
      {
        "id": "opt4",
        "text": "Format numbers consistently and localize date formats based on regional expectations."
      }
    ],
    "correctAnswers": [
      "opt1",
      "opt3",
      "opt4"
    ],
    "explanation": "Accessibility and global design require color-blind safe palettes, direct labels to reduce cognitive load and eye movement, and localized/consistent formatting. Fixed pixel sizing tailored to only one monitor is a poor practice because dashboards should be responsive or sized for standard stakeholder screen resolutions."
  },
  {
    "skillCode": "data-vis",
    "questionText": "In Recharts (a React charting library), which component is critical for wrapping multiple chart elements like lines and bars, ensuring they share the same scaled coordinate system based on the provided dataset?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "<ResponsiveContainer>"
      },
      {
        "id": "opt2",
        "text": "<CartesianGrid>"
      },
      {
        "id": "opt3",
        "text": "<LineChart>"
      },
      {
        "id": "opt4",
        "text": "<Tooltip>"
      }
    ],
    "correctAnswers": [
      "opt3"
    ],
    "explanation": "Chart containers like `<LineChart>` or `<BarChart>` establish the Cartesian coordinate system and ingest the data array, passing down the scale contexts to children like `<Line>` or `<Bar>`. `<ResponsiveContainer>` handles resizing, `<CartesianGrid>` draws background grid lines, and `<Tooltip>` manages hover interactions."
  },
  {
    "skillCode": "data-vis",
    "questionText": "You are tasked with showing the contribution of 5 different product sub-categories to total profit, while also showing how profit has trended over the last 8 quarters. Which architectural layout follows best practices for executive storytelling?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Place the 8-quarter trend at the top left (prime scanning real estate) as a line chart, followed by a bar chart of sub-categories below or beside it."
      },
      {
        "id": "opt2",
        "text": "Combine both metrics into a single 3D pie chart with rotating slices."
      },
      {
        "id": "opt3",
        "text": "Hide both charts inside tooltips so the dashboard appears completely empty until hovered."
      },
      {
        "id": "opt4",
        "text": "Place a massive data table with 500 rows at the very top and put the charts at the bottom footer."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "Placing primary trend information and categorical breakdowns using standard chart types (line and bar) in the primary visual hierarchy (top-left Z-pattern reading flow) optimizes executive consumption. 3D pie charts, hidden data, and raw tables at the top violate dashboard usability standards."
  },
  {
    "skillCode": "data-vis",
    "questionText": "When optimizing a complex Tableau dashboard that suffers from slow rendering performance due to numerous custom calculations and filters, which approach is most effective?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Add more transparent floating containers and high-resolution background images."
      },
      {
        "id": "opt2",
        "text": "Use Tableau's Performance Recorder, reduce the number of context filters, materialize slow calculated fields in the data source layer, and simplify messy dashboard layouts."
      },
      {
        "id": "opt3",
        "text": "Convert all dimensions into continuous strings and increase the number of worksheets on a single dashboard tab to over 30."
      },
      {
        "id": "opt4",
        "text": "Disable data extracts and rely exclusively on live live-connection custom SQL with complex subqueries."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Performance optimization in Tableau involves profiling with the Performance Recorder, minimizing heavy context filters which recreate temp tables, pushing calculations back to the database or data source, and reducing layout complexity. Adding floating containers, excessive worksheets, or live unoptimized custom SQL worsens performance."
  },
  {
    "skillCode": "data-vis",
    "questionText": "In advanced Power BI reporting using DAX, when should you choose to write a Calculated Column versus a Measure for visual performance and data storytelling?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Always use calculated columns for every metric because they compute faster inside visuals."
      },
      {
        "id": "opt2",
        "text": "Use calculated columns when you need values evaluated row-by-row for slicing, grouping, or filtering (e.g., creating age brackets), and use measures for aggregate calculations that respond dynamically to filter context."
      },
      {
        "id": "opt3",
        "text": "Use measures exclusively when you want to permanently store values in the VertiPaq database storage."
      },
      {
        "id": "opt4",
        "text": "There is no performance difference; columns and measures are interchangeable in DAX."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Calculated columns compute values row-by-row during data refresh and consume RAM in the VertiPaq engine, making them ideal for slicing/grouping dimensions. Measures are calculated on-the-fly in response to user filter selections, making them efficient for aggregations without inflating storage size."
  },
  {
    "skillCode": "data-vis",
    "questionText": "When implementing custom interactive data applications in React using Recharts, how do you architect drill-down behavior where clicking a category bar updates the dataset to show sub-categories?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Modify the DOM directly using document.getElementById().style to hide elements."
      },
      {
        "id": "opt2",
        "text": "Manage active drill-down state in React component hooks (e.g., useState), attach an onClick handler to the Recharts <Bar> component, and filter the parent dataset state accordingly to re-render the chart."
      },
      {
        "id": "opt3",
        "text": "Reload the entire web browser window using window.location.reload() upon every click."
      },
      {
        "id": "opt4",
        "text": "Rely on CSS media queries to handle drill-down logic automatically."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "In React and Recharts, interactivity is state-driven. By capturing click events on the chart components (like `<Bar onClick={...}>`), updating React state, and passing the filtered dataset back into the chart, you achieve seamless, performant drill-down functionality."
  },
  {
    "skillCode": "eda-pandas",
    "questionText": "Which pandas function is primarily used to get a concise summary of a DataFrame, including the index dtype and column dtypes, non-null values, and memory usage?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "df.describe()"
      },
      {
        "id": "opt2",
        "text": "df.info()"
      },
      {
        "id": "opt3",
        "text": "df.summary()"
      },
      {
        "id": "opt4",
        "text": "df.dtypes"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "df.info() prints information about a DataFrame including the index dtype, column dtypes, non-null values, and memory usage. df.describe() provides descriptive statistics of numerical columns, df.dtypes lists only column data types, and df.summary() is not a standard pandas method."
  },
  {
    "skillCode": "eda-pandas",
    "questionText": "When checking for missing values in a pandas DataFrame named `df`, which combination of methods returns the total count of missing values per column?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "df.isnull().sum()"
      },
      {
        "id": "opt2",
        "text": "df.isna(count=True)"
      },
      {
        "id": "opt3",
        "text": "df.missing()"
      },
      {
        "id": "opt4",
        "text": "df.count(isnull=True)"
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "df.isnull() (or df.isna()) returns a boolean DataFrame indicating missing values. Calling .sum() on this DataFrame aggregates the True values (treated as 1) per column, giving the total count of missing values."
  },
  {
    "skillCode": "eda-pandas",
    "questionText": "In pandas, which parameter of `value_counts()` allows you to obtain relative frequencies (proportions) instead of absolute counts?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "relative=True"
      },
      {
        "id": "opt2",
        "text": "percent=True"
      },
      {
        "id": "opt3",
        "text": "normalize=True"
      },
      {
        "id": "opt4",
        "text": "freq=True"
      }
    ],
    "correctAnswers": [
      "opt3"
    ],
    "explanation": "The normalize=True parameter in value_counts() returns the relative frequencies of the unique values by dividing all counts by the total number of observations."
  },
  {
    "skillCode": "eda-pandas",
    "questionText": "When performing data cleaning on a large dataset in pandas, which strategy is generally most effective for optimizing memory usage of string columns with a limited set of repeated categories?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Convert the columns to object dtype"
      },
      {
        "id": "opt2",
        "text": "Convert the columns to category dtype"
      },
      {
        "id": "opt3",
        "text": "Drop all rows containing strings"
      },
      {
        "id": "opt4",
        "text": "Cast the columns to float64"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Converting columns with low cardinality string data to 'category' dtype significantly reduces memory usage in pandas because it stores the data internally as integer arrays of codes backed by a separate hash table of unique categories."
  },
  {
    "skillCode": "eda-pandas",
    "questionText": "You want to apply a custom aggregation function to multiple columns differently in a grouped pandas DataFrame. Which method should you use?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "df.groupby('col').apply(func)"
      },
      {
        "id": "opt2",
        "text": "df.groupby('col').aggregate({'col1': 'mean', 'col2': 'sum'})"
      },
      {
        "id": "opt3",
        "text": "df.groupby('col').transform(['mean', 'sum'])"
      },
      {
        "id": "opt4",
        "text": "df.groupby('col').map({'col1': 'mean'})"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Passing a dictionary mapping column names to aggregation functions into the aggregate() (or agg()) method allows you to apply different operations to different columns after a groupby operation."
  },
  {
    "skillCode": "eda-pandas",
    "questionText": "Which of the following statements about Polars compared to Pandas are correct? (Select all that apply)",
    "type": "multi_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Polars expressions are lazily evaluated by default in its LazyFrame API, enabling query optimization."
      },
      {
        "id": "opt2",
        "text": "Polars is implemented in Rust, which allows for multi-threaded execution on single nodes."
      },
      {
        "id": "opt3",
        "text": "Polars uses an index-based alignment mechanism similar to pandas Series."
      },
      {
        "id": "opt4",
        "text": "Polars natively uses Apache Arrow memory layout internally."
      }
    ],
    "correctAnswers": [
      "opt1",
      "opt2",
      "opt4"
    ],
    "explanation": "Polars uses Apache Arrow for its internal memory layout, is written in Rust enabling parallel/multi-threaded execution, and supports lazy evaluation for query optimization. Unlike pandas, Polars does NOT use index alignment, which avoids many subtle bugs and performance overheads associated with index matching."
  },
  {
    "skillCode": "eda-pandas",
    "questionText": "When working with time-series exploratory data analysis in pandas, what is the primary purpose of the `resample()` method?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "To change the sampling rate of audio files stored in DataFrame columns"
      },
      {
        "id": "opt2",
        "text": "To convert frequency and perform frequency conversion/time-series binning (e.g., downsampling or upsampling)"
      },
      {
        "id": "opt3",
        "text": "To randomly sample rows from a DataFrame without replacement"
      },
      {
        "id": "opt4",
        "text": "To interpolate missing timestamps using linear regression"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "The resample() method in pandas is a time-based groupby analogous to a group-by operation, used for frequency conversion and time-series binning (e.g., converting minute-level data to hourly data)."
  },
  {
    "skillCode": "eda-pandas",
    "questionText": "In pandas, when performing a merge (join) operation between two DataFrames, setting `validate='one_to_one'` will raise a MergeError if the merge keys are not unique in both left and right datasets.",
    "type": "true_false",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "True"
      },
      {
        "id": "opt2",
        "text": "False"
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "True. The `validate` argument in `pd.merge()` checks if merge keys are unique in specified ways. 'one_to_one' checks if merge keys are unique in both left and right datasets, raising a MergeError if duplicates are found."
  },
  {
    "skillCode": "eda-pandas",
    "questionText": "You are dealing with extreme outliers in a skewed numerical feature during EDA. Which approach is mathematically and statistically robust for handling these values without outright dropping data rows?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Replacing all outliers with the exact mean of the column"
      },
      {
        "id": "opt2",
        "text": "Applying a logarithmic or Box-Cox transformation to reduce skewness and compress the scale of extreme values"
      },
      {
        "id": "opt3",
        "text": "Multiplying the outliers by negative one to invert their direction"
      },
      {
        "id": "opt4",
        "text": "Filling the outlier values with NaN and subsequently dropping all columns in the dataset"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Logarithmic or Box-Cox transformations are standard statistical techniques used during EDA and feature engineering to stabilize variance and normalize heavily skewed distributions, mitigating the undue leverage of extreme outliers."
  },
  {
    "skillCode": "eda-pandas",
    "questionText": "When scaling or normalizing features across groups in a pandas DataFrame (e.g., standardizing values per category), using `.apply()` with a custom scaling function can be significantly slower than vectorizing using `.transform()`. Why is this the case?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": ".transform() executes Python bytecode inside a compiled C loop, whereas .apply() runs purely on GPU hardware."
      },
      {
        "id": "opt2",
        "text": ".transform() returns a DataFrame/Series with the same shape as the original input, allowing optimized broadcasting without Python-level iteration overhead present in .apply()."
      },
      {
        "id": "opt3",
        "text": ".apply() automatically drops missing values, which introduces severe performance bottlenecks."
      },
      {
        "id": "opt4",
        "text": ".transform() disables multi-threading, forcing single-core efficiency."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": ".transform() is optimized to produce a broadcasted output matching the original DataFrame shape, bypassing the high overhead of Python-level function calls per group iteration that occurs with .apply()."
  },
  {
    "skillCode": "bi-modeling",
    "questionText": "What is the primary characteristic of a star schema in dimensional modeling?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "Fact tables are directly surrounded by denormalized dimension tables."
      },
      {
        "id": "opt2",
        "text": "Dimension tables are normalized into multiple sub-tables."
      },
      {
        "id": "opt3",
        "text": "There are no fact tables, only interconnected dimension tables."
      },
      {
        "id": "opt4",
        "text": "Data is stored exclusively in unstructured formats."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "A star schema consists of a central fact table surrounded by denormalized dimension tables. Normalizing dimension tables into sub-tables creates a snowflake schema, while having no fact tables is incorrect for dimensional modeling."
  },
  {
    "skillCode": "bi-modeling",
    "questionText": "In a semantic layer or metrics store, what is an 'additive' metric?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "A metric that cannot be aggregated across any dimension."
      },
      {
        "id": "opt2",
        "text": "A metric that can be summed up across all dimensions in the model."
      },
      {
        "id": "opt3",
        "text": "A metric that only works when added to calculated columns."
      },
      {
        "id": "opt4",
        "text": "A metric that requires continuous string concatenation."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "An additive metric (such as sales amount or quantity sold) can be aggregated (summed) across all dimensions of the schema. Semi-additive metrics can only be summed across certain dimensions (like time), and non-additive metrics cannot be summed at all."
  },
  {
    "skillCode": "bi-modeling",
    "questionText": "True or False: A snowflake schema is a logical extension of a star schema where dimension tables are normalized.",
    "type": "true_false",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "True"
      },
      {
        "id": "opt2",
        "text": "False"
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "True. In a snowflake schema, dimension tables are normalized into multiple related tables to reduce data redundancy, whereas in a star schema, they are kept denormalized in a single flat table per dimension."
  },
  {
    "skillCode": "bi-modeling",
    "questionText": "Which of the following best describes a 'conformed dimension' in enterprise dimensional modeling?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "A dimension that changes dynamically based on user-entered filter criteria at runtime."
      },
      {
        "id": "opt2",
        "text": "A dimension that is shared across multiple fact tables or business processes with the exact same meaning."
      },
      {
        "id": "opt3",
        "text": "A temporary staging table used before loading data into a data warehouse."
      },
      {
        "id": "opt4",
        "text": "A fact table disguised as a dimension to optimize query performance."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "A conformed dimension is identical across multiple fact tables (e.g., a Date or Customer dimension used in both Sales and Support fact tables), enabling enterprise-wide roll-ups and consistent reporting without join discrepancies."
  },
  {
    "skillCode": "bi-modeling",
    "questionText": "When designing a metrics store, you need to handle a semi-additive metric like 'Account Balance'. Across which dimension is this metric typically non-additive?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Customer"
      },
      {
        "id": "opt2",
        "text": "Region"
      },
      {
        "id": "opt3",
        "text": "Time"
      },
      {
        "id": "opt4",
        "text": "Product"
      }
    ],
    "correctAnswers": [
      "opt3"
    ],
    "explanation": "Account balance is semi-additive because you can sum balances across customers or regions at a specific point in time, but you cannot sum balances across time (e.g., adding January's balance to February's balance is meaningless)."
  },
  {
    "skillCode": "bi-modeling",
    "questionText": "Select all scenarios that justify using a 'bridge table' in a semantic BI model:",
    "type": "multi_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Handling many-to-many relationships between dimensions and fact tables (e.g., a patient with multiple diagnoses linked to a medical visit)."
      },
      {
        "id": "opt2",
        "text": "Representing parent-child hierarchies in a flattened format (e.g., an organizational chart)."
      },
      {
        "id": "opt3",
        "text": "Replacing a standard star schema fact table to avoid creating any foreign keys."
      },
      {
        "id": "opt4",
        "text": "Connecting disparate data sources when no primary key exists at all."
      }
    ],
    "correctAnswers": [
      "opt1",
      "opt2"
    ],
    "explanation": "Bridge tables are specifically designed to resolve many-to-many relationships between dimensions and facts, and to manage variable-depth parent-child hierarchies (such as employee-manager structures). They are not used to eliminate foreign keys or bypass primary key requirements."
  },
  {
    "skillCode": "bi-modeling",
    "questionText": "What is a major advantage of centralizing metrics definitions in a headless semantic layer or enterprise metrics store compared to defining them within individual BI tool workbooks?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "It completely removes the need for data warehousing and ETL pipelines."
      },
      {
        "id": "opt2",
        "text": "It guarantees consistent metric calculations and definitions across all downstream reporting tools and applications."
      },
      {
        "id": "opt3",
        "text": "It automatically eliminates the need for security role-playing dimensions."
      },
      {
        "id": "opt4",
        "text": "It forces all data to be stored exclusively in a single flattened text file."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "A centralized metrics store ensures a single source of truth, preventing discrepancies where different BI tools or teams define business logic (like 'Active User' or 'Net Revenue') differently."
  },
  {
    "skillCode": "bi-modeling",
    "questionText": "In advanced dimensional modeling, how do you handle a 'role-playing dimension' such as using a single 'Date' dimension table for both 'Order Date' and 'Ship Date' in a sales fact table?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Create duplicate physical tables in the database for each role."
      },
      {
        "id": "opt2",
        "text": "Create database views or semantic layer aliases that reference the same physical dimension table with different logical names and separate relationships."
      },
      {
        "id": "opt3",
        "text": "Merge the order date and ship date into a single text column inside the fact table."
      },
      {
        "id": "opt4",
        "text": "Disable referential integrity constraints between the fact table and the date dimension."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Role-playing dimensions are efficiently handled in semantic layers by creating logical views or aliases pointing to the same physical dimension table, avoiding unnecessary data duplication while allowing distinct relationships (e.g., Fact[OrderDate] -> Date[DateKey] and Fact[ShipDate] -> Date[DateKey])."
  },
  {
    "skillCode": "bi-modeling",
    "questionText": "When designing a metrics store for complex business KPIs, what is the purpose of 'metric dimensionality' or metric scoping?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Restricting the metric calculation to execute only on specific hardware nodes."
      },
      {
        "id": "opt2",
        "text": "Defining which dimensions are legally allowed to slice and dice a specific metric to prevent invalid aggregations or misleading context."
      },
      {
        "id": "opt3",
        "text": "Compressing database storage by removing unused table columns."
      },
      {
        "id": "opt4",
        "text": "Encrypting sensitive dimensional attributes at rest."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Metric scoping/dimensionality in advanced semantic layers defines the valid context (dimensions) for a metric, preventing users from slicing metrics by dimensions that do not logically apply or would result in incorrect business logic."
  },
  {
    "skillCode": "bi-modeling",
    "questionText": "What architectural challenge does a 'factless fact table' solve in a star schema?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Tracking events or occurrences where no numeric measurements/metrics exist, such as student attendance or student-course enrollments."
      },
      {
        "id": "opt2",
        "text": "Storing financial transactions that require negative numeric values."
      },
      {
        "id": "opt3",
        "text": "Improving query performance for tables with billions of rows by eliminating all indexes."
      },
      {
        "id": "opt4",
        "text": "Replacing dimension tables entirely when dimension attributes change too frequently."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "A factless fact table records occurrences of events or relationships where there is no quantitative measure to sum up (e.g., student attendance tracking, survey responses, or event registrations), capturing only the foreign keys of the participating dimensions."
  },
  {
    "skillCode": "docker-k8s",
    "questionText": "Which Dockerfile instruction is best used to copy files into a container while automatically extracting local tar archives?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "COPY"
      },
      {
        "id": "opt2",
        "text": "ADD"
      },
      {
        "id": "opt3",
        "text": "RUN"
      },
      {
        "id": "opt4",
        "text": "EXTRACT"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "The ADD instruction has a special feature where it automatically unpacks local tar archive files when they are added to the container filesystem. COPY only copies files directly without unpacking."
  },
  {
    "skillCode": "docker-k8s",
    "questionText": "What is the primary purpose of using multi-stage builds in Docker?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "To speed up local container startup times."
      },
      {
        "id": "opt2",
        "text": "To reduce the final Docker image size by excluding build-time dependencies."
      },
      {
        "id": "opt3",
        "text": "To allow a single container to run multiple operating systems concurrently."
      },
      {
        "id": "opt4",
        "text": "To bypass the need for a Dockerfile."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Multi-stage builds allow developers to use multiple FROM statements in a single Dockerfile. Each FROM starts a new stage with a fresh base, enabling you to copy only the necessary artifacts (like compiled binaries) from the heavy build stage to a lean production image, greatly reducing image size."
  },
  {
    "skillCode": "docker-k8s",
    "questionText": "True or False: By default, Docker containers run with root privileges inside the container, which maps to the root user on the host machine.",
    "type": "true_false",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "True"
      },
      {
        "id": "opt2",
        "text": "False"
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "By default, Docker containers run as the root user. While containers are isolated via kernel namespaces and cgroups, running as root inside the container means you have root privileges inside that container namespace, which can pose security risks if container escape vulnerabilities exist."
  },
  {
    "skillCode": "docker-k8s",
    "questionText": "Which of the following practices help optimize Docker image sizes and layer caching? (Select all that apply)",
    "type": "multi_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Combining multiple RUN commands using && and cleaning up caches in the same layer."
      },
      {
        "id": "opt2",
        "text": "Placing frequently changing instructions (like copying source code) near the top of the Dockerfile."
      },
      {
        "id": "opt3",
        "text": "Using a .dockerignore file to exclude unnecessary files from the build context."
      },
      {
        "id": "opt4",
        "text": "Using minimal base images like Alpine or distroless where appropriate."
      }
    ],
    "correctAnswers": [
      "opt1",
      "opt3",
      "opt4"
    ],
    "explanation": "Combining RUN commands reduces intermediate layers. A .dockerignore file prevents sending large or secret files to the Docker daemon context. Minimal base images reduce attack surface and size. Placing frequently changing instructions near the top is incorrect because it breaks the build cache for all subsequent layers; they should be placed near the bottom."
  },
  {
    "skillCode": "docker-k8s",
    "questionText": "When writing a Dockerfile, why is it recommended to place the `COPY package.json .` and `RUN npm install` steps before copying the rest of your application source code?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "To ensure Node.js is installed correctly."
      },
      {
        "id": "opt2",
        "text": "To leverage Docker's layer caching so dependencies aren't re-installed when only source code changes."
      },
      {
        "id": "opt3",
        "text": "Because npm requires package.json to be copied in a separate layer from source code."
      },
      {
        "id": "opt4",
        "text": "To reduce the memory consumption of the Docker daemon during build."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Docker caches each layer. If package.json hasn't changed, Docker reuses the cached layer for `RUN npm install`. If we copied all source code first, modifying any text file would invalidate the cache and force `npm install` to run on every single code change."
  },
  {
    "skillCode": "docker-k8s",
    "questionText": "What happens to data written inside a container's writable layer when the container is stopped and then restarted using `docker restart`?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "All data written to the writable layer is completely deleted."
      },
      {
        "id": "opt2",
        "text": "Data persists because stopping and restarting a container preserves its writable layer."
      },
      {
        "id": "opt3",
        "text": "Data is automatically migrated to a Docker volume."
      },
      {
        "id": "opt4",
        "text": "The container resets to its initial base image state."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Stopping and restarting a container (`docker stop` and `docker start`, or `docker restart`) preserves the container's writable layer and its contents. Data is only lost when the container is explicitly removed using `docker rm` (unless using volumes)."
  },
  {
    "skillCode": "docker-k8s",
    "questionText": "How can you securely pass sensitive credentials (like database passwords) into a Docker container during build time without hardcoding them into the image layers?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Using standard ENV instructions in the Dockerfile."
      },
      {
        "id": "opt2",
        "text": "Using BuildKit build secrets (--secret flag) combined with the --mount=type=secret directive."
      },
      {
        "id": "opt3",
        "text": "Echoing the password into a temporary file during a RUN command."
      },
      {
        "id": "opt4",
        "text": "Passing them via the EXPOSE instruction."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Standard ENV variables and RUN commands are stored permanently in the image layers and can be extracted via `docker history`. Docker BuildKit's secret mounting feature allows you to pass secrets securely during the build process without persisting them in the final image layers."
  },
  {
    "skillCode": "docker-k8s",
    "questionText": "Which of the following mechanisms is utilized by Docker containers to enforce resource constraints (such as CPU and memory limits)?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Linux Kernel Namespaces"
      },
      {
        "id": "opt2",
        "text": "Linux Control Groups (cgroups)"
      },
      {
        "id": "opt3",
        "text": "Union File Systems (OverlayFS)"
      },
      {
        "id": "opt4",
        "text": "iptables packet filtering"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Linux Control Groups (cgroups) are responsible for limiting, accounting, and isolating the resource usage (CPU, memory, disk I/O, network) of a collection of processes. Namespaces, on the other hand, provide isolation of system resources (like process trees, network interfaces, mount points)."
  },
  {
    "skillCode": "docker-k8s",
    "questionText": "When building secure container images, what is the primary security advantage of using 'distroless' images as your runtime base?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "They compile application source code 50% faster than standard Debian or Alpine images."
      },
      {
        "id": "opt2",
        "text": "They contain only the application and its runtime dependencies, omitting package managers, shells, and utilities to minimize attack surface."
      },
      {
        "id": "opt3",
        "text": "They automatically encrypt all container data at rest using AES-256."
      },
      {
        "id": "opt4",
        "text": "They allow containers to run without requiring a Linux kernel."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Distroless images (created by Google) contain only your application and its runtime dependencies. They do not contain package managers (like apt or apk), shells (like bash or sh), or any other programs usually found in a standard Linux distribution. This drastically reduces vulnerabilities and prevents attackers from executing commands even if they achieve remote code execution."
  },
  {
    "skillCode": "docker-k8s",
    "questionText": "You notice that your Docker container keeps getting killed unexpectedly with exit code 137. What is the most likely root cause?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "The application inside the container threw an unhandled JavaScript/Python exception."
      },
      {
        "id": "opt2",
        "text": "The container exceeded its allocated memory limit and was terminated by the host kernel's OOM (Out-Of-Memory) killer."
      },
      {
        "id": "opt3",
        "text": "The container received a graceful SIGTERM signal and finished its task successfully."
      },
      {
        "id": "opt4",
        "text": "The network connection to the Docker daemon timed out."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Exit code 137 in Docker (and Linux in general) indicates that the process was terminated by signal 9 (SIGKILL), which is commonly triggered by the Linux kernel's Out-Of-Memory (OOM) killer when a container exceeds its memory limit (specified via `-m` or memory limits in orchestrators)."
  },
  {
    "skillCode": "k8s-orch",
    "questionText": "Which Kubernetes resource is primarily responsible for maintaining a set of replica pods running a specified version of an image?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "Service"
      },
      {
        "id": "opt2",
        "text": "Deployment"
      },
      {
        "id": "opt3",
        "text": "Ingress"
      },
      {
        "id": "opt4",
        "text": "ConfigMap"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "A Deployment provides declarative updates for Pods and ReplicaSets, ensuring the desired number of pods are running. Services provide network access, Ingress manages external HTTP/S traffic, and ConfigMaps store configuration data, making 'Deployment' the correct choice."
  },
  {
    "skillCode": "k8s-orch",
    "questionText": "What is the default Service type assigned if you do not explicitly specify one in your Service manifest?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "NodePort"
      },
      {
        "id": "opt2",
        "text": "LoadBalancer"
      },
      {
        "id": "opt3",
        "text": "ClusterIP"
      },
      {
        "id": "opt4",
        "text": "ExternalName"
      }
    ],
    "correctAnswers": [
      "opt3"
    ],
    "explanation": "ClusterIP is the default Kubernetes service type. It exposes the service on an internal IP within the cluster, making it only reachable from within the cluster."
  },
  {
    "skillCode": "k8s-orch",
    "questionText": "ConfigMaps and Secrets are designed to inject configuration data into pods. Are ConfigMaps encrypted by default in standard Kubernetes etcd storage?",
    "type": "true_false",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "True"
      },
      {
        "id": "opt2",
        "text": "False"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "By default, Kubernetes stores ConfigMaps and Secrets as plain text in etcd. Encryption at rest must be explicitly enabled via encryption configurations in the API server."
  },
  {
    "skillCode": "k8s-orch",
    "questionText": "When configuring a rolling update strategy for a Deployment, which two parameters control the surge and unavailability of pods during the update process?",
    "type": "multi_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "maxSurge"
      },
      {
        "id": "opt2",
        "text": "maxUnavailable"
      },
      {
        "id": "opt3",
        "text": "minReadySeconds"
      },
      {
        "id": "opt4",
        "text": "replicaTimeout"
      }
    ],
    "correctAnswers": [
      "opt1",
      "opt2"
    ],
    "explanation": "maxSurge and maxUnavailable are the two specific parameters under rollingUpdate strategy that control how many extra pods can be created above the desired number and how many pods can be unavailable during the rollout."
  },
  {
    "skillCode": "k8s-orch",
    "questionText": "You need to expose a web application externally via HTTP, supporting path-based routing (e.g., /api and /web) and TLS termination. Which Kubernetes resource should you configure?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "ClusterIP Service"
      },
      {
        "id": "opt2",
        "text": "Ingress"
      },
      {
        "id": "opt3",
        "text": "NodePort Service"
      },
      {
        "id": "opt4",
        "text": "HorizontalPodAutoscaler"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "An Ingress controller manages external HTTP/HTTPS traffic, routing rules based on paths and hostnames, and handles TLS termination, making it the exact tool required for this scenario."
  },
  {
    "skillCode": "k8s-orch",
    "questionText": "How does the Horizontal Pod Autoscaler (HPA) primarily determine when to scale the number of pods in a Deployment?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Node disk I/O latency metrics"
      },
      {
        "id": "opt2",
        "text": "Observed CPU or custom metric utilization compared against target thresholds"
      },
      {
        "id": "opt3",
        "text": "The number of incoming TCP connections on the Ingress controller"
      },
      {
        "id": "opt4",
        "text": "Cluster-wide memory fragmentation rates"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "HPA scales pods dynamically based on observed metrics such as average CPU utilization or custom metrics fetched from metrics-server, scaling up or down when the metrics deviate from the specified target."
  },
  {
    "skillCode": "k8s-orch",
    "questionText": "If a Pod is deleted or evicted, what happens to the environment variables and files injected into that Pod from an associated ConfigMap?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "They persist on the node disk until manually garbage collected."
      },
      {
        "id": "opt2",
        "text": "They are permanently deleted along with the pod instance."
      },
      {
        "id": "opt3",
        "text": "They are automatically migrated to the backup control plane."
      },
      {
        "id": "opt4",
        "text": "The original ConfigMap resource is also deleted."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "ConfigMaps exist independently of Pods. When a Pod is terminated, its instantiated environment variables or mounted files vanish with it, but the underlying ConfigMap resource remains intact in the cluster."
  },
  {
    "skillCode": "k8s-orch",
    "questionText": "What is the primary role of a Cluster Autoscaler in a managed or self-hosted Kubernetes cluster?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "It automatically scales the number of container replicas based on HTTP traffic."
      },
      {
        "id": "opt2",
        "text": "It monitors pod resource requests and adjusts the underlying worker node count (provisioning or de-provisioning nodes)."
      },
      {
        "id": "opt3",
        "text": "It automatically updates container image tags in Deployments when a new image is pushed."
      },
      {
        "id": "opt4",
        "text": "It balances load across multi-region cloud providers via DNS routing."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "The Cluster Autoscaler adds or removes worker nodes in the underlying infrastructure based on pending pods that cannot be scheduled due to insufficient resources, or drains underutilized nodes."
  },
  {
    "skillCode": "k8s-orch",
    "questionText": "When troubleshooting an Ingress resource where traffic returns a 503 Service Temporarily Unavailable error, which of the following are common root causes to check?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Incorrect pod container image tag syntax in the deployment manifest."
      },
      {
        "id": "opt2",
        "text": "Mismatched service port or selector labels in the Service that prevent endpoints from being populated."
      },
      {
        "id": "opt3",
        "text": "Cluster Node disk space running out of inodes."
      },
      {
        "id": "opt4",
        "text": "Excessive Horizontal Pod Autoscaler scale-down limits."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "A 503 error from an Ingress typically means the Ingress controller cannot find any healthy backend endpoints. This happens when Service selectors do not match Pod labels or when the target service port is incorrect."
  },
  {
    "skillCode": "k8s-orch",
    "questionText": "You update a ConfigMap that is mounted as a volume inside a running Deployment's pods. What behavior should you expect regarding the updates inside those pods?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "The files mounted inside the container will eventually update automatically, though propagation can take some time depending on kubelet sync loops."
      },
      {
        "id": "opt2",
        "text": "The container environment variables update instantly without any pod restarts."
      },
      {
        "id": "opt3",
        "text": "The changes are completely blocked until you manually recreate the entire namespace."
      },
      {
        "id": "opt4",
        "text": "The container crashes immediately due to file lock contention."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "When a ConfigMap is mounted as a volume, the files inside the container are eventually updated automatically by the kubelet. However, environment variable injections from ConfigMaps do not update dynamically without a pod restart."
  },
  {
    "skillCode": "aws-cloud",
    "questionText": "What is the primary purpose of an Amazon S3 bucket policy?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "To define resource-based permissions to grant or deny access to objects within the bucket."
      },
      {
        "id": "opt2",
        "text": "To configure automatic horizontal scaling rules for EC2 instances hosting S3 data."
      },
      {
        "id": "opt3",
        "text": "To compress files automatically before they are written to disk."
      },
      {
        "id": "opt4",
        "text": "To establish an encrypted IPsec VPN tunnel between your data center and S3."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "Amazon S3 bucket policies are JSON-based resource-based policies used to grant or deny permissions to the bucket and the objects inside it. Options 2, 3, and 4 describe unrelated infrastructure tasks."
  },
  {
    "skillCode": "aws-cloud",
    "questionText": "Which AWS networking component acts as a virtual firewall at the subnet level to control inbound and outbound traffic?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "Security Group"
      },
      {
        "id": "opt2",
        "text": "Network Access Control List (NACL)"
      },
      {
        "id": "opt3",
        "text": "Route Table"
      },
      {
        "id": "opt4",
        "text": "NAT Gateway"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "NACLs operate at the subnet level, acting as a firewall for controlling traffic in and out of one or more subnets. Security Groups operate at the instance level. Route tables determine where network traffic is directed, and NAT Gateways allow private instances to access the internet."
  },
  {
    "skillCode": "aws-cloud",
    "questionText": "True or False: An AWS IAM Role is intended to be directly associated with a specific individual user who logs in with a password and multi-factor authentication.",
    "type": "true_false",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "True"
      },
      {
        "id": "opt2",
        "text": "False"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "IAM users are meant for people, while IAM roles are intended to be assumed by trusted entities, such as AWS services, EC2 instances, or federated users from an identity provider. Roles do not have permanent credentials like passwords."
  },
  {
    "skillCode": "aws-cloud",
    "questionText": "An application running on an EC2 instance needs to securely read configuration parameters from AWS Systems Manager Parameter Store without hardcoding credentials. What is the most secure and recommended approach?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Store an IAM user's Access Key and Secret Key in environment variables on the instance."
      },
      {
        "id": "opt2",
        "text": "Attach an IAM role with the necessary permissions to the EC2 instance profile."
      },
      {
        "id": "opt3",
        "text": "Hardcode the AWS account root credentials in the application configuration file."
      },
      {
        "id": "opt4",
        "text": "Disable authentication on the Parameter Store endpoint for internal network ranges."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Attaching an IAM role to an EC2 instance profile provides temporary credentials managed automatically by AWS, eliminating the security risk of hardcoded keys or environment variables. Root credentials should never be used for applications."
  },
  {
    "skillCode": "aws-cloud",
    "questionText": "You need to design a highly available web application architecture across multiple Availability Zones (AZs). Which components are essential to achieve multi-AZ high availability? (Select all that apply)",
    "type": "multi_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "An Elastic Load Balancer (ELB) distributing traffic across targets in multiple AZs."
      },
      {
        "id": "opt2",
        "text": "Auto Scaling groups launching instances across multiple subnets in different AZs."
      },
      {
        "id": "opt3",
        "text": "A single-AZ EC2 instance provisioned with extra CPU capacity."
      },
      {
        "id": "opt4",
        "text": "A Multi-AZ deployment configuration for your relational database (e.g., RDS)."
      }
    ],
    "correctAnswers": [
      "opt1",
      "opt2",
      "opt4"
    ],
    "explanation": "High availability requires removing single points of failure. This involves load balancing across AZs, multi-AZ compute scaling, and multi-AZ database replication. A single-AZ instance (opt3) introduces a single point of failure."
  },
  {
    "skillCode": "aws-cloud",
    "questionText": "What happens when an AWS Lambda function, configured with a standard VPC integration, experiences a cold start?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "AWS provisions Elastic Network Interfaces (ENIs) and assigns private IP addresses within the designated VPC subnets before executing code."
      },
      {
        "id": "opt2",
        "text": "The Lambda service automatically requests a public Elastic IP from the VPC pool."
      },
      {
        "id": "opt3",
        "text": "Lambda routes traffic directly through the internet gateway, bypassing VPC configuration."
      },
      {
        "id": "opt4",
        "text": "The function fails because Lambda cannot natively interact with VPC subnets."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "When a Lambda function is configured to connect to a VPC, AWS creates Elastic Network Interfaces (ENIs) in your subnets during initialization (cold start), which historically added latency to cold starts, though optimizations have since improved this process."
  },
  {
    "skillCode": "aws-cloud",
    "questionText": "You are troubleshooting a database connectivity issue where an application in a private subnet cannot connect to an Amazon RDS MySQL instance in a different private subnet within the same VPC. What is the most likely cause?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "The RDS instance lacks an attached Internet Gateway route."
      },
      {
        "id": "opt2",
        "text": "The security group attached to the RDS instance does not allow inbound traffic on port 3306 from the application's security group or CIDR."
      },
      {
        "id": "opt3",
        "text": "RDS instances cannot be accessed from within the same VPC without a NAT Gateway."
      },
      {
        "id": "opt4",
        "text": "The S3 bucket policy is blocking database communication."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Security groups are stateful firewalls acting at the instance/resource level. If port 3306 is not explicitly allowed from the application source, the connection will be blocked. RDS in private subnets does not require an Internet Gateway."
  },
  {
    "skillCode": "aws-cloud",
    "questionText": "Which design pattern is best suited to handle unpredictable, bursty incoming event streams with decoupling between the producer and consumer services?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Synchronous API Gateway invoking a Lambda function directly."
      },
      {
        "id": "opt2",
        "text": "Amazon SQS queue coupled with AWS Lambda polling the queue for asynchronous processing."
      },
      {
        "id": "opt3",
        "text": "Direct database writes via JDBC connections from external clients."
      },
      {
        "id": "opt4",
        "text": "Manual EC2 scaling using scheduled cron jobs."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Amazon SQS decouples producers and consumers, buffering requests during traffic spikes so that consumer services (like Lambda) can process messages at a sustainable rate. Synchronous invocation can lead to timeouts or failures under heavy load."
  },
  {
    "skillCode": "aws-cloud",
    "questionText": "An enterprise requires that all objects uploaded to any S3 bucket across multiple AWS accounts must be automatically encrypted using AWS KMS customer managed keys (CMKs). How can an architect enforce this globally and proactively?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Rely on developers to remember to pass the encryption header with every API request."
      },
      {
        "id": "opt2",
        "text": "Apply AWS Organizations Service Control Policies (SCPs) or S3 Bucket Policies with a Deny effect on PUT requests lacking the required `s3:x-amz-server-side-encryption` header."
      },
      {
        "id": "opt3",
        "text": "Configure CloudWatch alarms to send an email notification whenever unencrypted data is found."
      },
      {
        "id": "opt4",
        "text": "Attach an IAM policy to the root user account only."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Preventative governance using SCPs or explicit Deny bucket policies ensures that any upload missing encryption parameters is automatically rejected by AWS, guaranteeing compliance rather than relying on manual developer discipline."
  },
  {
    "skillCode": "aws-cloud",
    "questionText": "You are designing a Disaster Recovery (DR) strategy for a mission-critical transactional database. Your RPO (Recovery Point Objective) is near zero, and your RTO (Recovery Time Objective) must be under 1 minute. Which configuration should you choose?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Daily automated database snapshots backed up to Glacier."
      },
      {
        "id": "opt2",
        "text": "An Amazon RDS Multi-AZ deployment with synchronous replication to a standby instance in another Availability Zone, and automatic failover."
      },
      {
        "id": "opt3",
        "text": "A cold standby database spun up manually via scripts after an outage occurs."
      },
      {
        "id": "opt4",
        "text": "Asynchronous database backups copied to another AWS region once every 24 hours."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "RDS Multi-AZ provides synchronous data replication to a standby database in a different AZ, ensuring zero data loss (RPO = 0) and automatic failover in under a minute (low RTO). Daily snapshots or cold standbys result in much higher data loss and recovery times."
  },
  {
    "skillCode": "cicd-github",
    "questionText": "Where must workflow files be stored within a GitHub repository for GitHub Actions to automatically recognize and execute them?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": ".github/workflows/"
      },
      {
        "id": "opt2",
        "text": "workflows/github/"
      },
      {
        "id": "opt3",
        "text": ".ci/actions/"
      },
      {
        "id": "opt4",
        "text": "actions/workflows/"
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "GitHub Actions strictly requires workflow YAML files to be placed inside the '.github/workflows/' directory in the root of the repository to detect and run them."
  },
  {
    "skillCode": "cicd-github",
    "questionText": "Which keyword is used to define reusable blocks of commands within a GitHub Actions job step?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "run"
      },
      {
        "id": "opt2",
        "text": "exec"
      },
      {
        "id": "opt3",
        "text": "script"
      },
      {
        "id": "opt4",
        "text": "command"
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "The 'run' keyword tells the job to execute shell commands using the operating system's default shell. 'exec', 'script', and 'command' are not valid keywords for this purpose."
  },
  {
    "skillCode": "cicd-github",
    "questionText": "True or False: GitHub Actions automatically masks values added to repository secrets if they happen to accidentally print to the workflow console logs.",
    "type": "true_false",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "True"
      },
      {
        "id": "opt2",
        "text": "False"
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "True. GitHub automatically redacts any string added as a repository, organization, or environment secret if it is outputted to the console log, replacing it with '***'."
  },
  {
    "skillCode": "cicd-github",
    "questionText": "How can you pass data between different jobs in a GitHub Actions workflow where jobs run on separate virtual machines?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Using environment variables defined at the workflow level"
      },
      {
        "id": "opt2",
        "text": "Using GitHub Actions artifacts to upload and download files"
      },
      {
        "id": "opt3",
        "text": "Using local file paths since runners share the same storage volume"
      },
      {
        "id": "opt4",
        "text": "Using the 'outputs' context directly across jobs without dependency declarations"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Because separate jobs run on different runner instances with isolated filesystems, artifacts must be uploaded using 'actions/upload-artifact' in one job and downloaded using 'actions/download-artifact' in another. Environment variables do not persist across jobs."
  },
  {
    "skillCode": "cicd-github",
    "questionText": "Which of the following approaches are best practices for securing secrets and credentials in GitHub Actions workflows? (Select all that apply)",
    "type": "multi_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Using GitHub Encrypted Secrets for sensitive data like production API keys."
      },
      {
        "id": "opt2",
        "text": "Printing out environment variables at the start of a debug job to verify they loaded."
      },
      {
        "id": "opt3",
        "text": "Using OIDC (OpenID Connect) to authenticate with cloud providers like AWS without storing long-lived credentials."
      },
      {
        "id": "opt4",
        "text": "Hardcoding staging passwords directly in the workflow YAML file if the repository is private."
      }
    ],
    "correctAnswers": [
      "opt1",
      "opt3"
    ],
    "explanation": "Using encrypted secrets and OIDC tokens (tokenless authentication) are secure industry standards. Printing secrets to logs (even masked ones) can expose them if masking fails, and hardcoding passwords in YAML is a severe security risk regardless of repository visibility."
  },
  {
    "skillCode": "cicd-github",
    "questionText": "When implementing a blue-green deployment strategy using GitHub Actions, what is the primary purpose of switching the production router/load balancer after deploying to the 'green' environment?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "To immediately delete the old blue environment to save cloud compute costs"
      },
      {
        "id": "opt2",
        "text": "To route live user traffic seamlessly to the newly updated green deployment with zero downtime"
      },
      {
        "id": "opt3",
        "text": "To trigger automated integration tests against the production database"
      },
      {
        "id": "opt4",
        "text": "To invalidate the GitHub runner cache"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Blue-green deployments maintain two identical production environments. Once the green environment is deployed and verified, the load balancer switches traffic to it, ensuring zero downtime and providing an instant rollback path to blue if issues arise."
  },
  {
    "skillCode": "cicd-github",
    "questionText": "You want a workflow step to execute ONLY if a previous step in the same job failed. Which expression should you use?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "if: ${{ always() }}"
      },
      {
        "id": "opt2",
        "text": "if: ${{ success() }}"
      },
      {
        "id": "opt3",
        "text": "if: ${{ failure() }}"
      },
      {
        "id": "opt4",
        "text": "if: ${{ cancelled() }}"
      }
    ],
    "correctAnswers": [
      "opt3"
    ],
    "explanation": "The 'failure()' conditional expression evaluates to true only if any previous step of a job has failed. 'always()' runs regardless of status, 'success()' requires all previous steps to succeed, and 'cancelled()' triggers if the workflow is cancelled."
  },
  {
    "skillCode": "cicd-github",
    "questionText": "How can you configure a GitHub Actions workflow to trigger automatically whenever a new Git release tag matching the pattern 'v*' is pushed to the repository?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "on:\n  push:\n    tags:\n      - 'v*'"
      },
      {
        "id": "opt2",
        "text": "on:\n  release:\n    types: [published]"
      },
      {
        "id": "opt3",
        "text": "on:\n  tag:\n    pattern: 'v*'"
      },
      {
        "id": "opt4",
        "text": "on:\n  push:\n    branches:\n      - 'v*'"
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "The correct syntax to target git tags on push events is using the 'tags' filter array under the 'push' trigger block. Option 2 triggers on the GitHub Release event, not the raw tag push, and Option 4 targets branches instead of tags."
  },
  {
    "skillCode": "cicd-github",
    "questionText": "In an advanced blue-green deployment pipeline using GitHub Actions and Kubernetes, how do you handle database migrations safely without breaking the currently active 'blue' version?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Run destructive schema updates directly in the pipeline before deploying the green pods."
      },
      {
        "id": "opt2",
        "text": "Ensure database migrations are backward-compatible so both blue and green application versions can run against the updated schema simultaneously."
      },
      {
        "id": "opt3",
        "text": "Stop the blue environment completely, run the migration, and then deploy green."
      },
      {
        "id": "opt4",
        "text": "Avoid running migrations in CI/CD entirely and execute them manually weeks later."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "In zero-downtime blue-green deployments, database changes must be backward-compatible (e.g., expanding columns rather than renaming/dropping them immediately) because both the old 'blue' and new 'green' versions may be active during the transition window."
  },
  {
    "skillCode": "cicd-github",
    "questionText": "When writing a composite GitHub Action or a reusable workflow, what is a key architectural difference between 'jobs' in a reusable workflow and steps in a 'composite' action?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Reusable workflows can contain multiple jobs running on different runner OS types, whereas composite actions consist only of sequential steps running within a single job context."
      },
      {
        "id": "opt2",
        "text": "Composite actions can execute multiple independent jobs across different cloud providers, whereas reusable workflows are limited to local runner scripts."
      },
      {
        "id": "opt3",
        "text": "There is no difference; both terms are interchangeable synonyms in GitHub Actions architecture."
      },
      {
        "id": "opt4",
        "text": "Reusable workflows cannot accept input parameters, whereas composite actions require them."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "Reusable workflows ('workflow_call') allow you to bundle entire multi-job structures across different runners. Composite actions ('runs: using: \"composite\"') combine multiple steps into a single reusable action that runs inline within the calling job."
  },
  {
    "skillCode": "ml-foundations",
    "questionText": "What is the primary purpose of adding a regularization term (like L1 or L2) to a machine learning model's loss function?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "To increase training speed by simplifying gradient updates"
      },
      {
        "id": "opt2",
        "text": "To penalize overly complex models and prevent overfitting"
      },
      {
        "id": "opt3",
        "text": "To eliminate missing values in the dataset automatically"
      },
      {
        "id": "opt4",
        "text": "To guarantee that the model achieves 100% accuracy on training data"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Regularization adds a penalty for large or non-zero coefficients to the loss function, discouraging the model from fitting noise in the training data and thereby reducing overfitting. It does not speed up training, handle missing values, or guarantee 100% accuracy."
  },
  {
    "skillCode": "ml-foundations",
    "questionText": "In the context of the bias-variance tradeoff, what typically happens when you increase the complexity of a model (e.g., higher-degree polynomial regression)?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "Bias increases, and variance decreases"
      },
      {
        "id": "opt2",
        "text": "Both bias and variance increase"
      },
      {
        "id": "opt3",
        "text": "Bias decreases, and variance increases"
      },
      {
        "id": "opt4",
        "text": "Both bias and variance decrease"
      }
    ],
    "correctAnswers": [
      "opt3"
    ],
    "explanation": "As model complexity increases, the model can capture more intricate patterns, reducing its assumptions (lower bias). However, it also becomes more sensitive to fluctuations in the training set, leading to higher variance."
  },
  {
    "skillCode": "ml-foundations",
    "questionText": "Which of the following problems are typically solved using unsupervised learning techniques? (Select all that apply)",
    "type": "multi_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "Customer segmentation based on purchasing behavior"
      },
      {
        "id": "opt2",
        "text": "Predicting tomorrow's house price based on historical features"
      },
      {
        "id": "opt3",
        "text": "Dimensionality reduction using Principal Component Analysis (PCA)"
      },
      {
        "id": "opt4",
        "text": "Classifying emails as spam or not spam"
      }
    ],
    "correctAnswers": [
      "opt1",
      "opt3"
    ],
    "explanation": "Customer segmentation (clustering) and dimensionality reduction (PCA) operate on unlabeled data to find hidden structures, which defines unsupervised learning. House price prediction and spam classification require target labels, making them supervised learning tasks."
  },
  {
    "skillCode": "ml-foundations",
    "questionText": "When evaluating a binary classification model on a heavily imbalanced dataset (e.g., 99% negative class, 1% positive class), accuracy can be a misleading metric.",
    "type": "true_false",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "True"
      },
      {
        "id": "opt2",
        "text": "False"
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "True. A naive model that predicts the majority class 100% of the time would achieve 99% accuracy while completely failing to identify the positive class. Metrics like Precision, Recall, F1-score, or ROC-AUC are much more informative in such scenarios."
  },
  {
    "skillCode": "ml-foundations",
    "questionText": "What is the key functional difference between L1 regularization (Lasso) and L2 regularization (Ridge)?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "L1 can drive coefficients down to exactly zero, performing feature selection, whereas L2 shrinks coefficients close to zero but rarely to absolute zero."
      },
      {
        "id": "opt2",
        "text": "L2 can drive coefficients down to exactly zero, whereas L1 only shrinks them proportionally."
      },
      {
        "id": "opt3",
        "text": "L1 is used exclusively for logistic regression, while L2 is used exclusively for linear regression."
      },
      {
        "id": "opt4",
        "text": "L2 introduces non-convexity into the optimization problem, making it harder to solve than L1."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "Due to the absolute value geometry in L1 regularization (Lasso), it creates sparsity, driving uninformative feature weights to exactly zero. L2 regularization (Ridge) uses squared penalties which shrink coefficients smoothly without eliminating them entirely. Both can be applied to various linear models, and both maintain convex optimization."
  },
  {
    "skillCode": "ml-foundations",
    "questionText": "You train a classification model and obtain a high training accuracy but a drastically low validation accuracy. What is the most appropriate diagnosis and initial remedy?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Underfitting; add more features or increase model complexity."
      },
      {
        "id": "opt2",
        "text": "Overfitting; apply regularization, collect more training data, or simplify the model architecture."
      },
      {
        "id": "opt3",
        "text": "Data leakage; remove the validation set and train on all available data."
      },
      {
        "id": "opt4",
        "text": "High bias; increase the number of training epochs indefinitely."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "High training accuracy paired with low validation accuracy is the classic signature of overfitting (high variance). Remedies include regularizing the model, acquiring more data, or reducing complexity. Underfitting would show poor performance on both training and validation sets."
  },
  {
    "skillCode": "ml-foundations",
    "questionText": "Why is the ROC-AUC (Receiver Operating Characteristic - Area Under Curve) metric preferred over simple threshold-dependent accuracy when evaluating probabilistic classifiers?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "It computes the exact cost matrix for business financial loss."
      },
      {
        "id": "opt2",
        "text": "It evaluates the model's performance across all possible classification thresholds rather than a single arbitrary 0.5 cutoff."
      },
      {
        "id": "opt3",
        "text": "It automatically scales all input features to a range of 0 and 1."
      },
      {
        "id": "opt4",
        "text": "It ignores false positives, focusing purely on true positive recovery rate."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "ROC-AUC plots the True Positive Rate against the False Positive Rate across every conceivable threshold, providing a comprehensive aggregate measure of performance independent of any specific decision threshold."
  },
  {
    "skillCode": "ml-foundations",
    "questionText": "In K-Means clustering, what does the objective function (inertia or within-cluster sum of squares) measure, and how does it behave as K increases?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "It measures distance between cluster centroids; it increases monotonically as K increases."
      },
      {
        "id": "opt2",
        "text": "It measures the total variance between clusters; it stays constant regardless of K."
      },
      {
        "id": "opt3",
        "text": "It measures the compactness of clusters; it decreases monotonically as K increases, reaching zero when K equals the number of data points."
      },
      {
        "id": "opt4",
        "text": "It measures outlier contamination; it peaks at the optimal K value."
      }
    ],
    "correctAnswers": [
      "opt3"
    ],
    "explanation": "Inertia calculates the sum of squared distances of samples to their closest cluster center. As K increases, clusters become tighter, so inertia decreases monotonically, dropping to 0 when every point is its own cluster (K = N), which is why the 'elbow method' is used to find a balanced K."
  },
  {
    "skillCode": "ml-foundations",
    "questionText": "When performing k-fold cross-validation, what is the primary risk if data preprocessing steps (such as standard scaling or missing value imputation using mean) are applied to the entire dataset before splitting into folds?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Data leakage, leading to overly optimistic cross-validation performance estimates."
      },
      {
        "id": "opt2",
        "text": "Division by zero errors during the scaling phase."
      },
      {
        "id": "opt3",
        "text": "Catastrophic forgetting in gradient descent optimization."
      },
      {
        "id": "opt4",
        "text": "A severe increase in model bias due to loss of variance."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "Applying global preprocessing leaks information from the validation folds into the training process (e.g., global mean or variance incorporates test set statistics), resulting in data leakage and artificially inflated performance metrics that won't generalize to unseen production data."
  },
  {
    "skillCode": "ml-foundations",
    "questionText": "Consider a scenario where adding a feature to a linear regression model causes the training error to decrease, but the test error to significantly increase. What phenomenon is primarily responsible for this?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "The added feature introduced high structural bias into the model."
      },
      {
        "id": "opt2",
        "text": "The added feature increased the variance of the estimator, causing the model to overfit noise specific to the training set."
      },
      {
        "id": "opt3",
        "text": "Multicollinearity between the new feature and existing features caused gradient explosion."
      },
      {
        "id": "opt4",
        "text": "Underfitting due to insufficient sample size scaling."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Adding features increases model flexibility and reduces training error (bias), but if the feature introduces noise or redundancy without capturing true underlying signal, it drives up model variance, causing test error to soar (overfitting)."
  },
  {
    "skillCode": "llm-genai",
    "questionText": "What is the primary purpose of prompt engineering when interacting with Large Language Models?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "To increase the physical GPU memory available to the model during inference."
      },
      {
        "id": "opt2",
        "text": "To structure instructions and context so the model generates the desired accurate output."
      },
      {
        "id": "opt3",
        "text": "To retrain the underlying neural network weights on new custom data."
      },
      {
        "id": "opt4",
        "text": "To compress the context window length for faster token processing."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Prompt engineering involves crafting inputs (instructions, context, examples) to guide the LLM toward producing the desired response without changing model weights. Options 1, 3, and 4 describe infrastructure management, fine-tuning, or architectural configurations rather than prompt engineering."
  },
  {
    "skillCode": "llm-genai",
    "questionText": "In the context of Large Language Models, what does a 'few-shot conditioning' (or few-shot prompting) approach involve?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "Running the model inference pipeline only a few times to save computing costs."
      },
      {
        "id": "opt2",
        "text": "Providing a few input-output examples within the prompt to guide the model's pattern matching."
      },
      {
        "id": "opt3",
        "text": "Updating the model weights using a small dataset of fewer than 10 training samples."
      },
      {
        "id": "opt4",
        "text": "Restricting the model response to a maximum of three sentences."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Few-shot prompting provides a small number of demonstration examples in the prompt context to help the model understand the expected format, style, or reasoning steps. It does not involve updating model weights (fine-tuning)."
  },
  {
    "skillCode": "llm-genai",
    "questionText": "True or False: Exceeding an LLM's maximum context window length will typically cause the model to gracefully summarize the oldest tokens instead of failing or truncating the input.",
    "type": "true_false",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "True"
      },
      {
        "id": "opt2",
        "text": "False"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "LLMs do not automatically summarize older tokens when the context limit is breached. Instead, APIs will typically throw an error, or the underlying architecture will truncate the input tokens, leading to loss of critical prompt instructions or data."
  },
  {
    "skillCode": "llm-genai",
    "questionText": "When designing prompts to guarantee that an LLM outputs valid JSON for downstream application consumption, which of the following techniques are industry best practices? (Select all that apply)",
    "type": "multi_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Using native structured output features or JSON mode parameters provided by the model provider."
      },
      {
        "id": "opt2",
        "text": "Providing clear schema definitions (e.g., keys, data types) within the system prompt."
      },
      {
        "id": "opt3",
        "text": "Relying solely on a polite conversational request like 'Please try your best to output valid JSON'."
      },
      {
        "id": "opt4",
        "text": "Including a concrete few-shot example demonstrating the exact JSON structure required."
      }
    ],
    "correctAnswers": [
      "opt1",
      "opt2",
      "opt4"
    ],
    "explanation": "Options 1, 2, and 4 are robust engineering practices for structured output generation. Relying solely on a polite request (Option 3) is unreliable and frequently results in malformed syntax, markdown wrappers, or hallucinated keys."
  },
  {
    "skillCode": "llm-genai",
    "questionText": "What is the primary risk of the 'Lost in the Middle' phenomenon when dealing with LLM context windows?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Models tend to ignore or pay less attention to information located in the middle of long prompts compared to the beginning or end."
      },
      {
        "id": "opt2",
        "text": "The middle layers of a Transformer network are prone to dropping out during high-concurrency inference."
      },
      {
        "id": "opt3",
        "text": "Retrieval-Augmented Generation (RAG) pipelines fail to connect to the vector database mid-stream."
      },
      {
        "id": "opt4",
        "text": "Tokens in the middle of a context window consume twice as much memory as prefix tokens."
      }
    ],
    "correctAnswers": [
      "opt1",
      "opt2"
    ],
    "explanation": "Research shows that LLMs exhibit a U-shaped performance curve regarding context utilization; they recall information at the very beginning and very end of a long context much better than information buried in the middle."
  },
  {
    "skillCode": "llm-genai",
    "questionText": "Which of the following strategies best helps prevent prompt injection attacks in user-facing LLM applications?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Concatenating user inputs directly into the system prompt string without delimiters."
      },
      {
        "id": "opt2",
        "text": "Using clear delimiters (e.g., XML tags like <user_input>) and explicit system instructions to treat untrusted text strictly as data."
      },
      {
        "id": "opt3",
        "text": "Increasing the model's temperature parameter to randomize the output against malicious patterns."
      },
      {
        "id": "opt4",
        "text": "Disabling few-shot examples completely."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Separating system instructions from untrusted user data using clear XML-like delimiters and robust system guardrails helps prevent the model from confusing user data with system instructions (prompt injection)."
  },
  {
    "skillCode": "llm-genai",
    "questionText": "When implementing guardrails for an LLM application, where should input and output validation layers ideally be placed?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Directly inside the model's attention heads via post-hoc quantization."
      },
      {
        "id": "opt2",
        "text": "In a middleware layer that intercepts user requests before they hit the LLM and inspects responses before they are returned to the user."
      },
      {
        "id": "opt3",
        "text": "Only on the client-side browser using JavaScript regular expressions."
      },
      {
        "id": "opt4",
        "text": "Inside the vector database indexing pipeline."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Guardrails are best implemented as a middleware or proxy layer in the application architecture. This allows checking inputs for toxicity, prompt injection, or PII before inference, and checking outputs for hallucination, policy compliance, or format validity before rendering."
  },
  {
    "skillCode": "llm-genai",
    "questionText": "How does KV (Key-Value) caching impact the latency and memory profile of autoregressive LLM text generation?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "It stores computed keys and values for previous tokens to avoid recomputing them at every generation step, speeding up inference at the cost of higher memory usage."
      },
      {
        "id": "opt2",
        "text": "It caches model weights on disk to reduce network bandwidth during fine-tuning."
      },
      {
        "id": "opt3",
        "text": "It compresses the context window into a fixed vector, reducing memory usage but destroying long-range dependencies."
      },
      {
        "id": "opt4",
        "text": "It eliminates the need for prompt tokens by pre-calculating all possible outputs."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "KV caching is essential for efficient autoregressive generation. By saving the attention keys and values of processed tokens, the model doesn't need to re-run self-attention over the entire historical sequence for every new generated token, drastically reducing compute latency."
  },
  {
    "skillCode": "llm-genai",
    "questionText": "What is the primary architectural limitation of standard Transformer context windows that techniques like Ring Attention, FlashAttention, or state-space models (e.g., Mamba) attempt to solve?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Quadratic $O(N^2)$ time and memory complexity of the self-attention mechanism relative to sequence length $N$."
      },
      {
        "id": "opt2",
        "text": "The inability of neural networks to process floating-point numbers accurately."
      },
      {
        "id": "opt3",
        "text": "Lack of support for multi-language tokenizers."
      },
      {
        "id": "opt4",
        "text": "Inability to perform backpropagation through time during pre-training."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "Standard self-attention scales quadratically $O(N^2)$ in both memory and compute with respect to the sequence length $N$. This makes extremely long context windows computationally prohibitive without optimizations like FlashAttention, sparse attention, or alternative architectures."
  },
  {
    "skillCode": "llm-genai",
    "questionText": "When building an agentic LLM workflow that relies on tool use (function calling), what is a key architectural risk regarding model-generated arguments?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Models may hallucinate malformed arguments, type mismatches, or invalid parameters that break external API contracts, requiring strict schema validation and error-handling loops."
      },
      {
        "id": "opt2",
        "text": "Tool use bypasses all prompt injection guardrails automatically."
      },
      {
        "id": "opt3",
        "text": "Function calling reduces the context window to zero tokens."
      },
      {
        "id": "opt4",
        "text": "APIs called by agents cannot return JSON responses."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "LLMs generating function arguments can occasionally hallucinate parameter names, pass wrong data types, or fail schema validation. Robust agent systems require runtime validation, feedback loops to let the LLM correct its own tool calls, and secure execution sandboxes."
  },
  {
    "skillCode": "rag-vector",
    "questionText": "What is the primary purpose of text chunking in a Retrieval-Augmented Generation (RAG) pipeline?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "To reduce the file size of documents before uploading them to cloud storage."
      },
      {
        "id": "opt2",
        "text": "To fit within LLM context windows and ensure embeddings capture specific, granular semantic context."
      },
      {
        "id": "opt3",
        "text": "To encrypt sensitive data prior to vectorization."
      },
      {
        "id": "opt4",
        "text": "To convert unstructured text directly into relational SQL tables."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Chunking breaks large documents into smaller segments. This ensures that vector embeddings focus on distinct semantic concepts rather than getting diluted over huge passages, and it keeps retrieved context well within the token limits of the LLM."
  },
  {
    "skillCode": "rag-vector",
    "questionText": "Which distance metric is most commonly used for normalized embeddings (e.g., when vectors have a length of 1) to measure semantic similarity?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "Euclidean Distance (L2)"
      },
      {
        "id": "opt2",
        "text": "Manhattan Distance"
      },
      {
        "id": "opt3",
        "text": "Cosine Similarity"
      },
      {
        "id": "opt4",
        "text": "Hamming Distance"
      }
    ],
    "correctAnswers": [
      "opt3"
    ],
    "explanation": "Cosine similarity measures the angle between two vectors, making it ideal for semantic similarity. When vectors are L2-normalized, cosine similarity is mathematically equivalent to dot product and closely tracks Euclidean distance rankings."
  },
  {
    "skillCode": "rag-vector",
    "questionText": "In pgvector, how do you typically define a column to store 1536-dimensional float vector embeddings?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "VECTOR(1536)"
      },
      {
        "id": "opt2",
        "text": "ARRAY[1536] OF FLOAT"
      },
      {
        "id": "opt3",
        "text": "BLOB(1536)"
      },
      {
        "id": "opt4",
        "text": "JSONB"
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "The pgvector extension provides a native data type called vector. You define a column as `vector(1536)` to store fixed-length floating-point embeddings."
  },
  {
    "skillCode": "rag-vector",
    "questionText": "Which of the following factors should be considered when designing a chunking strategy for RAG? (Select all that apply)",
    "type": "multi_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "The typical length and structure of the source documents (e.g., markdown headers, paragraphs)."
      },
      {
        "id": "opt2",
        "text": "The maximum input context window and token limits of the target LLM."
      },
      {
        "id": "opt3",
        "text": "The embedding model's optimal input sequence length performance."
      },
      {
        "id": "opt4",
        "text": "Ensuring every single chunk is exactly one character long for maximum indexing speed."
      }
    ],
    "correctAnswers": [
      "opt1",
      "opt2",
      "opt3"
    ],
    "explanation": "Effective chunking balances document structural boundaries (like paragraphs or headers), the embedding model's constraints, and the LLM's context window. Option 4 is incorrect because 1-character chunks destroy semantic meaning."
  },
  {
    "skillCode": "rag-vector",
    "questionText": "What is the primary role of an approximate nearest neighbor (ANN) index like HNSW (Hierarchical Navigable Small World) in vector databases?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "To compress vector dimensions from 1536 down to 2 to allow visual rendering."
      },
      {
        "id": "opt2",
        "text": "To trade a tiny amount of search accuracy for massive speedups compared to exact k-NN linear scans."
      },
      {
        "id": "opt3",
        "text": "To automatically generate embeddings from raw PDF files without using an external API."
      },
      {
        "id": "opt4",
        "text": "To encrypt vectors at rest using homomorphic encryption."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Exact nearest neighbor search requires comparing the query vector against every stored vector (O(N)), which does not scale. ANN indexes like HNSW build graph structures to quickly traverse and find near-matches in logarithmic or sub-linear time."
  },
  {
    "skillCode": "rag-vector",
    "questionText": "What does hybrid search in the context of advanced RAG systems typically combine?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Dense vector semantic search and sparse keyword-based search (e.g., BM25)."
      },
      {
        "id": "opt2",
        "text": "CPU-based vector search and GPU-based deep learning training."
      },
      {
        "id": "opt3",
        "text": "Synchronous SQL queries and asynchronous NoSQL cache lookups."
      },
      {
        "id": "opt4",
        "text": "Prompt engineering and fine-tuning weights simultaneously."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "Hybrid search combines the semantic understanding of dense vector embeddings with the exact keyword matching precision of sparse retrieval algorithms like BM25, often merged using techniques like Reciprocal Rank Fusion (RRF)."
  },
  {
    "skillCode": "rag-vector",
    "questionText": "When implementing metadata filtering alongside vector search in pgvector, which approach is generally most performant for high-cardinality metadata columns?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Filtering out matching rows using a Python script after fetching all vectors from the database."
      },
      {
        "id": "opt2",
        "text": "Creating standard B-tree or GIN indexes on the metadata columns alongside the vector index."
      },
      {
        "id": "opt3",
        "text": "Storing all metadata as unindexed plain text strings concatenated inside the vector blob."
      },
      {
        "id": "opt4",
        "text": "Dropping the vector index entirely and performing sequential scans for every filtered query."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Combining relational B-tree or GIN indexes for metadata filters with pgvector operators allows PostgreSQL's query planner to narrow down the candidate set efficiently before or during vector distance calculations."
  },
  {
    "skillCode": "rag-vector",
    "questionText": "In pgvector, IVFFlat (Inverted File with Flat quantization) indexes require the index to be built AFTER the initial table has been populated with a representative sample of data.",
    "type": "true_false",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "True"
      },
      {
        "id": "opt2",
        "text": "False"
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "True. IVFFlat clusters the vectors into lists using k-means based on the data present at the time of index creation. If you build an IVFFlat index on an empty table, the clusters will be empty or unrepresentative, leading to extremely poor recall."
  },
  {
    "skillCode": "rag-vector",
    "questionText": "What is the primary benefit of using Sentence-Window Retrieval or Parent-Child chunking strategies in advanced RAG?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "It reduces the embedding dimension size to save disk space."
      },
      {
        "id": "opt2",
        "text": "It allows matching on small, highly specific chunks for precision, while passing larger surrounding context to the LLM."
      },
      {
        "id": "opt3",
        "text": "It completely eliminates the need for vector databases by relying purely on regex matching."
      },
      {
        "id": "opt4",
        "text": "It guarantees zero hallucinations from the language model."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Small chunks are great for pinpointing exact semantic matches in vector space, but they might lack broader context. Parent-child or sentence-window strategies retrieve the small precise chunk for similarity search, but feed a larger parent context block to the LLM for generation."
  },
  {
    "skillCode": "rag-vector",
    "questionText": "When tuning an HNSW index in pgvector, what is the trade-off controlled by parameters like `ef_search` and `m`?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Trade-off between database storage size and network bandwidth consumption."
      },
      {
        "id": "opt2",
        "text": "Trade-off between query search speed/recall accuracy and index build time/memory consumption."
      },
      {
        "id": "opt3",
        "text": "Trade-off between embedding generation speed and API cost."
      },
      {
        "id": "opt4",
        "text": "Trade-off between SSL encryption strength and query latency."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Parameter `m` (max connections per node) and `ef_construction`/`ef_search` control the density and exploration depth of the HNSW graph. Higher values improve recall accuracy at the cost of slower query/build times and higher memory/disk overhead."
  },
  {
    "skillCode": "pytorch-tf",
    "questionText": "What is the primary purpose of the backpropagation algorithm in neural network training?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "To compute the gradient of the loss function with respect to each weight using the chain rule."
      },
      {
        "id": "opt2",
        "text": "To initialize the model weights randomly before training begins."
      },
      {
        "id": "opt3",
        "text": "To normalize the input data to have zero mean and unit variance."
      },
      {
        "id": "opt4",
        "text": "To determine the optimal batch size for stochastic gradient descent."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "Backpropagation applies the chain rule of calculus recursively through the layers of the network to efficiently calculate gradients of the loss with respect to all parameters, enabling gradient-based optimizers to update them."
  },
  {
    "skillCode": "pytorch-tf",
    "questionText": "In PyTorch, what is the default behavior of `optimizer.zero_grad()` and why is it necessary before calling `loss.backward()`?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "It deletes the model weights to free up memory."
      },
      {
        "id": "opt2",
        "text": "It clears accumulated gradients from the previous batch, as PyTorch accumulates gradients by default."
      },
      {
        "id": "opt3",
        "text": "It resets the learning rate scheduler to its initial value."
      },
      {
        "id": "opt4",
        "text": "It sets the bias terms of all linear layers to zero."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "PyTorch accumulates gradients on subsequent backward passes by default. If `zero_grad()` is not called, new gradients would be added to the old ones, leading to incorrect and inflated weight updates."
  },
  {
    "skillCode": "pytorch-tf",
    "questionText": "Which of the following activation functions suffers from the 'dying ReLU' problem, where neurons permanently output zero for all negative inputs?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "Sigmoid"
      },
      {
        "id": "opt2",
        "text": "Leaky ReLU"
      },
      {
        "id": "opt3",
        "text": "ReLU (Rectified Linear Unit)"
      },
      {
        "id": "opt4",
        "text": "GELU (Gaussian Error Linear Unit)"
      }
    ],
    "correctAnswers": [
      "opt3"
    ],
    "explanation": "Standard ReLU outputs zero for any negative input. If a large gradient flows through a ReLU neuron and updates the weights such that the neuron is always inactive for all inputs in the dataset, the gradient becomes zero, and the neuron never recovers—this is the dying ReLU problem."
  },
  {
    "skillCode": "pytorch-tf",
    "questionText": "When fine-tuning a pre-trained transformer model for a new classification task, which practices are commonly applied? (Select all that apply)",
    "type": "multi_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Replacing or modifying the final classification head to match the number of target classes."
      },
      {
        "id": "opt2",
        "text": "Using differential learning rates, applying lower learning rates to earlier layers and higher rates to the classification head."
      },
      {
        "id": "opt3",
        "text": "Freezing all layers permanently so that no weights in the transformer backbone are ever updated."
      },
      {
        "id": "opt4",
        "text": "Adding dropout to prevent overfitting on smaller downstream datasets."
      }
    ],
    "correctAnswers": [
      "opt1",
      "opt2",
      "opt4"
    ],
    "explanation": "Fine-tuning typically involves adapting the task-specific head (opt1), utilizing differential learning rates to preserve pre-trained features in early layers while adapting later ones (opt2), and incorporating dropout for regularization (opt4). Completely freezing all layers (opt3) is feature extraction, not fine-tuning."
  },
  {
    "skillCode": "pytorch-tf",
    "questionText": "What is the primary role of the Scaling factor (divided by $\\sqrt{d_k}$) in the Scaled Dot-Product Attention formula within Transformer architectures?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "To prevent vanishing gradients in deep feed-forward layers."
      },
      {
        "id": "opt2",
        "text": "To prevent the dot products from growing large in magnitude, which pushes the softmax function into regions with extremely small gradients."
      },
      {
        "id": "opt3",
        "text": "To normalize the input sequence length across different batch elements."
      },
      {
        "id": "opt4",
        "text": "To ensure positive values before applying the key-query multiplication."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "When dimensionality $d_k$ is large, the dot products grow large in magnitude, pushing the softmax function into areas with very small gradients (vanishing gradients). Dividing by $\\sqrt{d_k}$ counteracts this effect."
  },
  {
    "skillCode": "pytorch-tf",
    "questionText": "In PyTorch, what is the purpose of using `torch.cuda.amp` (Automatic Mixed Precision) during model training?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "To automatically convert all model weights to 64-bit floating point precision for higher accuracy."
      },
      {
        "id": "opt2",
        "text": "To combine single-precision (FP32) and half-precision (FP16) floats, reducing memory consumption and speeding up training on compatible GPUs without sacrificing convergence."
      },
      {
        "id": "opt3",
        "text": "To automatically parallelize data loading across multiple CPU cores."
      },
      {
        "id": "opt4",
        "text": "To prune inactive weights and compress the model size post-training."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Automatic Mixed Precision (AMP) uses FP16 for operations that benefit from tensor cores and FP32 for operations requiring high numerical stability, drastically reducing memory usage and training time on modern GPUs."
  },
  {
    "skillCode": "pytorch-tf",
    "questionText": "When implementing multi-head attention, why does the model project queries, keys, and values into multiple lower-dimensional subspaces rather than performing a single attention function with full dimensionality?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "It allows the model to jointly attend to information from different representation subspaces at different positions simultaneously."
      },
      {
        "id": "opt2",
        "text": "It eliminates the need for positional encodings in transformer models."
      },
      {
        "id": "opt3",
        "text": "It guarantees that the attention matrix will be strictly sparse."
      },
      {
        "id": "opt4",
        "text": "It is solely a computational trick to reduce overall parameter count compared to single-head attention."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "Multi-head attention allows the model to focus on different types of relationships (e.g., syntactic vs. semantic) at different positions by looking at projections in different representation subspaces."
  },
  {
    "skillCode": "pytorch-tf",
    "questionText": "True or False: In PyTorch, calling `model.eval()` disables gradient calculation globally across the entire program execution.",
    "type": "true_false",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "True"
      },
      {
        "id": "opt2",
        "text": "False"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "False. `model.eval()` only sets specific layers like Dropout and BatchNorm to evaluation mode. It does not disable gradient tracking. Gradient tracking is controlled via context managers like `torch.no_grad()`."
  },
  {
    "skillCode": "pytorch-tf",
    "questionText": "Which of the following mechanisms or techniques are commonly used to mitigate gradient explosion in Recurrent Neural Networks (RNNs) or deep networks?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Gradient Clipping"
      },
      {
        "id": "opt2",
        "text": "Increasing the learning rate exponentially"
      },
      {
        "id": "opt3",
        "text": "Removing all activation functions"
      },
      {
        "id": "opt4",
        "text": "Using L1 weight regularization exclusively"
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "Gradient clipping scales down gradients that exceed a specific threshold norm during backpropagation, effectively preventing gradient explosion, which is a common issue in RNNs and deep architectures."
  },
  {
    "skillCode": "pytorch-tf",
    "questionText": "What is the primary architectural difference between Encoder-only models (like BERT), Decoder-only models (like GPT), and Encoder-Decoder models (like T5)?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Encoder-only models use bidirectional attention masks, decoder-only models use causal (masked) attention, and encoder-decoder models use both along with cross-attention."
      },
      {
        "id": "opt2",
        "text": "Encoder-only models cannot process token sequences longer than 512 tokens, whereas decoders have infinite context."
      },
      {
        "id": "opt3",
        "text": "Decoder-only models do not use positional encodings, relying entirely on convolutional layers."
      },
      {
        "id": "opt4",
        "text": "Encoder-decoder models are restricted to computer vision tasks, while encoder and decoder models are exclusively for NLP."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "BERT uses bidirectional self-attention suitable for understanding context. GPT uses causal masking so tokens cannot attend to future tokens (autoregressive generation). Encoder-decoder models encode the input bidirectionally and use cross-attention in the decoder to generate outputs."
  },
  {
    "skillCode": "appsec-owasp",
    "questionText": "What is the primary defense mechanism recommended by OWASP to prevent SQL Injection vulnerabilities in database queries?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "Using client-side JavaScript validation to strip out single quotes."
      },
      {
        "id": "opt2",
        "text": "Using parameterized queries (prepared statements)."
      },
      {
        "id": "opt3",
        "text": "Encoding all database output using HTML entity encoding."
      },
      {
        "id": "opt4",
        "text": "Relying on stored procedures without input parameters."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Parameterized queries ensure that user input is treated strictly as data, never as executable code, completely neutralizing SQL injection. Client-side validation can be bypassed, HTML encoding defends against XSS (not SQLi), and unsecured stored procedures can still be vulnerable if they dynamically concatenate input."
  },
  {
    "skillCode": "appsec-owasp",
    "questionText": "Which type of Cross-Site Scripting (XSS) occurs when malicious script is injected into the server, stored in a database, and later served to other users?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "Reflected XSS"
      },
      {
        "id": "opt2",
        "text": "DOM-based XSS"
      },
      {
        "id": "opt3",
        "text": "Stored (Persistent) XSS"
      },
      {
        "id": "opt4",
        "text": "Blind XSS"
      }
    ],
    "correctAnswers": [
      "opt3"
    ],
    "explanation": "Stored (or Persistent) XSS happens when untrusted user input is saved permanently on a backend store (like a database or comment section) and then rendered to unsuspecting victims. Reflected XSS requires the payload to be part of an immediate request/response, and DOM-based XSS happens entirely in the client-side code execution."
  },
  {
    "skillCode": "appsec-owasp",
    "questionText": "True or False: Using the HTTP POST method instead of GET automatically protects an application against Cross-Site Request Forgery (CSRF).",
    "type": "true_false",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "True"
      },
      {
        "id": "opt2",
        "text": "False"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "False. While many simple CSRF examples use GET requests, an attacker can easily craft a malicious HTML form that automatically submits a POST request using JavaScript (or via standard form submission) from a victim's browser to the target site."
  },
  {
    "skillCode": "appsec-owasp",
    "questionText": "Which of the following practices effectively help mitigate Broken Access Control vulnerabilities? (Select all that apply)",
    "type": "multi_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Enforcing principle of least privilege for database accounts and application roles."
      },
      {
        "id": "opt2",
        "text": "Implementing server-side checks for every request to ensure the user owns or has access to the requested resource (IDOR protection)."
      },
      {
        "id": "opt3",
        "text": "Hiding admin UI elements via CSS and JavaScript for non-admin users."
      },
      {
        "id": "opt4",
        "text": "Disabling directory listing on the web server."
      }
    ],
    "correctAnswers": [
      "opt1",
      "opt2",
      "opt4"
    ],
    "explanation": "Options 1, 2, and 4 are valid security controls. Least privilege limits damage, server-side authorization stops IDOR, and disabling directory listing prevents unauthorized file discovery. Option 3 is security-by-obscurity; hidden UI elements can still be accessed directly via API endpoints if backend checks are missing."
  },
  {
    "skillCode": "appsec-owasp",
    "questionText": "How does an application properly protect against Cross-Site Request Forgery (CSRF) for state-changing operations?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Requiring all requests to use HTTPS."
      },
      {
        "id": "opt2",
        "text": "Implementing a unique, unpredictable Anti-CSRF token per user session that is validated on state-changing requests."
      },
      {
        "id": "opt3",
        "text": "Checking the HTTP Referer header exclusively."
      },
      {
        "id": "opt4",
        "text": "Setting all cookies with the 'HttpOnly' flag."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Anti-CSRF tokens (Synchronizer Token Pattern) ensure that the application expects a specific secret token generated for the user's session, which a third-party malicious site cannot read or forge. HTTPS secures transport, Referer headers can be spoofed or stripped, and HttpOnly protects cookies against XSS, not CSRF."
  },
  {
    "skillCode": "appsec-owasp",
    "questionText": "An application reads a serialized object from an untrusted user input stream and deserializes it without validation, leading to Remote Code Execution (RCE). What OWASP Top 10 vulnerability category does this represent?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Broken Authentication"
      },
      {
        "id": "opt2",
        "text": "Insecure Deserialization"
      },
      {
        "id": "opt3",
        "text": "Server-Side Request Forgery (SSRF)"
      },
      {
        "id": "opt4",
        "text": "Security Misconfiguration"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Insecure Deserialization occurs when untrusted data is used to abuse the logic of an application, often resulting in remote code execution, privilege escalation, or injection attacks when objects are reconstructed from serialized data formats."
  },
  {
    "skillCode": "appsec-owasp",
    "questionText": "When implementing JSON Web Tokens (JWT) for session management, which configuration oversight introduces a critical vulnerability allowing attackers to forge arbitrary tokens?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Failing to set the 'exp' (expiration) claim."
      },
      {
        "id": "opt2",
        "text": "Accepting the 'none' algorithm or improperly validating asymmetric public/private keys (e.g., treating an HMAC secret as an RSA public key)."
      },
      {
        "id": "opt3",
        "text": "Storing the JWT in local storage instead of HttpOnly cookies."
      },
      {
        "id": "opt4",
        "text": "Using HS256 algorithm with a strong 256-bit secret."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Accepting the 'none' algorithm or misinterpreting public keys as HMAC secrets allows attackers to craft their own valid signatures and impersonate any user. While local storage (opt3) and missing expiration (opt1) are risks, key/algorithm confusion (opt2) directly compromises cryptographic signature verification."
  },
  {
    "skillCode": "appsec-owasp",
    "questionText": "What is Server-Side Request Forgery (SSRF), and how can developers mitigate it?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "An attack where a client executes arbitrary scripts in the browser; mitigated by Content Security Policy (CSP)."
      },
      {
        "id": "opt2",
        "text": "A vulnerability where an attacker forces the server to make outgoing HTTP requests to internal or unintended external systems; mitigated by whitelisting permitted domains/IPs and disabling unnecessary URL schemas."
      },
      {
        "id": "opt3",
        "text": "An issue where database queries leak records; mitigated by parameterized statements."
      },
      {
        "id": "opt4",
        "text": "An access control bug where users read files outside the web root; mitigated by path normalization."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "SSRF occurs when an application fetches a remote resource without validating the user-supplied URL, enabling attackers to target internal services (like cloud metadata APIs). Mitigation requires robust input validation, strict URL whitelisting, and blocking internal IP ranges."
  },
  {
    "skillCode": "appsec-owasp",
    "questionText": "Which design pattern or technique is most effective for preventing XML External Entity (XXE) injection vulnerabilities when parsing XML documents?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Disabling DTDs (Document Type Definitions) and external entity resolution in the XML parser configuration."
      },
      {
        "id": "opt2",
        "text": "Applying HTML entity encoding to the XML payload before parsing."
      },
      {
        "id": "opt3",
        "text": "Enabling XInclude processing in the parser."
      },
      {
        "id": "opt4",
        "text": "Wrapping all XML inputs in CDATA sections."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "XXE happens when XML parsers evaluate external entities within DTDs. Disabling DTDs and external entity resolution completely prevents the parser from fetching external files or triggering internal requests. HTML encoding or CDATA sections do not stop XML parser entity expansion."
  },
  {
    "skillCode": "appsec-owasp",
    "questionText": "An enterprise web application suffers from persistent prototype pollution in its Node.js backend because deeply nested JSON payloads modify the `Object.prototype`. What is the most robust defense against this vulnerability?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Use JSON.parse instead of eval when parsing incoming requests."
      },
      {
        "id": "opt2",
        "text": "Freeze the prototype object using `Object.freeze(Object.prototype)`, sanitize keys to reject '__proto__', 'constructor', and 'prototype', or use null-prototype objects (`Object.create(null)`)."
      },
      {
        "id": "opt3",
        "text": "Upgrade the database driver to the latest secure version."
      },
      {
        "id": "opt4",
        "text": "Implement rate limiting on all API endpoints to prevent heavy nested payloads."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Prototype pollution in JavaScript occurs when untrusted input recursively merges properties into existing objects, contaminating `Object.prototype`. Freezing prototypes, blocking dangerous keys (`__proto__`), or utilizing null-prototype objects prevents property injection."
  },
  {
    "skillCode": "auth-iam",
    "questionText": "What is the primary difference between Authentication and Authorization?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "Authentication verifies who you are, while authorization determines what you can access."
      },
      {
        "id": "opt2",
        "text": "Authentication happens after authorization in every web request."
      },
      {
        "id": "opt3",
        "text": "Authorization is handled by the client, whereas authentication is handled by the server."
      },
      {
        "id": "opt4",
        "text": "There is no difference; they are interchangeable terms in modern web security."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "Authentication (AuthN) establishes the identity of a user (e.g., logging in with credentials), while Authorization (AuthZ) verifies what specific resources or actions the authenticated user is permitted to access."
  },
  {
    "skillCode": "auth-iam",
    "questionText": "Which protocol layer does OpenID Connect (OIDC) operate on top of?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "OAuth 1.0a"
      },
      {
        "id": "opt2",
        "text": "OAuth 2.0"
      },
      {
        "id": "opt3",
        "text": "SAML 2.0"
      },
      {
        "id": "opt4",
        "text": "LDAP"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "OpenID Connect (OIDC) is an identity layer built on top of the OAuth 2.0 protocol, adding standard authentication mechanisms and identity tokens (JWTs)."
  },
  {
    "skillCode": "auth-iam",
    "questionText": "In Zero Trust Architecture, implicit trust is granted based on the user's location inside the corporate network perimeter.",
    "type": "true_false",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "True"
      },
      {
        "id": "opt2",
        "text": "False"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Zero Trust Architecture operates on the principle of 'Never trust, always verify'. No user or device is trusted implicitly, regardless of whether they are inside or outside the corporate network perimeter."
  },
  {
    "skillCode": "auth-iam",
    "questionText": "Why is PKCE (Proof Key for Code Exchange) mandatory for public clients like Single Page Applications (SPAs) or mobile apps using OAuth 2.0?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "It encrypts the access token payload during transmission over HTTPS."
      },
      {
        "id": "opt2",
        "text": "It prevents authorization code interception attacks where client secrets cannot be securely stored."
      },
      {
        "id": "opt3",
        "text": "It replaces the need for secure cookies by storing tokens directly in local storage."
      },
      {
        "id": "opt4",
        "text": "It automatically revokes refresh tokens when a user closes their browser."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Public clients cannot securely maintain a client secret. PKCE introduces a dynamic verifier and challenge created per transaction to protect the authorization code from being intercepted and replayed maliciously."
  },
  {
    "skillCode": "auth-iam",
    "questionText": "Which security attributes are crucial when configuring a sensitive authentication cookie in a modern web application?",
    "type": "multi_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "HttpOnly"
      },
      {
        "id": "opt2",
        "text": "Secure"
      },
      {
        "id": "opt3",
        "text": "SameSite=Strict or SameSite=Lax"
      },
      {
        "id": "opt4",
        "text": "Domain=*"
      }
    ],
    "correctAnswers": [
      "opt1",
      "opt2",
      "opt3"
    ],
    "explanation": "HttpOnly prevents client-side script access (mitigating XSS theft), Secure ensures transmission only over HTTPS, and SameSite protects against Cross-Site Request Forgery (CSRF). Setting Domain=* is dangerous as it allows broad subdomain access."
  },
  {
    "skillCode": "auth-iam",
    "questionText": "When validating a JSON Web Token (JWT) on a resource server, which steps are strictly required to ensure token integrity and authenticity?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Only check the expiration time ('exp') claim."
      },
      {
        "id": "opt2",
        "text": "Decode the payload using base64 and verify the user ID exists in the database."
      },
      {
        "id": "opt3",
        "text": "Verify the cryptographic signature using the correct public key or secret, and validate standard claims like 'exp', 'nbf', 'iss', and 'aud'."
      },
      {
        "id": "opt4",
        "text": "Check that the token length is exactly 128 characters and contains at least two periods."
      }
    ],
    "correctAnswers": [
      "opt3"
    ],
    "explanation": "Cryptographic signature verification ensures the token has not been tampered with. Additionally, standard claims like expiration ('exp'), not-before ('nbf'), issuer ('iss'), and audience ('aud') must be checked to prevent expired or misrouted token misuse."
  },
  {
    "skillCode": "auth-iam",
    "questionText": "In a Role-Based Access Control (RBAC) system, what is the primary benefit of introducing permissions separate from roles?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "It reduces the total number of database tables required."
      },
      {
        "id": "opt2",
        "text": "It provides granular control, preventing role explosion by allowing multiple roles to share or combine specific fine-grained permissions."
      },
      {
        "id": "opt3",
        "text": "It eliminates the need for JWT verification on downstream microservices."
      },
      {
        "id": "opt4",
        "text": "It automatically encrypts user passwords using bcrypt."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Decoupling permissions from roles allows administrators to assign granular privileges to roles without creating a distinct role for every unique combination of access needs, thereby avoiding 'role explosion'."
  },
  {
    "skillCode": "auth-iam",
    "questionText": "An attacker manages to inject 'alg': 'none' into the header of a JWT sent to a vulnerable backend server. What vulnerability are they likely exploiting?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "SQL Injection in the token validation pipeline"
      },
      {
        "id": "opt2",
        "text": "Signature exclusion bypass, tricking the server into accepting an unsigned token"
      },
      {
        "id": "opt3",
        "text": "Cross-Site Scripting via local storage"
      },
      {
        "id": "opt4",
        "text": "JWT expiration bypass via time manipulation"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Some poorly configured JWT libraries historically honored 'alg': 'none', which instructs the validator to skip signature verification entirely, allowing attackers to forge arbitrary token payloads."
  },
  {
    "skillCode": "auth-iam",
    "questionText": "How does mutual TLS (mTLS) reinforce Zero Trust Identity at the service-to-service communication layer?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "It ensures that both the client service and server service cryptographically authenticate each other using certificates."
      },
      {
        "id": "opt2",
        "text": "It replaces OAuth tokens entirely by caching user credentials in memory."
      },
      {
        "id": "opt3",
        "text": "It compresses the JWT payload to improve network latency across microservices."
      },
      {
        "id": "opt4",
        "text": "It automatically generates public-private key pairs for end-users upon login."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "mTLS guarantees that not only does the client verify the server's identity (standard TLS), but the server also cryptographically verifies the client service's X.509 certificate, ensuring robust identity verification in Zero Trust networks."
  },
  {
    "skillCode": "auth-iam",
    "questionText": "When implementing token revocation for stateless JWTs in a distributed microservices architecture, which architectural pattern is commonly used to handle immediate invalidation?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Re-signing all tokens across every service simultaneously via a cron job."
      },
      {
        "id": "opt2",
        "text": "Utilizing a distributed cache or blacklist (such as Redis) checked during token validation, or issuing short-lived access tokens with long-lived refresh token rotation."
      },
      {
        "id": "opt3",
        "text": "Storing all active user sessions inside client-side local storage."
      },
      {
        "id": "opt4",
        "text": "Disabling signature verification to improve token lookup speed."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Because standard JWTs are stateless and cannot be recalled once signed, immediate revocation requires either maintaining a fast lookup blacklist (e.g., in Redis) or keeping access token lifespans very short combined with secure refresh token rotation."
  },
  {
    "skillCode": "netsec-threat",
    "questionText": "What is the primary purpose of TLS/SSL termination at a load balancer or reverse proxy?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "To permanently disable encryption for internal backend servers."
      },
      {
        "id": "opt2",
        "text": "To decrypt incoming encrypted traffic so backend servers can process plain HTTP requests, reducing their CPU overhead."
      },
      {
        "id": "opt3",
        "text": "To prevent distributed denial-of-service attacks by blocking bad IP addresses."
      },
      {
        "id": "opt4",
        "text": "To enforce Cross-Origin Resource Sharing policies for API clients."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "TLS termination involves decrypting incoming HTTPS traffic at the edge (load balancer/proxy) so backend servers don't spend valuable CPU cycles on cryptographic operations. Option 1 is incorrect because internal traffic can still be re-encrypted (TLS bridging). Options 3 and 4 describe DDoS and CORS, which are separate security controls."
  },
  {
    "skillCode": "netsec-threat",
    "questionText": "Which HTTP response header explicitly dictates which origins are permitted to access resources in a cross-origin request?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "X-Frame-Options"
      },
      {
        "id": "opt2",
        "text": "Access-Control-Allow-Origin"
      },
      {
        "id": "opt3",
        "text": "Content-Security-Policy"
      },
      {
        "id": "opt4",
        "text": "Strict-Transport-Security"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Access-Control-Allow-Origin is the core CORS header used by servers to specify which origin(s) are authorized to read the response. X-Frame-Options prevents clickjacking, CSP mitigates XSS, and HSTS enforces HTTPS."
  },
  {
    "skillCode": "netsec-threat",
    "questionText": "True or False: A standard rate-limiting mechanism based solely on the client's source IP address is completely immune to abuse if the application sits behind a shared corporate NAT network.",
    "type": "true_false",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "True"
      },
      {
        "id": "opt2",
        "text": "False"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "False. Relying solely on source IP rate limiting behind a shared NAT (like an entire corporate office or university network) can cause legitimate users to be unfairly blocked when others exceed limits, and it fails to stop distributed botnets utilizing thousands of distinct IPs."
  },
  {
    "skillCode": "netsec-threat",
    "questionText": "When configuring TLS termination, what security implication arises if the connection between the load balancer and the internal backend servers is left unencrypted (plain HTTP)?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "CORS policies will automatically fail in the browser."
      },
      {
        "id": "opt2",
        "text": "Traffic is vulnerable to sniffing or eavesdropping if an attacker compromises the internal private network segment."
      },
      {
        "id": "opt3",
        "text": "Rate-limiting rules will no longer apply to API endpoints."
      },
      {
        "id": "opt4",
        "text": "The client browser will display a mixed content warning."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Decoupling TLS at the load balancer leaves internal traffic in plain text. If an attacker gains a foothold inside the internal network, they can easily sniff sensitive data (such as passwords or tokens). Browsers show mixed content warnings when a secure page loads subresources over HTTP, not due to internal backend transport."
  },
  {
    "skillCode": "netsec-threat",
    "questionText": "Which of the following scenarios correctly describes the purpose and behavior of a CORS preflight request?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "An HTTP GET request sent automatically by the browser to fetch the SSL certificate chain before establishing a WebSocket."
      },
      {
        "id": "opt2",
        "text": "An HTTP OPTIONS request sent by the browser prior to a non-simple cross-origin request to verify if the server permits the actual method and headers."
      },
      {
        "id": "opt3",
        "text": "A specialized DDoS mitigation challenge sent to verify if the client is a human or a script."
      },
      {
        "id": "opt4",
        "text": "A token validation request sent to an OAuth provider before rendering a Single Page Application."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "A CORS preflight request uses the HTTP OPTIONS method to ask the server whether it allows the upcoming cross-origin request (especially if it uses custom headers or methods like PUT/DELETE), protecting servers from unauthorized actions."
  },
  {
    "skillCode": "netsec-threat",
    "questionText": "When implementing a robust API rate-limiting strategy using a distributed cache like Redis, which algorithms are commonly deployed to handle burst traffic gracefully? (Select all that apply)",
    "type": "multi_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Token Bucket"
      },
      {
        "id": "opt2",
        "text": "Leaky Bucket"
      },
      {
        "id": "opt3",
        "text": "Random Exponential Backoff"
      },
      {
        "id": "opt4",
        "text": "Fixed Window Counter"
      }
    ],
    "correctAnswers": [
      "opt1",
      "opt2"
    ],
    "explanation": "Token Bucket and Leaky Bucket algorithms are designed to handle bursts smoothly. Token Bucket allows bursts up to a predefined capacity, whereas Leaky Bucket smooths out spikes into a steady processing rate. Fixed Window counters suffer from edge-case race conditions (spikes at window boundaries)."
  },
  {
    "skillCode": "netsec-threat",
    "questionText": "In the context of DDoS mitigation, what differentiates a Layer 7 (Application Layer) attack from a Layer 3/4 (Network/Transport Layer) volumetric attack?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Layer 7 attacks target specific high-cost application endpoints (e.g., login or search queries) using seemingly valid HTTP requests, making them harder to distinguish from legitimate traffic."
      },
      {
        "id": "opt2",
        "text": "Layer 7 attacks rely exclusively on raw UDP packet amplification to exhaust upstream bandwidth."
      },
      {
        "id": "opt3",
        "text": "Layer 3/4 attacks can only be mitigated using browser-based JavaScript challenges."
      },
      {
        "id": "opt4",
        "text": "Layer 7 attacks do not require any server CPU resources to process."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "Layer 7 attacks mimic real user behavior to consume application resources (like database connections or compute), whereas Layer 3/4 attacks focus on overwhelming network bandwidth or connection tables with raw packets (SYN floods, UDP floods)."
  },
  {
    "skillCode": "netsec-threat",
    "questionText": "You notice an API is experiencing heavy credential-stuffing attacks despite standard rate-limiting per IP address. Which advanced mitigation combination is most effective?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Enforce strict CORS policies and enable TLS 1.0 fallback."
      },
      {
        "id": "opt2",
        "text": "Implement behavioral analysis/device fingerprinting, CAPTCHA challenges upon anomalous patterns, and rate-limiting keyed by user account identifiers combined with IP addresses."
      },
      {
        "id": "opt3",
        "text": "Increase the TTL on DNS records to prevent IP rotation."
      },
      {
        "id": "opt4",
        "text": "Disable all HTTP OPTIONS requests to block preflight checks."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Credential-stuffing attackers rotate source IPs rapidly, bypassing IP-only rate limiting. Mitigating this requires combining multi-factor constraints (user account + IP), device/behavioral fingerprinting, and interactive challenges (CAPTCHAs) when risk scores spike."
  },
  {
    "skillCode": "netsec-threat",
    "questionText": "When designing a secure multi-tenant microservices architecture, how should CORS and API Gateway rate-limiting interact?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "CORS headers should be stripped at the API Gateway to prevent browser caching issues, while rate-limiting is handled exclusively in the database layer."
      },
      {
        "id": "opt2",
        "text": "The API Gateway should enforce consistent CORS policies globally or per-route and apply sliding-window rate limiting before forwarding traffic to backend microservices."
      },
      {
        "id": "opt3",
        "text": "Microservices should handle their own CORS policies independently while ignoring gateway-level rate limits."
      },
      {
        "id": "opt4",
        "text": "CORS must only be validated during TLS termination handshakes."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Centralizing CORS enforcement and rate-limiting at the API Gateway ensures uniform security policies across all microservices, protecting internal services from being directly hit by unvalidated or abusive cross-origin traffic."
  },
  {
    "skillCode": "netsec-threat",
    "questionText": "An enterprise web application is targeted by a sophisticated distributed HTTP flood utilizing rotating residential proxies that mimic legitimate user sessions. Which mitigation strategy provides the strongest defense at the edge?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Blocking all incoming traffic originating outside the local geographic region."
      },
      {
        "id": "opt2",
        "text": "Deploying Web Application Firewall (WAF) heuristic analysis, JA3/JA4 TLS fingerprinting, and progressive challenge mechanisms (such as JavaScript/Proof-of-Work challenges)."
      },
      {
        "id": "opt3",
        "text": "Enabling HTTP/1.0 protocol support to simplify request parsing."
      },
      {
        "id": "opt4",
        "text": "Disabling TLS termination to force every client to perform full cryptographic handshakes on every request."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Residential proxy rotation bypasses basic IP blocklists. Advanced defenses rely on TLS client fingerprinting (JA3/JA4) to detect automated toolkits regardless of IP, combined with WAF heuristics and transparent JS/PoW challenges that filter out non-browser traffic."
  },
  {
    "skillCode": "tech-writing",
    "questionText": "What is the primary purpose of an Architectural Decision Record (ADR)?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "To market the system architecture to external stakeholders and investors."
      },
      {
        "id": "opt2",
        "text": "To capture a single architectural decision along with its context and consequences."
      },
      {
        "id": "opt3",
        "text": "To serve as the primary source code documentation for junior developers."
      },
      {
        "id": "opt4",
        "text": "To track daily task assignments and project sprints."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "An ADR is a short, concise document that captures an important architectural decision made along with its context and consequences. It is not for marketing, code-level documentation, or sprint tracking."
  },
  {
    "skillCode": "tech-writing",
    "questionText": "When writing an API documentation reference, which of the following elements are considered essential best practices? (Select all that apply)",
    "type": "multi_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "Providing clear, copy-pasteable request and response payload examples."
      },
      {
        "id": "opt2",
        "text": "Documenting error codes and failure payload structures."
      },
      {
        "id": "opt3",
        "text": "Including the private database connection strings used by the API server."
      },
      {
        "id": "opt4",
        "text": "Specifying authentication and authorization requirements clearly."
      }
    ],
    "correctAnswers": [
      "opt1",
      "opt2",
      "opt4"
    ],
    "explanation": "Good API documentation must include realistic examples, comprehensive error codes, and explicit authentication methods. Including private database connection strings is a major security violation."
  },
  {
    "skillCode": "tech-writing",
    "questionText": "True or False: In a blameless post-mortem, the focus is placed on identifying systemic and process failures rather than assigning individual human blame.",
    "type": "true_false",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "True"
      },
      {
        "id": "opt2",
        "text": "False"
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "A blameless post-mortem assumes everyone did the best job they could given the information they had at the time, shifting focus to process and systemic improvements to prevent recurrence."
  },
  {
    "skillCode": "tech-writing",
    "questionText": "You are writing an RFC (Request for Comments) for a major migration of your database cluster. What is the most effective way to structure the 'Alternatives Considered' section?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "List only the options that were immediately rejected due to being completely impossible."
      },
      {
        "id": "opt2",
        "text": "Omit alternatives entirely to ensure the reader focuses solely on your preferred proposal."
      },
      {
        "id": "opt3",
        "text": "Describe realistic alternative solutions and explicitly state why they were discarded in favor of the proposal."
      },
      {
        "id": "opt4",
        "text": "Ask the readers to vote on which alternative they prefer without providing any context."
      }
    ],
    "correctAnswers": [
      "opt3"
    ],
    "explanation": "The 'Alternatives Considered' section proves due diligence and helps reviewers understand why specific trade-offs were chosen, preventing repetitive questioning during the review phase."
  },
  {
    "skillCode": "tech-writing",
    "questionText": "Which component is typically NOT found in a well-structured technical post-mortem report?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "A detailed timeline of the incident from detection to resolution."
      },
      {
        "id": "opt2",
        "text": "Action items assigned to specific owners to prevent future occurrences."
      },
      {
        "id": "opt3",
        "text": "The personal performance evaluations and disciplinary warnings of the engineers involved."
      },
      {
        "id": "opt4",
        "text": "Root cause analysis (e.g., using the '5 Whys' technique)."
      }
    ],
    "correctAnswers": [
      "opt3"
    ],
    "explanation": "Post-mortems are blameless and focus on system and process failures, not personal performance reviews or disciplinary actions."
  },
  {
    "skillCode": "tech-writing",
    "questionText": "When documenting a public-facing REST API, why is it critical to describe rate-limiting behavior?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "It helps client developers handle 429 Too Many Requests responses and design resilient retry logic."
      },
      {
        "id": "opt2",
        "text": "It prevents developers from writing unit tests for their applications."
      },
      {
        "id": "opt3",
        "text": "It allows clients to bypass firewall restrictions automatically."
      },
      {
        "id": "opt4",
        "text": "It speeds up JSON parsing times on the server side."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "Documenting rate limits and headers (like Retry-After) enables consumers to implement proper backoff and retry strategies, ensuring system stability."
  },
  {
    "skillCode": "tech-writing",
    "questionText": "An engineering team is debating whether to update an existing ADR or create a new superseding ADR when changing a key database design. What is the standard practice?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Delete the original ADR completely so no conflicting history remains."
      },
      {
        "id": "opt2",
        "text": "Overwrite the text of the original ADR in place without leaving a changelog."
      },
      {
        "id": "opt3",
        "text": "Create a new ADR that explicitly marks the old ADR as 'Superceded' and references the new decision."
      },
      {
        "id": "opt4",
        "text": "Maintain the original ADR indefinitely without referencing the new changes, relying on tribal knowledge."
      }
    ],
    "correctAnswers": [
      "opt3"
    ],
    "explanation": "ADRs are immutable historical records of decisions made at a point in time. When a decision changes, a new ADR is created, and the status of the old ADR is updated to 'Superceded'."
  },
  {
    "skillCode": "tech-writing",
    "questionText": "In the context of writing effective RFCs for complex distributed systems, what is the primary danger of the 'Consensus Trap'?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Spending excessive time trying to get 100% agreement from all stakeholders, stalling momentum and innovation."
      },
      {
        "id": "opt2",
        "text": "Failing to include code snippets in the proposal."
      },
      {
        "id": "opt3",
        "text": "Allowing junior engineers to merge code without peer review."
      },
      {
        "id": "opt4",
        "text": "Publishing the document in a format that cannot be read by screen readers."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "The consensus trap occurs when authors wait for unanimous approval before moving forward. RFC processes should aim for informed consent and resolution of major blockers rather than universal enthusiasm."
  },
  {
    "skillCode": "tech-writing",
    "questionText": "When documenting a breaking change in a widely-used enterprise API, which sections and strategies are vital for a successful migration RFC/Guide? (Choose the best comprehensive approach)",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Just update the endpoint URL and let clients discover errors organically in production."
      },
      {
        "id": "opt2",
        "text": "Provide a clear deprecation timeline, a backward-compatibility period, side-by-side payload examples, and clear migration scripts or steps."
      },
      {
        "id": "opt3",
        "text": "Send an email announcement on the exact day of the change with no documentation updates."
      },
      {
        "id": "opt4",
        "text": "Lock down access to the API entirely until every client rewrites their integration in 48 hours."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Breaking changes require clear communication channels, deprecation windows, side-by-side comparisons, and actionable migration guides to minimize disruption for client teams."
  },
  {
    "skillCode": "tech-writing",
    "questionText": "How should an engineering organization handle 'Living Documentation' (such as system architecture wikis and runbooks) to prevent it from becoming stale and untrustworthy?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Assign a single technical writer to manually audit every repository daily."
      },
      {
        "id": "opt2",
        "text": "Lock all documentation files so developers cannot edit them after initial release."
      },
      {
        "id": "opt3",
        "text": "Treat documentation as code by storing it in Git, integrating doc updates into the pull request workflow, and assigning clear document owners."
      },
      {
        "id": "opt4",
        "text": "Rely entirely on automated AI tools to rewrite documentation every midnight without human review."
      }
    ],
    "correctAnswers": [
      "opt3"
    ],
    "explanation": "Treating docs-as-code ensures documentation evolves alongside code changes, leveraging PR reviews and ownership metadata to keep content accurate and current."
  },
  {
    "skillCode": "stakeholder-mgt",
    "questionText": "When presenting a project delay to a non-technical executive stakeholder, which approach best aligns with translating engineering constraints into business outcomes?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "Provide a deep dive into the specific database deadlocks and refactoring overhead that caused the issue."
      },
      {
        "id": "opt2",
        "text": "State that the engineering team is working hard and avoid giving a new timeline until everything is certain."
      },
      {
        "id": "opt3",
        "text": "Explain the delay in terms of impacted business launch milestones, mitigation plans, and updated risk tradeoffs."
      },
      {
        "id": "opt4",
        "text": "Blame the third-party API provider entirely for the architectural bottleneck without offering solutions."
      }
    ],
    "correctAnswers": [
      "opt3"
    ],
    "explanation": "Option 3 is correct because executives care about business impact, timelines, and risk management rather than raw technical jargon. Options 1, 2, and 4 either lack clarity, evade responsibility, or focus too heavily on low-level technical details irrelevant to executive decision-making."
  },
  {
    "skillCode": "stakeholder-mgt",
    "questionText": "True or False: When communicating technical debt to business stakeholders, you should focus exclusively on the lines of legacy code and CPU utilization metrics.",
    "type": "true_false",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "True"
      },
      {
        "id": "opt2",
        "text": "False"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "The statement is false. Technical debt must be translated into business risks, such as slower feature delivery velocity, increased customer-facing bugs, and higher maintenance costs, rather than raw code metrics."
  },
  {
    "skillCode": "stakeholder-mgt",
    "questionText": "What is the primary objective of creating a 'BLUF' (Bottom Line Up Front) communication structure when emailing busy executives?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "To force them to read the entire technical appendix before making a decision."
      },
      {
        "id": "opt2",
        "text": "To immediately deliver the core message, decision required, or business impact before providing supporting context."
      },
      {
        "id": "opt3",
        "text": "To hide negative project news behind complex metrics."
      },
      {
        "id": "opt4",
        "text": "To replace all verbal meetings with lengthy text documentation."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Option 2 is correct because BLUF respects executive time by prioritizing the main takeaway and action items at the very beginning. Options 1, 3, and 4 misrepresent the purpose of concise executive communication."
  },
  {
    "skillCode": "stakeholder-mgt",
    "questionText": "An executive demands a feature delivery date be pulled forward by two months, but current engineering capacity and technical constraints make this impossible without severe quality degradation. Which intermediate steps should you take? (Select all that apply)",
    "type": "multi_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Present a scoped-down MVP (Minimum Viable Product) that can be delivered on the requested timeline."
      },
      {
        "id": "opt2",
        "text": "Flatly reject the request as unrealistic without offering alternative options."
      },
      {
        "id": "opt3",
        "text": "Clearly outline the trade-offs, showing what features or quality metrics must be deprioritized or cut to meet the tighter deadline."
      },
      {
        "id": "opt4",
        "text": "Silently agree, pressure the team into unsustainable overtime, and hope for the best."
      }
    ],
    "correctAnswers": [
      "opt1",
      "opt3"
    ],
    "explanation": "Options 1 and 3 represent professional stakeholder management: offering viable compromises through scope reduction or transparent trade-off analysis. Options 2 and 4 damage trust and lead to burnout or operational failure."
  },
  {
    "skillCode": "stakeholder-mgt",
    "questionText": "When translating a complex cloud migration security requirement into a business proposal, how should you frame the rationale to a CFO?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Highlight the specific cryptographic algorithms being updated to meet compliance standards."
      },
      {
        "id": "opt2",
        "text": "Frame it as mitigating potential revenue loss, avoiding severe regulatory fines, and protecting brand reputation."
      },
      {
        "id": "opt3",
        "text": "Describe how many physical servers will be decommissioned and recycled."
      },
      {
        "id": "opt4",
        "text": "State that developers refuse to write code without this security layer."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Option 2 directly speaks to financial risk, legal liability, and brand value—the primary domains of a CFO. Options 1, 3, and 4 focus on technical or operational details that do not directly address high-level financial risk management."
  },
  {
    "skillCode": "stakeholder-mgt",
    "questionText": "You discover a major architectural flaw mid-project that requires a two-week pivot. How should you structure your status update to cross-functional product and business stakeholders?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Wait until the pivot is completely finished to avoid panicking the stakeholders."
      },
      {
        "id": "opt2",
        "text": "Lead with the problem, immediately provide the evaluated impact on the launch date, present 2-3 recovery options, and state your recommended path forward."
      },
      {
        "id": "opt3",
        "text": "Send a technical breakdown of the compiler errors causing the issue and ask them to choose a code fix."
      },
      {
        "id": "opt4",
        "text": "Assure them everything is on track while secretly cutting corners on unit tests to save time."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Option 2 embodies proactive, solution-oriented communication. It addresses transparency, impact assessment, and problem-solving. The other choices involve hiding information, shifting technical decisions to non-technical stakeholders, or sacrificing quality."
  },
  {
    "skillCode": "stakeholder-mgt",
    "questionText": "During a steering committee meeting, a stakeholder asks for an immediate estimate on a vague, highly complex feature request. What is the most effective response?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Provide a quick 'ballpark' guess on the spot to keep the meeting moving smoothly."
      },
      {
        "id": "opt2",
        "text": "Acknowledge the strategic value of the request, explain that rushing an estimate introduces high variance, and commit to delivering a time-boxed technical discovery assessment within 48 hours."
      },
      {
        "id": "opt3",
        "text": "Tell them that software estimation is impossible and refuse to discuss it."
      },
      {
        "id": "opt4",
        "text": "Ask the stakeholder to write the architectural specification themselves before you look at it."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Option 2 protects the engineering team from ungrounded commitments while maintaining professional engagement by setting clear next steps for a discovery phase. Option 1 leads to inaccurate commitments, while options 3 and 4 are combative."
  },
  {
    "skillCode": "stakeholder-mgt",
    "questionText": "When presenting a high-level roadmap to a board of directors, which visualization technique is most effective for communicating engineering constraints?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "A detailed Gantt chart showing individual developer task assignments and daily standup schedules."
      },
      {
        "id": "opt2",
        "text": "A high-level milestone-based roadmap highlighting critical dependencies, key delivery phases, and buffered risk windows."
      },
      {
        "id": "opt3",
        "text": "A live pull request dashboard displaying commit frequencies across repositories."
      },
      {
        "id": "opt4",
        "text": "A textual list of all Jira tickets currently sitting in the backlog."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Option 2 provides the right level of abstraction for board members, focusing on milestones, dependencies, and risk buffers. Options 1, 3, and 4 are too granular and operational for a board-level presentation."
  },
  {
    "skillCode": "stakeholder-mgt",
    "questionText": "An enterprise client insists on a custom integration that introduces extreme long-term maintenance overhead and architectural drift. Product management wants to accept it for revenue. How should you navigate this conflict?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Publicly veto the sale in front of the client during a joint alignment meeting."
      },
      {
        "id": "opt2",
        "text": "Collaborate with product and sales to quantify the total cost of ownership (TCO) and ongoing maintenance impact, presenting alternative architectural patterns (like a plugin architecture or middleware wrapper) that achieve client goals without compromising core system integrity."
      },
      {
        "id": "opt3",
        "text": "Build the custom integration directly into the core monolithic codebase with minimal isolation to save upfront time."
      },
      {
        "id": "opt4",
        "text": "Ignore the maintenance concerns and let future engineering teams deal with the refactoring."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Option 2 demonstrates advanced technical leadership by partnering across departments, translating technical debt into financial TCO terms, and proposing constructive architectural workarounds. The other options are unprofessional, destructive, or short-sighted."
  },
  {
    "skillCode": "stakeholder-mgt",
    "questionText": "When designing a communication strategy for an organization-wide digital transformation, why is stakeholder segmentation (categorizing by power, interest, and impact) critical?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "It ensures that every single employee receives the exact same 50-page technical document daily."
      },
      {
        "id": "opt2",
        "text": "It allows you to tailor messaging depth, frequency, and channels to match what each stakeholder group cares about and their capacity to influence outcomes."
      },
      {
        "id": "opt3",
        "text": "It allows engineering teams to bypass communicating with low-power stakeholders entirely."
      },
      {
        "id": "opt4",
        "text": "It hides project risks from external partners while keeping internal developers fully informed."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Option 2 defines the core principle of stakeholder mapping: tailoring communication to maximize relevance and buy-in across diverse groups. Options 1, 3, and 4 misapply the concept and create operational or transparency silos."
  },
  {
    "skillCode": "agile-teamwork",
    "questionText": "What is the primary purpose of a Sprint Retrospective in Agile methodologies?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "To evaluate the team member individual performance and assign ratings."
      },
      {
        "id": "opt2",
        "text": "To inspect how the last sprint went regarding people, relationships, process, and tools, and plan improvements."
      },
      {
        "id": "opt3",
        "text": "To demonstrate the completed product increment to stakeholders and clients."
      },
      {
        "id": "opt4",
        "text": "To plan the backlog items and estimate stories for the upcoming sprint."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "The Sprint Retrospective is specifically designed for the Scrum Team to inspect itself and create a plan for improvements to be enacted during the next sprint. Option 1 violates psychological safety, Option 3 describes the Sprint Review, and Option 4 describes Sprint Planning."
  },
  {
    "skillCode": "agile-teamwork",
    "questionText": "During pair programming, what are the roles of the two developers typically called?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "Manager and Subordinate"
      },
      {
        "id": "opt2",
        "text": "Driver and Navigator"
      },
      {
        "id": "opt3",
        "text": "Tester and Developer"
      },
      {
        "id": "opt4",
        "text": "Lead and Intern"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "In pair programming, the 'Driver' writes the code while the 'Navigator' reviews each line of code as it is typed in, thinking about strategic direction and edge cases. Roles frequently switch."
  },
  {
    "skillCode": "agile-teamwork",
    "questionText": "True or False: Code reviews should focus primarily on finding stylistic formatting errors rather than architectural or logical flaws.",
    "type": "true_false",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "True"
      },
      {
        "id": "opt2",
        "text": "False"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Formatting and style issues should ideally be automated via linters and formatters. Human code reviews should focus on architectural design, maintainability, logical correctness, security, and testability."
  },
  {
    "skillCode": "agile-teamwork",
    "questionText": "When giving constructive feedback during a code review, which approach is the most effective?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Saying 'This code is messy and needs to be completely rewritten'."
      },
      {
        "id": "opt2",
        "text": "Approving the code immediately without reading it to avoid hurting the author's feelings."
      },
      {
        "id": "opt3",
        "text": "Explaining the 'why' behind a suggested change and phrasing comments as questions or collaborative proposals."
      },
      {
        "id": "opt4",
        "text": "Directly editing the pull request yourself without notifying the author."
      }
    ],
    "correctAnswers": [
      "opt3"
    ],
    "explanation": "Constructive feedback relies on empathy, objective reasoning ('why'), and collaborative dialogue rather than dictatorial commands or vague criticism."
  },
  {
    "skillCode": "agile-teamwork",
    "questionText": "Which of the following practices are characteristic of a healthy Agile team code review culture? (Select all that apply)",
    "type": "multi_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Keeping pull requests small and focused to make reviews faster and more thorough."
      },
      {
        "id": "opt2",
        "text": "Treating code reviews as a gatekeeping exercise used to assign blame for bugs."
      },
      {
        "id": "opt3",
        "text": "Encouraging knowledge sharing by rotating reviewers across different modules."
      },
      {
        "id": "opt4",
        "text": "Establishing a Service Level Agreement (SLA) or turnaround time for reviewing code."
      }
    ],
    "correctAnswers": [
      "opt1",
      "opt3",
      "opt4"
    ],
    "explanation": "Healthy review cultures rely on small PRs, shared team ownership/rotation, and timely reviews. Treating code reviews as a blame game creates toxic team dynamics, making Option 2 incorrect."
  },
  {
    "skillCode": "agile-teamwork",
    "questionText": "A junior developer on your team struggles with writing unit tests and feels overwhelmed during sprint execution. As a senior team member mentoring them, what is the best immediate action?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Take over their user story entirely so the team doesn't miss its sprint goal."
      },
      {
        "id": "opt2",
        "text": "Set up a pair programming session to write the unit tests together, explaining the patterns step-by-step."
      },
      {
        "id": "opt3",
        "text": "Tell them to watch video tutorials online and reduce their workload without telling anyone."
      },
      {
        "id": "opt4",
        "text": "Report their lack of testing skills to the engineering manager during the retrospective."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Pair programming provides hands-on mentorship, builds psychological safety, and directly addresses skill gaps without undermining the junior developer's autonomy or calling them out negatively in public forums."
  },
  {
    "skillCode": "agile-teamwork",
    "questionText": "During a sprint retrospective, a recurring issue is raised: developers feel micromanaged by constant status checks from product stakeholders. How should the Scrum Master or team address this?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Ban all stakeholders from ever looking at the project board or talking to developers."
      },
      {
        "id": "opt2",
        "text": "Improve transparency by ensuring the sprint backlog and burndown charts are up to date, and redirect stakeholders to regular Sprint Reviews."
      },
      {
        "id": "opt3",
        "text": "Ignore the feedback because stakeholder management is outside the scope of retrospectives."
      },
      {
        "id": "opt4",
        "text": "Force developers to work overtime to finish features faster so stakeholders stop asking questions."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Micromanagement often stems from a lack of visibility. Improving asynchronous transparency and reinforcing Agile ceremonies (like the Sprint Review) helps build stakeholder trust."
  },
  {
    "skillCode": "agile-teamwork",
    "questionText": "When scaling mentorship across a growing engineering organization, what is a key limitation of relying solely on ad-hoc pair programming?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "It completely eliminates the need for automated tests and continuous integration."
      },
      {
        "id": "opt2",
        "text": "It does not scale well with team growth, leading to mentor burnout and inconsistent knowledge transfer without structured frameworks."
      },
      {
        "id": "opt3",
        "text": "It forces developers to write code in completely different programming languages."
      },
      {
        "id": "opt4",
        "text": "It guarantees that software will be delivered slower than waterfall methodologies."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "While powerful, ad-hoc pair programming demands significant time and energy from senior staff. Without institutionalized mentorship programs, documentation, and rotation frameworks, it can lead to senior burnout."
  },
  {
    "skillCode": "agile-teamwork",
    "questionText": "Your team is experiencing 'blame culture' whenever a production bug slips through code review. How should a senior engineer or Agile leader intervene to shift this toward a learning culture?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Implement a strict penalty policy for developers who submit code with bugs."
      },
      {
        "id": "opt2",
        "text": "Facilitate a blameless post-mortem to analyze systemic process failures and update test/review checklists instead of focusing on individual error."
      },
      {
        "id": "opt3",
        "text": "Stop doing code reviews altogether to speed up deployments."
      },
      {
        "id": "opt4",
        "text": "Assign all bug fixes strictly to junior team members as a disciplinary measure."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Blameless post-mortems focus on process gaps, tooling weaknesses, and system behavior rather than personal fault, establishing psychological safety and continuous team improvement."
  },
  {
    "skillCode": "agile-teamwork",
    "questionText": "In an Agile team with varying experience levels, how can pull request (PR) bottlenecking caused by senior engineers being the only reviewers be resolved effectively?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Allow junior developers to approve their own PRs without review."
      },
      {
        "id": "opt2",
        "text": "Implement a tiered review model where mid-level engineers do the first pass of reviews, supported by guidelines and senior sign-off when necessary."
      },
      {
        "id": "opt3",
        "text": "Require all team members to review every single line of code written by anyone else."
      },
      {
        "id": "opt4",
        "text": "Outsource all code reviews to external consultants."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Tiered code reviews distribute the review load, accelerate team learning, empower mid-level engineers to grow into mentors, and prevent senior bottlenecks without sacrificing code quality."
  },
  {
    "skillCode": "prod-discovery",
    "questionText": "What is the primary objective of a Product Requirement Document (PRD)?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "To define the financial forecast and pricing model of a product over a 5-year period."
      },
      {
        "id": "opt2",
        "text": "To clearly communicate the problem, user needs, and functional requirements to engineering and design teams."
      },
      {
        "id": "opt3",
        "text": "To serve as a legally binding contract between the product team and external vendors."
      },
      {
        "id": "opt4",
        "text": "To replace the need for user testing by documenting all edge cases beforehand."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "A PRD's core purpose is alignment and execution clarity. It bridges the gap between the 'why' (problem and user needs) and the 'what' (functional requirements) for engineering, design, and stakeholders. Options 1, 3, and 4 misrepresent its primary function."
  },
  {
    "skillCode": "prod-discovery",
    "questionText": "During user interviews for problem validation, which of the following questions is most effective at uncovering genuine user pain points?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "\"Would you pay $20 a month for an app that automates your expense tracking?\""
      },
      {
        "id": "opt2",
        "text": "\"Don't you find it frustrating when your current spreadsheet crashes?\""
      },
      {
        "id": "opt3",
        "text": "\"Walk me through the last time you had to submit your monthly expense report. What took the longest?\""
      },
      {
        "id": "opt4",
        "text": "\"Do you think an AI-powered receipt scanner would be useful for your workflow?\""
      }
    ],
    "correctAnswers": [
      "opt3"
    ],
    "explanation": "Asking about past behavior ('Walk me through the last time...') uncovers actual habits, workarounds, and pain points. The other options ask hypothetical questions or lead the user, which often results in polite agreement rather than truth."
  },
  {
    "skillCode": "prod-discovery",
    "questionText": "An MVP (Minimum Viable Product) is designed to maximize validated learning about customers with the least effort.",
    "type": "true_false",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "True"
      },
      {
        "id": "opt2",
        "text": "False"
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "By definition coined by Frank Robinson and popularized by Eric Ries, an MVP is the version of a new product which allows a team to collect the maximum amount of validated learning about customers with the least effort."
  },
  {
    "skillCode": "prod-discovery",
    "questionText": "When synthesizing data from 12 user interviews, which approach best ensures you identify true systemic user needs rather than loud minority feedback?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Prioritize the feedback of the user who paid the highest subscription tier."
      },
      {
        "id": "opt2",
        "text": "Map out interview quotes on an affinity diagram to cluster recurring pain points and behavioral patterns."
      },
      {
        "id": "opt3",
        "text": "Implement every feature requested by at least two different interviewees."
      },
      {
        "id": "opt4",
        "text": "Discard qualitative interview data entirely and rely solely on quantitative web analytics."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Affinity mapping allows product managers to group qualitative data visually, helping to surface patterns, trends, and systemic user needs across multiple interviews rather than over-indexing on outlier requests."
  },
  {
    "skillCode": "prod-discovery",
    "questionText": "Which of the following elements are essential components of a well-structured PRD? (Select all that apply)",
    "type": "multi_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Problem statement and user context"
      },
      {
        "id": "opt2",
        "text": "Explicit out-of-scope items"
      },
      {
        "id": "opt3",
        "text": "Success metrics and key performance indicators (KPIs)"
      },
      {
        "id": "opt4",
        "text": "Exact line-by-line production source code written by the product manager"
      }
    ],
    "correctAnswers": [
      "opt1",
      "opt2",
      "opt3"
    ],
    "explanation": "A great PRD outlines the problem/context, success metrics, and what is out of scope to prevent scope creep. Product managers do not write production code; defining architecture is typically an engineering responsibility."
  },
  {
    "skillCode": "prod-discovery",
    "questionText": "You are scoping an MVP for a new B2B invoicing tool. Which slicing strategy best aligns with the true philosophy of an MVP?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Build the database schema, then the backend APIs, then the frontend UI sequentially over 6 months."
      },
      {
        "id": "opt2",
        "text": "Build a manual, concierge-style service where your team generates invoices behind the scenes to test demand before writing code."
      },
      {
        "id": "opt3",
        "text": "Build all features at 20% quality so users have access to everything immediately."
      },
      {
        "id": "opt4",
        "text": "Wait until every potential edge case regarding international tax compliance is solved before launching."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "A concierge or wizard-of-oz MVP tests core value propositions with minimum engineering effort. Option 1 is traditional waterfall, Option 3 delivers a poor user experience across the board, and Option 4 falls victim to analysis paralysis."
  },
  {
    "skillCode": "prod-discovery",
    "questionText": "When writing functional requirements in a PRD, what is the best way to handle edge cases and alternative user flows?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Ignore them in the PRD and let developers guess during sprint planning."
      },
      {
        "id": "opt2",
        "text": "Document them explicitly with 'Given-When-Then' acceptance criteria or clear state-transition logic."
      },
      {
        "id": "opt3",
        "text": "Write a single sentence stating 'the system should handle all errors gracefully'."
      },
      {
        "id": "opt4",
        "text": "Delay writing the PRD until all bugs in previous releases are resolved."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Explicit acceptance criteria (such as Given-When-Then format) remove ambiguity, ensuring QA, design, and engineering share a common understanding of how alternative flows and edge cases must behave."
  },
  {
    "skillCode": "prod-discovery",
    "questionText": "How should a Product Manager differentiate between problem space and solution space during early discovery?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Problem space focuses on user goals and pain points; solution space focuses on the specific features or architecture built to address them."
      },
      {
        "id": "opt2",
        "text": "Problem space is handled exclusively by engineers, while solution space is managed by executives."
      },
      {
        "id": "opt3",
        "text": "Problem space and solution space are interchangeable terms used interchangeably in agile frameworks."
      },
      {
        "id": "opt4",
        "text": "Problem space refers to technical debt, whereas solution space refers to user interface design."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "Falling in love with a solution before deeply understanding the problem space is a primary cause of building products nobody wants. PMs must first validate the problem space (what hurts and why) before jumping to solutions (how we fix it)."
  },
  {
    "skillCode": "prod-discovery",
    "questionText": "You are leading discovery for a mature product where users report the app is 'too complex.' Which discovery framework or technique is most appropriate to unpack this feedback?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "A multiple-choice survey asking users to rate complexity from 1 to 5."
      },
      {
        "id": "opt2",
        "text": "Contextual inquiry and task analysis observing users attempting core workflows in their natural environment."
      },
      {
        "id": "opt3",
        "text": "A competitor feature matrix to see which buttons competitors have removed."
      },
      {
        "id": "opt4",
        "text": "Brainstorming new features to add to the navigation bar to make it more comprehensive."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "When subjective feedback like 'too complex' arises, contextual inquiry and task analysis help identify exact friction points, cognitive overload moments, and unnecessary steps that surveys cannot capture accurately."
  },
  {
    "skillCode": "prod-discovery",
    "questionText": "When defining MVP scope for a high-risk, zero-to-one product, which prioritization framework combined with hypothesis mapping yields the most rigorous discovery results?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "HiPPO (Highest Paid Person's Opinion) combined with immediate gut-feel execution."
      },
      {
        "id": "opt2",
        "text": "Mapping features on a Risk vs. Value matrix to isolate assumptions that, if false, will sink the product."
      },
      {
        "id": "opt3",
        "text": "Alphabetical sorting of user stories to ensure fair distribution across sprints."
      },
      {
        "id": "opt4",
        "text": "Building every feature requested by the top 10% most vocal enterprise leads."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "For zero-to-one products, the greatest danger is building something nobody wants or that fails a core operational constraint. A Risk vs. Value matrix helps teams focus discovery and MVP scope on high-risk, high-value assumptions first."
  },
  {
    "skillCode": "product-analytics",
    "questionText": "What is the primary purpose of a 'North Star Metric' in product management?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "To measure the total gross revenue generated by the company on a monthly basis."
      },
      {
        "id": "opt2",
        "text": "To capture the core value that the product delivers to its customers, aligning the entire team around sustainable growth."
      },
      {
        "id": "opt3",
        "text": "To track the daily active engineering hours spent fixing bugs and deploying features."
      },
      {
        "id": "opt4",
        "text": "To determine the exact number of marketing campaigns launched per quarter."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "A North Star Metric represents the key measure of the core value a product delivers to its customers. It serves as a guiding light for the product team to focus on long-term retention and sustainable growth, rather than just vanity metrics like gross revenue or output metrics like engineering hours."
  },
  {
    "skillCode": "product-analytics",
    "questionText": "In a conversion funnel analysis, a 'drop-off rate' represents the percentage of users who fail to move from one step to the next.",
    "type": "true_false",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "True"
      },
      {
        "id": "opt2",
        "text": "False"
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "This statement is true. The drop-off rate measures the proportion of users who abandon the journey at a specific step in a funnel without proceeding to the subsequent step."
  },
  {
    "skillCode": "product-analytics",
    "questionText": "Which of the following best defines a cohort in product analytics?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "All users who currently have the mobile app installed regardless of when they downloaded it."
      },
      {
        "id": "opt2",
        "text": "A group of users who share a common characteristic or experience within a specified time frame."
      },
      {
        "id": "opt3",
        "text": "A randomized control group used exclusively for A/B testing user interface changes."
      },
      {
        "id": "opt4",
        "text": "Users who have churned from the product within the last 30 days."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "A cohort is defined as a group of people who share a common characteristic or experience over a specific timeframe (e.g., users who signed up in January). Grouping users this way allows analysts to track behavioral changes and retention over time."
  },
  {
    "skillCode": "product-analytics",
    "questionText": "You are analyzing retention curves for a SaaS product. Which shape of a retention curve typically indicates strong product-market fit?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "A curve that drops continuously and eventually reaches close to zero percent."
      },
      {
        "id": "opt2",
        "text": "A curve that starts low and increases exponentially over time as users discover features."
      },
      {
        "id": "opt3",
        "text": "A curve that slopes downward initially and then flattens out parallel to the horizontal axis."
      },
      {
        "id": "opt4",
        "text": "A straight diagonal line sloping downward from 100% to 0% at a constant rate."
      }
    ],
    "correctAnswers": [
      "opt3"
    ],
    "explanation": "A healthy retention curve drops initially as casual or mismatched users churn, but eventually flattens out (asymptotic to the X-axis). A flat tail indicates that a core group of users finds ongoing, repeatable value in the product, signaling product-market fit."
  },
  {
    "skillCode": "product-analytics",
    "questionText": "When setting up an A/B test for a checkout flow optimization, why is it crucial to pre-calculate sample size and test duration?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "To prevent 'p-hacking' by avoiding stopping the test early the moment a statistically significant result appears."
      },
      {
        "id": "opt2",
        "text": "To ensure that server costs do not exceed the marketing budget allocated for the quarter."
      },
      {
        "id": "opt3",
        "text": "To guarantee that 100% of the user base is exposed to the variant rather than the control."
      },
      {
        "id": "opt4",
        "text": "To completely eliminate the possibility of novelty effects in user behavior."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "Pre-calculating sample size and runtime is vital to avoid peeking and p-hacking. If you continuously check results and stop the test when p < 0.05, you drastically increase the false positive (Type I error) rate."
  },
  {
    "skillCode": "product-analytics",
    "questionText": "An e-commerce funnel shows 1,000 visitors on the Product Page, 200 visitors who Add to Cart, and 50 visitors who Complete Purchase. What is the overall conversion rate from Product Page to Complete Purchase?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "2.5%"
      },
      {
        "id": "opt2",
        "text": "5.0%"
      },
      {
        "id": "opt3",
        "text": "20.0%"
      },
      {
        "id": "opt4",
        "text": "25.0%"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "The overall conversion rate is calculated by dividing the final step metric by the initial step metric: 50 purchases / 1,000 visitors = 0.05 or 5.0%."
  },
  {
    "skillCode": "product-analytics",
    "questionText": "Which of the following scenarios represent common threats to the validity of an A/B test? (Select all that apply)",
    "type": "multi_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Sample ratio mismatch (SRM), where the number of users in variant groups differs significantly from the allocation design."
      },
      {
        "id": "opt2",
        "text": "Network effects or spillover, where users in the control group interact with users in the treatment group."
      },
      {
        "id": "opt3",
        "text": "Running the test across both desktop and mobile platforms simultaneously."
      },
      {
        "id": "opt4",
        "text": "Seasonality effects, such as running a test over Black Friday without accounting for atypical user intent."
      }
    ],
    "correctAnswers": [
      "opt1",
      "opt2",
      "opt4"
    ],
    "explanation": "SRM invalidates randomization integrity; network/spillover effects violate the Stable Unit Treatment Value Assumption (SUTVA); and major seasonal events can confound treatment effects. Running a test across desktop and mobile is standard practice if segmented properly, so option 3 is not an inherent threat."
  },
  {
    "skillCode": "product-analytics",
    "questionText": "You are analyzing a feature launch using a quasi-experimental approach called Difference-in-Differences (DiD). What is the primary assumption required for DiD to yield unbiased estimates?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "The parallel trends assumption: in the absence of treatment, the unobserved differences between treatment and control groups remain constant over time."
      },
      {
        "id": "opt2",
        "text": "The strict exogeneity assumption: treatment assignment must be completely random with zero selection bias."
      },
      {
        "id": "opt3",
        "text": "The homoscedasticity assumption: the variance of error terms must be identical across all user cohorts."
      },
      {
        "id": "opt4",
        "text": "The unit elasticity assumption: changes in user engagement must scale linearly with changes in feature latency."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "Difference-in-Differences relies fundamentally on the parallel trends assumption. It assumes that absent the intervention, the average outcomes for the treatment and control groups would have followed parallel trajectories over time."
  },
  {
    "skillCode": "product-analytics",
    "questionText": "Your team runs an A/B test on a subscription checkout page. Variant B shows a statistically significant 12% increase in immediate conversion rate (p < 0.01), but after 90 days, the retention rate and Lifetime Value (LTV) of users acquired through Variant B are 30% lower than Control. What analytical phenomenon is most likely occurring?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Simpson's Paradox caused by improper segmentation of mobile versus desktop traffic."
      },
      {
        "id": "opt2",
        "text": "A local maxima optimization trap where short-term metric gains cannibalize long-term product health and user quality."
      },
      {
        "id": "opt3",
        "text": "A Type II statistical error resulting from insufficient statistical power and small sample size."
      },
      {
        "id": "opt4",
        "text": "A novelty effect that temporarily inflated long-term retention numbers."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "This is a classic case of short-term optimization harming long-term value (often seen with dark patterns or aggressive sales copy that converts low-intent users who quickly churn). Optimizing solely for immediate conversion creates a local maxima trap at the expense of LTV and retention."
  },
  {
    "skillCode": "product-analytics",
    "questionText": "When evaluating retention across different user acquisition channels using retention matrices, why is 'calendar-day retention' often misleading compared to 'event-based (N-day) retention'?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Calendar-day retention requires complex SQL window functions that introduce rounding errors."
      },
      {
        "id": "opt2",
        "text": "Calendar-day retention conflates the user's actual tenure with calendar boundaries, penalizing users who sign up late in the day or right before weekly reset periods."
      },
      {
        "id": "opt3",
        "text": "Event-based retention ignores churn entirely and only measures active sessions."
      },
      {
        "id": "opt4",
        "text": "Calendar-day retention cannot be calculated for mobile apps, only desktop web platforms."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Calendar-day retention checks if a user was active on a specific calendar date (e.g., Tuesday). If a user signs up at 11:50 PM on Monday, day 1 for them is only 10 minutes long on a calendar basis, leading to artificially depressed retention metrics compared to true N-day (or bounded time elapsed) retention."
  },
  {
    "skillCode": "user-research",
    "questionText": "What is the primary purpose of creating a low-fidelity wireframe during the UX design process?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "To establish the final color palette and typography rules for the brand."
      },
      {
        "id": "opt2",
        "text": "To quickly explore layout concepts, information architecture, and core user flows without getting bogged down in visual details."
      },
      {
        "id": "opt3",
        "text": "To write production-ready frontend code for developer handover."
      },
      {
        "id": "opt4",
        "text": "To conduct final accessibility and contrast ratio audits."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Low-fidelity wireframes focus on structural layout and content hierarchy early in the design cycle. Options 1, 3, and 4 apply to later stages like visual design, development, and high-fidelity auditing."
  },
  {
    "skillCode": "user-research",
    "questionText": "True or False: A customer journey map primarily visualizes a product's internal business metrics and revenue funnels over time.",
    "type": "true_false",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "True"
      },
      {
        "id": "opt2",
        "text": "False"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "False. Customer journey maps are centered around the user's perspective—their actions, thoughts, feelings, and pain points—rather than internal business metrics."
  },
  {
    "skillCode": "user-research",
    "questionText": "In usability testing, what is the main goal of keeping tasks open-ended and avoiding leading questions?",
    "type": "single_mcq",
    "difficulty": "beginner",
    "options": [
      {
        "id": "opt1",
        "text": "To prevent biasing the participant and ensure authentic, natural user behaviors and feedback."
      },
      {
        "id": "opt2",
        "text": "To make the testing session finish much faster."
      },
      {
        "id": "opt3",
        "text": "To confuse the participant so you can measure their stress levels."
      },
      {
        "id": "opt4",
        "text": "To ensure the participant gives the exact feedback the stakeholders want to hear."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "Neutral, open-ended tasks prevent experimenter bias, allowing researchers to observe how users genuinely navigate and interpret the product."
  },
  {
    "skillCode": "user-research",
    "questionText": "Which of the following elements are typically included in a comprehensive customer journey map? (Select all that apply)",
    "type": "multi_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "User stages or phases"
      },
      {
        "id": "opt2",
        "text": "User thoughts, emotions, and pain points"
      },
      {
        "id": "opt3",
        "text": "Touchpoints and channels (e.g., website, app, support chat)"
      },
      {
        "id": "opt4",
        "text": "Exact SQL database schema and backend server configuration"
      }
    ],
    "correctAnswers": [
      "opt1",
      "opt2",
      "opt3"
    ],
    "explanation": "Journey maps outline stages, touchpoints, and the emotional/cognitive state of the user. Database schemas are technical implementation details unrelated to user journey mapping."
  },
  {
    "skillCode": "user-research",
    "questionText": "When conducting an accessibility (a11y) audit for color contrast on a text element, what standard must be met for normal-sized text under WCAG 2.1 Level AA?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "A minimum contrast ratio of 3:1"
      },
      {
        "id": "opt2",
        "text": "A minimum contrast ratio of 4.5:1"
      },
      {
        "id": "opt3",
        "text": "A minimum contrast ratio of 7:1"
      },
      {
        "id": "opt4",
        "text": "No contrast requirement if the font size is above 12px"
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "WCAG 2.1 Level AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text. 7:1 is the stricter AAA standard for normal text."
  },
  {
    "skillCode": "user-research",
    "questionText": "How should a UX designer approach structuring user flows for an application with complex, multi-branching paths?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Force all users into a single linear linear funnel to simplify testing."
      },
      {
        "id": "opt2",
        "text": "Map out entry points, decision nodes, alternative paths, and exit goals clearly to account for user intent variations."
      },
      {
        "id": "opt3",
        "text": "Ignore edge cases and focus only on the happy path to save time."
      },
      {
        "id": "opt4",
        "text": "Rely entirely on developers to decide the flow logic during implementation."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Complex user flows require mapping decision nodes and edge cases to ensure every user intent can be successfully resolved without dead ends."
  },
  {
    "skillCode": "user-research",
    "questionText": "During a usability test, you notice that 4 out of 5 participants repeatedly miss a secondary call-to-action button placed at the bottom of a long scrolling page. What is the most appropriate next design iteration?",
    "type": "single_mcq",
    "difficulty": "intermediate",
    "options": [
      {
        "id": "opt1",
        "text": "Remove the feature entirely since users don't care about it."
      },
      {
        "id": "opt2",
        "text": "Re-evaluate the visual hierarchy and placement of the element, possibly moving it higher or improving its contrast and affordance."
      },
      {
        "id": "opt3",
        "text": "Blame the participants for not reading the page thoroughly enough."
      },
      {
        "id": "opt4",
        "text": "Add a pop-up modal that blocks the entire screen immediately upon page load."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "If multiple users miss an element, it indicates a visual hierarchy or positioning issue. Iterating on placement and affordance addresses the root usability problem."
  },
  {
    "skillCode": "user-research",
    "questionText": "When integrating accessibility (a11y) into wireframing and component design, which practice ensures optimal screen reader navigation?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Using purely visual cues like color changes to indicate interactive states."
      },
      {
        "id": "opt2",
        "text": "Establishing a logical heading hierarchy (H1 to H6) and defining clear landmark regions and focus order."
      },
      {
        "id": "opt3",
        "text": "Hiding all form labels to maintain a minimalist visual aesthetic."
      },
      {
        "id": "opt4",
        "text": "Relying on auto-generated image alt text without human review."
      }
    ],
    "correctAnswers": [
      "opt2"
    ],
    "explanation": "Screen readers rely on structural semantics like heading hierarchies, landmarks, and correct focus order. Visual-only cues fail users with visual impairments."
  },
  {
    "skillCode": "user-research",
    "questionText": "You are tasked with mapping a cross-channel customer journey for an omnichannel retail brand. Quantitative metrics reveal a high drop-off rate specifically between the mobile app browsing phase and in-store pickup. What advanced research method should you deploy next to diagnose the root emotional and operational friction?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Conduct contextual inquiries and qualitative diary studies focusing on the transition between digital browsing and physical store pickup."
      },
      {
        "id": "opt2",
        "text": "Increase advertising spend on mobile app downloads."
      },
      {
        "id": "opt3",
        "text": "Redesigned the app splash screen with a new color scheme."
      },
      {
        "id": "opt4",
        "text": "Remove the in-store pickup option entirely."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "Quantitative data tells you *where* drop-off occurs, but qualitative methods like contextual inquiries and diary studies explain *why* it happens during omnichannel transitions."
  },
  {
    "skillCode": "user-research",
    "questionText": "How do heuristic evaluations differ from standard usability testing with live participants?",
    "type": "single_mcq",
    "difficulty": "advanced",
    "options": [
      {
        "id": "opt1",
        "text": "Heuristic evaluations involve expert evaluators inspecting an interface against established usability principles, whereas usability testing involves observing actual end-users performing tasks."
      },
      {
        "id": "opt2",
        "text": "Heuristic evaluations are conducted exclusively by novice users, while usability testing is done by developers."
      },
      {
        "id": "opt3",
        "text": "There is no difference; the terms are completely interchangeable."
      },
      {
        "id": "opt4",
        "text": "Heuristic evaluations require quantitative statistical significance testing, unlike usability tests."
      }
    ],
    "correctAnswers": [
      "opt1"
    ],
    "explanation": "Heuristic evaluation is an expert-based inspection method using recognized guidelines (e.g., Nielsen's heuristics), whereas usability testing directly evaluates real user behavior and performance."
  }
];
