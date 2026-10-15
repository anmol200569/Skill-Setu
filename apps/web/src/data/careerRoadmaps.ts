export interface RoadmapMilestone {
  id: string;
  step: number;
  title: string;
  description: string;
  skillCode?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  topics: string[];
  recommendedCourse?: {
    title: string;
    provider: string;
    url: string;
    isFree: boolean;
  };
}

export interface RoadmapPhase {
  phaseNumber: number;
  title: string;
  subtitle: string;
  milestones: RoadmapMilestone[];
}

export interface CareerRoadmapData {
  roleId: string;
  roleTitle: string;
  roadmapShSlug: string;
  roadmapShUrl: string;
  overview: string;
  totalEstimatedHours: number;
  phases: RoadmapPhase[];
}

export const careerRoadmaps: Record<string, CareerRoadmapData> = {
  'fullstack-dev': {
    roleId: 'fullstack-dev',
    roleTitle: 'Full-Stack Developer',
    roadmapShSlug: 'full-stack',
    roadmapShUrl: 'https://roadmap.sh/full-stack',
    overview: 'Comprehensive developer roadmap from internet basics and frontend UI to backend services, databases, DevOps, and cloud deployment.',
    totalEstimatedHours: 145,
    phases: [
      {
        phaseNumber: 1,
        title: 'Internet & Web Fundamentals',
        subtitle: 'Core protocols, browser rendering engines, and foundational web programming.',
        milestones: [
          {
            id: 'fs-m1',
            step: 1,
            title: 'Internet Protocols & Version Control',
            description: 'Understand HTTP/HTTPS, DNS lookups, TCP/IP handshakes, and master Git/GitHub collaboration workflows.',
            skillCode: 'ts-js',
            difficulty: 'Beginner',
            estimatedHours: 20,
            topics: ['HTTP/HTTPS & REST semantics', 'DNS & Hosting', 'Git CLI & Branching', 'GitHub Actions basics'],
            recommendedCourse: {
              title: 'CS50x: Introduction to Computer Science',
              provider: 'CS50',
              url: 'https://cs50.harvard.edu/x/',
              isFree: true
            }
          },
          {
            id: 'fs-m2',
            step: 2,
            title: 'Modern JavaScript & TypeScript Architecture',
            description: 'Master ES6+ syntax, asynchronous promises, DOM manipulation, TypeScript types, and strict interfaces.',
            skillCode: 'ts-js',
            difficulty: 'Intermediate',
            estimatedHours: 25,
            topics: ['ES6 Modules & Closures', 'Async/Await & Event Loop', 'TypeScript Generics & Types', 'Error Handling'],
            recommendedCourse: {
              title: 'Responsive Web Design Certification',
              provider: 'freeCodeCamp',
              url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
              isFree: true
            }
          }
        ]
      },
      {
        phaseNumber: 2,
        title: 'Frontend Component Architecture',
        subtitle: 'Building responsive, accessible, and reactive user interfaces.',
        milestones: [
          {
            id: 'fs-m3',
            step: 3,
            title: 'React Components, State & Lifecycle',
            description: 'Component-driven UI development, custom hooks, context API, state managers, and client routing.',
            skillCode: 'react',
            difficulty: 'Intermediate',
            estimatedHours: 30,
            topics: ['Functional Components & Hooks', 'State Management (Zustand/Redux)', 'Tailwind CSS & Styling', 'React Router DOM'],
            recommendedCourse: {
              title: 'Front End Development Libraries',
              provider: 'freeCodeCamp',
              url: 'https://www.freecodecamp.org/learn/front-end-development-libraries/',
              isFree: true
            }
          }
        ]
      },
      {
        phaseNumber: 3,
        title: 'Backend APIs & Persistent Databases',
        subtitle: 'Server-side runtime, relational data models, and secure authentication.',
        milestones: [
          {
            id: 'fs-m4',
            step: 4,
            title: 'Node.js & Express RESTful API Engineering',
            description: 'Design robust backend services, middleware pipelines, request validation with Zod, and error handling.',
            skillCode: 'nodejs',
            difficulty: 'Intermediate',
            estimatedHours: 25,
            topics: ['Express Middleware', 'REST API Design Principles', 'Zod Schema Validation', 'JWT Authentication & Cookies'],
            recommendedCourse: {
              title: 'Back End Development and APIs',
              provider: 'freeCodeCamp',
              url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/',
              isFree: true
            }
          },
          {
            id: 'fs-m5',
            step: 5,
            title: 'Relational Database Design & SQL Querying',
            description: 'Schema modeling, foreign key constraints, indexes, transaction ACID guarantees, and Prisma ORM integration.',
            skillCode: 'sql-db',
            difficulty: 'Intermediate',
            estimatedHours: 25,
            topics: ['PostgreSQL & Normalization', 'Complex JOINs & Indexes', 'Prisma Schema & Migrations', 'ACID Transactions'],
            recommendedCourse: {
              title: 'Relational Database Certification',
              provider: 'freeCodeCamp',
              url: 'https://www.freecodecamp.org/learn/relational-database/',
              isFree: true
            }
          }
        ]
      },
      {
        phaseNumber: 4,
        title: 'Deployment, Containers & System Architecture',
        subtitle: 'Production readiness, containerization, and resilient application design.',
        milestones: [
          {
            id: 'fs-m6',
            step: 6,
            title: 'Docker Containers & System Architecture',
            description: 'Containerize full-stack apps with Docker, manage multi-container setups, and apply system design patterns.',
            skillCode: 'docker-k8s',
            difficulty: 'Advanced',
            estimatedHours: 20,
            topics: ['Dockerfile & Multi-stage builds', 'Docker Compose networks', 'System Design fundamentals', 'OWASP Top 10 Security'],
            recommendedCourse: {
              title: 'Introduction to Containers on Google Cloud',
              provider: 'Google Cloud Skills Boost',
              url: 'https://www.cloudskillsboost.google/course_templates/60',
              isFree: true
            }
          }
        ]
      }
    ]
  },

  'data-analyst': {
    roleId: 'data-analyst',
    roleTitle: 'Data Analyst',
    roadmapShSlug: 'data-analyst',
    roadmapShUrl: 'https://roadmap.sh/data-analyst',
    overview: 'Transform raw datasets into actionable insights with statistics, advanced SQL, Python data cleaning, and executive BI dashboards.',
    totalEstimatedHours: 130,
    phases: [
      {
        phaseNumber: 1,
        title: 'Mathematics, Statistics & Spreadsheets',
        subtitle: 'Foundations of quantitative analysis and hypothesis evaluation.',
        milestones: [
          {
            id: 'da-m1',
            step: 1,
            title: 'Descriptive & Inferential Statistics',
            description: 'Understand central tendency, variance, confidence intervals, p-values, and statistical distributions.',
            skillCode: 'eda-pandas',
            difficulty: 'Beginner',
            estimatedHours: 20,
            topics: ['Mean, Median, Standard Deviation', 'Hypothesis Testing', 'Correlation vs Causation', 'Data Distributions'],
            recommendedCourse: {
              title: 'Data Analysis with Python',
              provider: 'freeCodeCamp',
              url: 'https://www.freecodecamp.org/learn/data-analysis-with-python/',
              isFree: true
            }
          }
        ]
      },
      {
        phaseNumber: 2,
        title: 'Relational Databases & Analytical SQL',
        subtitle: 'Mastering data extraction, multi-table joins, and window analytics.',
        milestones: [
          {
            id: 'da-m2',
            step: 2,
            title: 'Advanced SQL Querying & Aggregations',
            description: 'Write complex analytical queries using window functions, common table expressions (CTEs), and query optimization.',
            skillCode: 'adv-sql',
            difficulty: 'Intermediate',
            estimatedHours: 35,
            topics: ['Multi-table JOINs & Subqueries', 'Window Functions (ROW_NUMBER, RANK)', 'CTEs & Recursive Queries', 'Query Indexing & Optimization'],
            recommendedCourse: {
              title: 'Relational Database Certification',
              provider: 'freeCodeCamp',
              url: 'https://www.freecodecamp.org/learn/relational-database/',
              isFree: true
            }
          }
        ]
      },
      {
        phaseNumber: 3,
        title: 'Data Wrangling & Exploratory Analysis (EDA)',
        subtitle: 'Python scientific libraries for automated data ingestion and cleaning.',
        milestones: [
          {
            id: 'da-m3',
            step: 3,
            title: 'Python, Pandas & Data Cleaning',
            description: 'Clean raw records, handle missing values, reshape dataframes, and perform statistical feature exploration.',
            skillCode: 'eda-pandas',
            difficulty: 'Intermediate',
            estimatedHours: 40,
            topics: ['Pandas DataFrames & Series', 'Handling Nulls & Outliers', 'Data Reshaping & Merging', 'Exploratory Data Analysis (EDA)'],
            recommendedCourse: {
              title: 'Data Analysis with Python',
              provider: 'freeCodeCamp',
              url: 'https://www.freecodecamp.org/learn/data-analysis-with-python/',
              isFree: true
            }
          }
        ]
      },
      {
        phaseNumber: 4,
        title: 'Business Intelligence & Executive Storytelling',
        subtitle: 'Turning numbers into compelling visual decision frameworks.',
        milestones: [
          {
            id: 'da-m4',
            step: 4,
            title: 'Data Visualization & BI Dashboards',
            description: 'Build interactive dashboards, establish executive KPI metrics, and communicate findings to leadership.',
            skillCode: 'data-vis',
            difficulty: 'Advanced',
            estimatedHours: 35,
            topics: ['Power BI / Tableau Dashboards', 'Chart Choice & Visual Hierarchy', 'Funnel & Cohort Retention Analysis', 'Stakeholder Communication'],
            recommendedCourse: {
              title: 'CS50x: Introduction to Computer Science',
              provider: 'CS50',
              url: 'https://cs50.harvard.edu/x/',
              isFree: true
            }
          }
        ]
      }
    ]
  },

  'ml-engineer': {
    roleId: 'ml-engineer',
    roleTitle: 'Machine Learning Engineer',
    roadmapShSlug: 'ai-data-scientist',
    roadmapShUrl: 'https://roadmap.sh/ai-data-scientist',
    overview: 'From mathematical foundations and classic models to deep learning architectures, generative AI, RAG pipelines, and MLOps.',
    totalEstimatedHours: 160,
    phases: [
      {
        phaseNumber: 1,
        title: 'Math & Scientific Computing',
        subtitle: 'Linear algebra, calculus, and high-performance computing in Python.',
        milestones: [
          {
            id: 'ml-m1',
            step: 1,
            title: 'Linear Algebra, Calculus & NumPy',
            description: 'Matrices, eigenvalues, vector spaces, gradient descent optimization, and vectorized math.',
            skillCode: 'python',
            difficulty: 'Beginner',
            estimatedHours: 30,
            topics: ['Matrix Multiplication & Tensors', 'Partial Derivatives & Gradients', 'NumPy Vectorization', 'Probability & Distributions'],
            recommendedCourse: {
              title: 'Scientific Computing with Python',
              provider: 'freeCodeCamp',
              url: 'https://www.freecodecamp.org/learn/scientific-computing-with-python/',
              isFree: true
            }
          }
        ]
      },
      {
        phaseNumber: 2,
        title: 'Supervised & Unsupervised Machine Learning',
        subtitle: 'Classical predictive algorithms, feature engineering, and validation.',
        milestones: [
          {
            id: 'ml-m2',
            step: 2,
            title: 'Statistical Learning & Scikit-Learn',
            description: 'Train and evaluate regression, classification, random forests, clustering, and regularization techniques.',
            skillCode: 'ml-foundations',
            difficulty: 'Intermediate',
            estimatedHours: 45,
            topics: ['Regression & Classification', 'Ensemble Methods (XGBoost/RandomForest)', 'Cross-Validation & GridSearch', 'Evaluation Metrics (F1, AUC-ROC)'],
            recommendedCourse: {
              title: 'Machine Learning with Python',
              provider: 'freeCodeCamp',
              url: 'https://www.freecodecamp.org/learn/machine-learning-with-python/',
              isFree: true
            }
          }
        ]
      },
      {
        phaseNumber: 3,
        title: 'Deep Learning & Neural Architectures',
        subtitle: 'PyTorch foundations, backpropagation, and transformer networks.',
        milestones: [
          {
            id: 'ml-m3',
            step: 3,
            title: 'PyTorch & Deep Neural Networks',
            description: 'Build neural networks from scratch, implement attention mechanisms, and train models on modern GPUs.',
            skillCode: 'pytorch-tf',
            difficulty: 'Advanced',
            estimatedHours: 45,
            topics: ['Neural Network Backpropagation', 'Convolutional & Recurrent Nets', 'Transformer Attention Mechanism', 'PyTorch Dataset & Training Loops'],
            recommendedCourse: {
              title: 'Machine Learning with Python',
              provider: 'freeCodeCamp',
              url: 'https://www.freecodecamp.org/learn/machine-learning-with-python/',
              isFree: true
            }
          }
        ]
      },
      {
        phaseNumber: 4,
        title: 'Generative AI, RAG & MLOps Deployment',
        subtitle: 'Deploying LLMs, vector search databases, and production inference.',
        milestones: [
          {
            id: 'ml-m4',
            step: 4,
            title: 'LLMs, Vector Search & MLOps Serving',
            description: 'Implement Retrieval-Augmented Generation (RAG) with vector databases, manage prompt templates, and serve models via APIs.',
            skillCode: 'llm-genai',
            difficulty: 'Advanced',
            estimatedHours: 40,
            topics: ['LLM Prompt Engineering & Guardrails', 'Vector Embeddings & pgvector', 'RAG Pipeline Architecture', 'Containerized Inference Serving'],
            recommendedCourse: {
              title: 'Introduction to Containers on Google Cloud',
              provider: 'Google Cloud Skills Boost',
              url: 'https://www.cloudskillsboost.google/course_templates/60',
              isFree: true
            }
          }
        ]
      }
    ]
  },

  'product-manager': {
    roleId: 'product-manager',
    roleTitle: 'Product Manager',
    roadmapShSlug: 'product-manager',
    roadmapShUrl: 'https://roadmap.sh/product-manager',
    overview: 'From user discovery and problem framing to PRDs, feature prioritization, product metrics, and cross-functional agile delivery.',
    totalEstimatedHours: 120,
    phases: [
      {
        phaseNumber: 1,
        title: 'Customer Discovery & Market Research',
        subtitle: 'Uncovering validated user pain points and market opportunities.',
        milestones: [
          {
            id: 'pm-m1',
            step: 1,
            title: 'User Research & Problem Definition',
            description: 'Conduct user interviews, synthesize personas, map customer journeys, and define high-impact problem statements.',
            skillCode: 'user-research',
            difficulty: 'Beginner',
            estimatedHours: 25,
            topics: ['Customer Interviewing Techniques', 'User Personas & Journey Mapping', 'Jobs-To-Be-Done (JTBD)', 'Problem Validation'],
            recommendedCourse: {
              title: 'CS50x: Introduction to Computer Science',
              provider: 'CS50',
              url: 'https://cs50.harvard.edu/x/',
              isFree: true
            }
          }
        ]
      },
      {
        phaseNumber: 2,
        title: 'Product Strategy, PRDs & Roadmapping',
        subtitle: 'Crafting clear product requirements and prioritizing releases.',
        milestones: [
          {
            id: 'pm-m2',
            step: 2,
            title: 'Product Requirements Documents (PRDs) & Prioritization',
            description: 'Write comprehensive PRDs, establish MVP scope, and prioritize backlog items using RICE and MoSCoW frameworks.',
            skillCode: 'prod-discovery',
            difficulty: 'Intermediate',
            estimatedHours: 35,
            topics: ['PRD Writing & Acceptance Criteria', 'RICE & MoSCoW Prioritization', 'Release Roadmapping', 'Value vs Effort Tradeoffs'],
            recommendedCourse: {
              title: 'CS50x: Introduction to Computer Science',
              provider: 'CS50',
              url: 'https://cs50.harvard.edu/x/',
              isFree: true
            }
          }
        ]
      },
      {
        phaseNumber: 3,
        title: 'Product Analytics & Experimentation',
        subtitle: 'Measuring product health, user engagement, and feature impact.',
        milestones: [
          {
            id: 'pm-m3',
            step: 3,
            title: 'Product Metrics & A/B Experimentation',
            description: 'Define North Star metrics, build conversion funnels, track cohort retention, and interpret A/B test results.',
            skillCode: 'product-analytics',
            difficulty: 'Intermediate',
            estimatedHours: 30,
            topics: ['North Star & Metric Hierarchies', 'Funnel & Cohort Analysis', 'A/B Test Design & Significance', 'Feature Adoption Telemetry'],
            recommendedCourse: {
              title: 'Data Analysis with Python',
              provider: 'freeCodeCamp',
              url: 'https://www.freecodecamp.org/learn/data-analysis-with-python/',
              isFree: true
            }
          }
        ]
      },
      {
        phaseNumber: 4,
        title: 'Agile Delivery & Stakeholder Alignment',
        subtitle: 'Collaborating effectively across engineering, design, and executive leadership.',
        milestones: [
          {
            id: 'pm-m4',
            step: 4,
            title: 'Agile Execution & Stakeholder Leadership',
            description: 'Lead sprint planning, conduct retrospectives, manage engineering dependencies, and present to executive leadership.',
            skillCode: 'agile-teamwork',
            difficulty: 'Advanced',
            estimatedHours: 30,
            topics: ['Scrum & Kanban Workflows', 'Engineering Technical Empathy', 'Executive Stakeholder Presentations', 'Go-To-Market (GTM) Coordination'],
            recommendedCourse: {
              title: 'Responsive Web Design Certification',
              provider: 'freeCodeCamp',
              url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
              isFree: true
            }
          }
        ]
      }
    ]
  },

  'business-analyst': {
    roleId: 'business-analyst',
    roleTitle: 'Business Analyst',
    roadmapShSlug: 'data-analyst',
    roadmapShUrl: 'https://roadmap.sh/data-analyst',
    overview: 'Bridge commercial strategy and software engineering with business process modeling, SQL querying, and executive KPI reporting.',
    totalEstimatedHours: 125,
    phases: [
      {
        phaseNumber: 1,
        title: 'Business Architecture & Process Modeling',
        subtitle: 'Documenting workflows and mapping as-is to to-be architectures.',
        milestones: [
          {
            id: 'ba-m1',
            step: 1,
            title: 'BPMN 2.0 Process Flow & Gap Analysis',
            description: 'Model business workflows, identify operational bottlenecks, and specify optimized to-be process maps.',
            skillCode: 'prod-discovery',
            difficulty: 'Beginner',
            estimatedHours: 25,
            topics: ['BPMN 2.0 Flowcharts', 'As-Is vs To-Be Gap Analysis', 'Root Cause Analysis', 'Operational Bottleneck Auditing'],
            recommendedCourse: {
              title: 'CS50x: Introduction to Computer Science',
              provider: 'CS50',
              url: 'https://cs50.harvard.edu/x/',
              isFree: true
            }
          }
        ]
      },
      {
        phaseNumber: 2,
        title: 'Data Extraction & Business SQL',
        subtitle: 'Validating business hypotheses directly against production databases.',
        milestones: [
          {
            id: 'ba-m2',
            step: 2,
            title: 'SQL Querying for Business Validation',
            description: 'Query relational tables, perform multi-table reconciliations, and validate operational KPIs with SQL.',
            skillCode: 'adv-sql',
            difficulty: 'Intermediate',
            estimatedHours: 35,
            topics: ['Data Reconciliation Queries', 'Multi-table JOINs & Aggregates', 'Business Logic Validation in SQL', 'Data Hygiene Checks'],
            recommendedCourse: {
              title: 'Relational Database Certification',
              provider: 'freeCodeCamp',
              url: 'https://www.freecodecamp.org/learn/relational-database/',
              isFree: true
            }
          }
        ]
      },
      {
        phaseNumber: 3,
        title: 'Requirements Engineering & Specification',
        subtitle: 'Translating business goals into precise engineering specifications.',
        milestones: [
          {
            id: 'ba-m3',
            step: 3,
            title: 'Functional Requirements & User Story Mapping',
            description: 'Write functional requirement documents (FRDs), user stories with Gherkin acceptance criteria, and traceability matrices.',
            skillCode: 'tech-writing',
            difficulty: 'Intermediate',
            estimatedHours: 35,
            topics: ['Functional vs Non-Functional Requirements', 'User Story Mapping', 'Gherkin Acceptance Criteria', 'Requirements Traceability Matrix'],
            recommendedCourse: {
              title: 'Responsive Web Design Certification',
              provider: 'freeCodeCamp',
              url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
              isFree: true
            }
          }
        ]
      },
      {
        phaseNumber: 4,
        title: 'Executive Reporting & Stakeholder Presentation',
        subtitle: 'Visualizing business performance and ROI justification.',
        milestones: [
          {
            id: 'ba-m4',
            step: 4,
            title: 'Executive Dashboards & Stakeholder Alignment',
            description: 'Design executive performance dashboards, quantify project ROI, and manage cross-departmental alignment.',
            skillCode: 'stakeholder-mgt',
            difficulty: 'Advanced',
            estimatedHours: 30,
            topics: ['Executive KPI Dashboarding', 'Cost-Benefit & ROI Analysis', 'Change Management Strategies', 'Cross-Functional Presentations'],
            recommendedCourse: {
              title: 'Data Analysis with Python',
              provider: 'freeCodeCamp',
              url: 'https://www.freecodecamp.org/learn/data-analysis-with-python/',
              isFree: true
            }
          }
        ]
      }
    ]
  },

  'cloud-architect': {
    roleId: 'cloud-architect',
    roleTitle: 'Cloud Solutions Architect',
    roadmapShSlug: 'devops',
    roadmapShUrl: 'https://roadmap.sh/devops',
    overview: 'Multi-cloud architecture, container orchestration, automated CI/CD pipelines, high-availability design, and Zero Trust security.',
    totalEstimatedHours: 155,
    phases: [
      {
        phaseNumber: 1,
        title: 'Linux Systems & Cloud Networking',
        subtitle: 'Operating system administration, VPC network design, and security groups.',
        milestones: [
          {
            id: 'ca-m1',
            step: 1,
            title: 'Operating Systems & Cloud Networking Foundations',
            description: 'Configure Linux system services, manage VPC subnets, route tables, security groups, and DNS routing.',
            skillCode: 'aws-cloud',
            difficulty: 'Beginner',
            estimatedHours: 30,
            topics: ['Linux Administration & Shell', 'VPC Subnets & CIDR Blocks', 'DNS, Load Balancers & TLS', 'IAM Security Policies'],
            recommendedCourse: {
              title: 'Introduction to Containers on Google Cloud',
              provider: 'Google Cloud Skills Boost',
              url: 'https://www.cloudskillsboost.google/course_templates/60',
              isFree: true
            }
          }
        ]
      },
      {
        phaseNumber: 2,
        title: 'Containerization & Kubernetes Orchestration',
        subtitle: 'Scalable microservices deployments and cluster management.',
        milestones: [
          {
            id: 'ca-m2',
            step: 2,
            title: 'Docker Containers & Kubernetes Clusters',
            description: 'Build optimized container images, author multi-stage Dockerfiles, and orchestrate pods, services, and ingresses.',
            skillCode: 'docker-k8s',
            difficulty: 'Intermediate',
            estimatedHours: 45,
            topics: ['Multi-stage Docker Builds', 'Kubernetes Pods & Deployments', 'Services & Ingress Controllers', 'ConfigMaps & Secrets'],
            recommendedCourse: {
              title: 'Introduction to Containers on Google Cloud',
              provider: 'Google Cloud Skills Boost',
              url: 'https://www.cloudskillsboost.google/course_templates/60',
              isFree: true
            }
          }
        ]
      },
      {
        phaseNumber: 3,
        title: 'CI/CD Automation & Infrastructure as Code (IaC)',
        subtitle: 'Declarative cloud provisioning and automated delivery pipelines.',
        milestones: [
          {
            id: 'ca-m3',
            step: 3,
            title: 'GitHub Actions & Infrastructure Automation',
            description: 'Implement automated build, test, and deploy pipelines with GitHub Actions, secret masking, and Terraform.',
            skillCode: 'cicd-github',
            difficulty: 'Advanced',
            estimatedHours: 40,
            topics: ['GitHub Actions Workflows', 'Automated Test & Build Stages', 'Infrastructure as Code (Terraform)', 'Blue-Green & Canary Deployments'],
            recommendedCourse: {
              title: 'Back End Development and APIs',
              provider: 'freeCodeCamp',
              url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/',
              isFree: true
            }
          }
        ]
      },
      {
        phaseNumber: 4,
        title: 'Distributed System Design & Resilience',
        subtitle: 'High availability, fault tolerance, and Zero Trust security.',
        milestones: [
          {
            id: 'ca-m4',
            step: 4,
            title: 'High Availability, Security & Observability',
            description: 'Design multi-region failover architectures, implement Zero Trust identity, and monitor systems with telemetry.',
            skillCode: 'sys-design',
            difficulty: 'Advanced',
            estimatedHours: 40,
            topics: ['Multi-Region Fault Tolerance', 'Zero Trust Architecture', 'Observability (Metrics & Logs)', 'Disaster Recovery RTO/RPO'],
            recommendedCourse: {
              title: 'CS50x: Introduction to Computer Science',
              provider: 'CS50',
              url: 'https://cs50.harvard.edu/x/',
              isFree: true
            }
          }
        ]
      }
    ]
  }
};

export function getCareerRoadmap(roleIdOrCode?: string | null): CareerRoadmapData {
  if (!roleIdOrCode) {
    return careerRoadmaps['fullstack-dev'];
  }
  const normalized = roleIdOrCode.toLowerCase();
  for (const [key, data] of Object.entries(careerRoadmaps)) {
    if (
      key === normalized ||
      data.roleTitle.toLowerCase() === normalized ||
      data.roadmapShSlug === normalized ||
      normalized.includes(key) ||
      key.includes(normalized)
    ) {
      return data;
    }
  }
  return careerRoadmaps['fullstack-dev'];
}
