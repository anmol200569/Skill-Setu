import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { apiClient } from '../lib/api';
import {
  Sparkles,
  ArrowRight,
  Target,
  BookOpen,
  BrainCircuit,
  Award,
  CheckCircle2,
  Code2,
  BarChart3,
  Cloud,
  ShieldCheck,
  Users,
  Kanban,
  HelpCircle,
  Clock,
  Layers,
  ChevronDown,
  RotateCcw,
  Compass,
  GraduationCap
} from 'lucide-react';

interface CompetencyStatsResponse {
  totalDomains: number;
  totalSkills: number;
  totalQuestions: number;
  domains: Array<{
    id?: string;
    code: string;
    name: string;
    description?: string;
    icon?: string | null;
    skillsCount: number;
    questionsCount: number;
  }>;
}

const domainIconMap: Record<string, any> = {
  'prog-soft-dev': Code2,
  'data-analytics': BarChart3,
  'cloud-devops': Cloud,
  'ai-ml': Sparkles,
  'cybersecurity': ShieldCheck,
  'communication-leadership': Users,
  'product-management': Kanban
};

const defaultDomainDescriptions: Record<string, string> = {
  'prog-soft-dev': 'ECMAScript runtime, TypeScript typing, React architecture, Node.js APIs, and relational modeling.',
  'data-analytics': 'Advanced SQL window functions, exploratory data analysis with Pandas, and executive storytelling.',
  'cloud-devops': 'Containers, Kubernetes orchestration, AWS cloud architecture, and CI/CD automation pipelines.',
  'ai-ml': 'Machine learning fundamentals, LLM prompt engineering, RAG vector search, and PyTorch training.',
  'cybersecurity': 'OWASP Top 10 web vulnerabilities, OAuth 2.0 / JWT identity, and zero-trust network defenses.',
  'communication-leadership': 'Technical writing, architectural RFCs, stakeholder alignment, and agile code review culture.',
  'product-management': 'Product discovery, PRD authoring, North Star metrics, cohort retention, and UX design thinking.'
};

const fallbackDomains = [
  { code: 'prog-soft-dev', name: 'Programming & Software Development' },
  { code: 'data-analytics', name: 'Data & Analytics' },
  { code: 'cloud-devops', name: 'Cloud & DevOps' },
  { code: 'ai-ml', name: 'AI & Machine Learning' },
  { code: 'cybersecurity', name: 'Cybersecurity & Digital Safety' },
  { code: 'communication-leadership', name: 'Communication & Leadership' },
  { code: 'product-management', name: 'Product & Project Management' }
];

const howItWorksSteps = [
  {
    number: '01',
    title: 'Assess',
    desc: 'Complete focused diagnostic assessments covering genuine workplace code scenarios and architecture dilemmas.'
  },
  {
    number: '02',
    title: 'Score',
    desc: 'Receive calibrated 1.0 to 5.0 proficiency scores derived from objective testing and self-assessment rubrics.'
  },
  {
    number: '03',
    title: 'Skill Graph',
    desc: 'View an instant radar visualization highlighting must-have role requirements versus your current proficiencies.'
  },
  {
    number: '04',
    title: 'Learn',
    desc: 'Follow curated, step-by-step pathways assembled exclusively from verified free resources from Microsoft, Google, and CS50.'
  },
  {
    number: '05',
    title: 'Practice',
    desc: 'Generate interactive revision quizzes from course materials or notes using our integrated AI study assistant.'
  },
  {
    number: '06',
    title: 'Re-Score',
    desc: 'Retake diagnostic modules as you complete courses to watch your quantified qualification score increase.'
  }
];

const faqItems = [
  {
    question: 'Does Skill Setu guarantee a job, placement, or interview?',
    answer: 'No. Skill Setu is an educational benchmarking and skill gap diagnostics tool, not a recruitment agency, staffing firm, or placement bootcamp. We help you systematically uncover where your technical skills fall short of industry role benchmarks and connect you with free curricula to bridge those gaps. Hiring decisions depend on employers, market dynamics, and your independent project portfolio.'
  },
  {
    question: 'How are diagnostic questions scored and evaluated?',
    answer: 'Every diagnostic assessment calculates a score using verified competency frameworks on a 1.0 to 5.0 scale. Option orders are shuffled on every attempt to eliminate positional bias, and questions feature explanations for both correct choices and common misconceptions.'
  },
  {
    question: 'Are the recommended learning paths genuinely free?',
    answer: 'Yes. Our catalog indexes over 60 verified courses from open educational providers including Microsoft Learn, Google Cloud Skills Boost, freeCodeCamp, CS50, and NPTEL. You will never encounter a paywall inside our recommended course pathways.'
  },
  {
    question: 'Can I change my target career role after signing up?',
    answer: 'Yes. You can change or compare target roles at any time in your profile dashboard. Switching roles automatically re-computes your readiness score and reprioritizes your course suggestions.'
  }
];

export function LandingPage() {
  const navigate = useNavigate();

  // Dynamic Competency Stats from DB
  const [stats, setStats] = useState<CompetencyStatsResponse | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    apiClient<CompetencyStatsResponse>('/competency/stats')
      .then((data) => {
        if (isMounted) {
          if (data && data.totalDomains > 0) {
            setStats(data);
          } else {
            setStatsError(true);
          }
          setStatsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setStatsError(true);
          setStatsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Inline 3-Step Mini Wizard State
  const [selectedRole, setSelectedRole] = useState('fullstack-dev');
  const [selectedLevel, setSelectedLevel] = useState('intermediate');
  const [selectedHours, setSelectedHours] = useState('6-10');
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const handleFinishWizard = () => {
    const pathwayData = {
      role: selectedRole,
      level: selectedLevel,
      hours: selectedHours
    };
    try {
      localStorage.setItem('skill_setu_pathway', JSON.stringify(pathwayData));
    } catch (_) {}

    navigate(`/signup?role=${encodeURIComponent(selectedRole)}&level=${encodeURIComponent(selectedLevel)}&hours=${encodeURIComponent(selectedHours)}`);
  };

  const scrollToWizard = () => {
    const el = document.getElementById('pathway-wizard');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />

      {/* Hero Section: ONE Promise, ONE Button */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
          <Badge variant="default" className="px-3.5 py-1 text-xs uppercase tracking-wider font-semibold">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Open Technical Skill Intelligence
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-foreground leading-[1.15]">
            Know your technical skill gaps. Bridge them with structured open learning.
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground font-normal leading-relaxed max-w-2xl">
            Objective diagnostic assessments mapped to real industry competencies. Discover your verified proficiency, benchmark against role requirements, and follow curated open-source courses.
          </p>

          <div className="pt-2">
            <Button
              size="lg"
              onClick={scrollToWizard}
              className="px-8 py-6 text-base font-semibold shadow-md bg-[#C2410C] hover:bg-[#9A3412] text-white"
            >
              Configure Your Pathway
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Inline 3-Step Mini Wizard */}
        <div id="pathway-wizard" className="mt-16 sm:mt-20 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-8">
            <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#C2410C] dark:text-[#FB923C]">
                  Step-by-Step Setup
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground mt-0.5">
                  Plan Your Diagnostic Pathway in 30 Seconds
                </h2>
              </div>
              <span className="text-xs text-muted-foreground self-start sm:self-auto">
                No credit card • Answers carry into signup
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Wizard Step 1: Target Role */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <span className="w-5 h-5 rounded-full bg-[#C2410C]/10 text-[#C2410C] dark:bg-[#FB923C]/10 dark:text-[#FB923C] flex items-center justify-center font-bold">1</span>
                  Select Target Role
                </div>
                <div className="space-y-2">
                  {[
                    { id: 'fullstack-dev', label: 'Full-Stack Developer' },
                    { id: 'data-analyst', label: 'Data Analyst' },
                    { id: 'cloud-engineer', label: 'Cloud & DevOps Engineer' },
                    { id: 'ml-engineer', label: 'Machine Learning Engineer' },
                    { id: 'appsec-engineer', label: 'Application Security' }
                  ].map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-sm transition-colors ${
                        selectedRole === role.id
                          ? 'border-[#C2410C] dark:border-[#FB923C] bg-[#C2410C]/5 dark:bg-[#FB923C]/10 font-semibold text-foreground'
                          : 'border-border bg-background hover:bg-secondary/40 text-muted-foreground'
                      }`}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wizard Step 2: Current Level */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <span className="w-5 h-5 rounded-full bg-[#C2410C]/10 text-[#C2410C] dark:bg-[#FB923C]/10 dark:text-[#FB923C] flex items-center justify-center font-bold">2</span>
                  Self-Assessed Level
                </div>
                <div className="space-y-2">
                  {[
                    { id: 'beginner', label: 'Foundational / Beginner', sub: 'Starting from core basics' },
                    { id: 'intermediate', label: 'Intermediate Developer', sub: '1-3 years practical coding' },
                    { id: 'advanced', label: 'Senior / Transitioning', sub: 'Solid base, targeting gaps' }
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setSelectedLevel(lvl.id)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-sm transition-colors ${
                        selectedLevel === lvl.id
                          ? 'border-[#C2410C] dark:border-[#FB923C] bg-[#C2410C]/5 dark:bg-[#FB923C]/10 font-semibold text-foreground'
                          : 'border-border bg-background hover:bg-secondary/40 text-muted-foreground'
                      }`}
                    >
                      <div className="text-foreground font-medium">{lvl.label}</div>
                      <div className="text-xs text-muted-foreground">{lvl.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Wizard Step 3: Weekly Commitment */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <span className="w-5 h-5 rounded-full bg-[#C2410C]/10 text-[#C2410C] dark:bg-[#FB923C]/10 dark:text-[#FB923C] flex items-center justify-center font-bold">3</span>
                  Weekly Commitment
                </div>
                <div className="space-y-2">
                  {[
                    { id: '3-5', label: '3 to 5 hours / week', sub: 'Consistent light pace' },
                    { id: '6-10', label: '6 to 10 hours / week', sub: 'Recommended standard' },
                    { id: '11-15', label: '11 to 15 hours / week', sub: 'Accelerated study' },
                    { id: '15+', label: '15+ hours / week', sub: 'Immersive focus' }
                  ].map((hrs) => (
                    <button
                      key={hrs.id}
                      type="button"
                      onClick={() => setSelectedHours(hrs.id)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-sm transition-colors ${
                        selectedHours === hrs.id
                          ? 'border-[#C2410C] dark:border-[#FB923C] bg-[#C2410C]/5 dark:bg-[#FB923C]/10 font-semibold text-foreground'
                          : 'border-border bg-background hover:bg-secondary/40 text-muted-foreground'
                      }`}
                    >
                      <div className="text-foreground font-medium">{hrs.label}</div>
                      <div className="text-xs text-muted-foreground">{hrs.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border">
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                <span>Ready to initialize your benchmark audit with these selections.</span>
              </div>
              <Button
                onClick={handleFinishWizard}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#C2410C] hover:bg-[#9A3412] text-white font-semibold shadow-sm"
              >
                Continue with This Pathway
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Clearly Labelled Sample Result Card */}
      <section className="py-16 bg-secondary/30 border-y border-border px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#C2410C] dark:text-[#FB923C]">
              What You Will Receive
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
              A Concrete Diagnostic Gap Analysis
            </h2>
            <p className="text-sm text-muted-foreground">
              Every learner gets an objective evaluation with verified scores, identified gaps, and exact courses to take.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-2">
              <div>
                <Badge variant="neutral" className="text-xs uppercase tracking-wider font-semibold mb-1">
                  Sample Result — Illustrative Only
                </Badge>
                <h3 className="text-lg font-serif font-bold text-foreground">
                  Target Role: Full-Stack Developer
                </h3>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-xs text-muted-foreground">Estimated Qualification Readiness</div>
                <div className="text-2xl font-serif font-bold text-[#C2410C] dark:text-[#FB923C]">Readiness 68/100 (Sample)</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Competency Evaluation Summary
                </div>
                <div className="space-y-2.5">
                  <div className="p-3 rounded-lg border border-border bg-background flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-foreground">TypeScript & JavaScript</div>
                      <div className="text-muted-foreground">Current: 3.5 / 5 • Required: 4.0 / 5</div>
                    </div>
                    <Badge variant="default">Minor Gap (-0.5)</Badge>
                  </div>

                  <div className="p-3 rounded-lg border border-border bg-background flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-foreground">System Design & Scalability</div>
                      <div className="text-muted-foreground">Current: 1.0 / 5 • Required: 3.0 / 5</div>
                    </div>
                    <Badge variant="critical">Critical Gap (-2.0)</Badge>
                  </div>

                  <div className="p-3 rounded-lg border border-border bg-background flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-foreground">OWASP Application Security</div>
                      <div className="text-muted-foreground">Current: 2.0 / 5 • Required: 3.0 / 5</div>
                    </div>
                    <Badge variant="high">High Gap (-1.0)</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Targeted Learning Intervention
                </div>
                <div className="p-4 rounded-xl border border-border bg-background space-y-3 text-xs">
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <BookOpen className="w-4 h-4 text-[#C2410C] dark:text-[#FB923C]" />
                    <span>Top High-Impact Course Recommendations:</span>
                  </div>
                  <ul className="space-y-3 text-muted-foreground pl-1">
                    <li className="flex items-start gap-2.5">
                      <span className="font-bold text-[#C2410C] dark:text-[#FB923C] mt-0.5">•</span>
                      <div className="space-y-1">
                        <div>
                          <strong className="text-foreground">Designing Azure Infrastructure Solutions (AZ-305)</strong>{' '}
                          <span className="text-xs text-muted-foreground">(Microsoft Learn)</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground flex items-center flex-wrap gap-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#C2410C]/10 text-[#C2410C] dark:bg-[#FB923C]/10 dark:text-[#FB923C] font-semibold">
                            Covers: System Design & Scalability (sys-design)
                          </span>
                          <span>Bridges 2.0 score units • 32 hrs</span>
                        </div>
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="font-bold text-[#C2410C] dark:text-[#FB923C] mt-0.5">•</span>
                      <div className="space-y-1">
                        <div>
                          <strong className="text-foreground">Information Security Certification Track</strong>{' '}
                          <span className="text-xs text-muted-foreground">(freeCodeCamp)</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground flex items-center flex-wrap gap-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#C2410C]/10 text-[#C2410C] dark:bg-[#FB923C]/10 dark:text-[#FB923C] font-semibold">
                            Covers: Application Security (OWASP Top 10) (appsec-owasp)
                          </span>
                          <span>Bridges 1.0 score units • 40 hrs</span>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <div className="pt-2 border-t border-border/80 text-[11px] text-muted-foreground">
                    Sample estimate: Completing these two targeted courses raises estimated readiness to <strong>86/100</strong>.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* "How It Works" Loop */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#C2410C] dark:text-[#FB923C]">
            Continuous Improvement
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
            The Skill Setu Continuous Growth Loop
          </h2>
          <p className="text-muted-foreground text-sm">
            A cyclical framework designed to move you from uncertain self-assessments to verified, demonstrable competency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {howItWorksSteps.map((step) => (
            <div
              key={step.number}
              className="p-6 rounded-2xl border border-border bg-card relative space-y-2 hover:border-[#C2410C]/40 dark:hover:border-[#FB923C]/40 transition-colors"
            >
              <div className="text-xs font-mono font-bold text-[#C2410C] dark:text-[#FB923C]">
                {step.number}
              </div>
              <h3 className="font-serif font-bold text-lg text-foreground">
                {step.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Domain Cards with REAL database counts */}
      <section className="py-20 bg-secondary/30 border-y border-border px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#C2410C] dark:text-[#FB923C]">
              Comprehensive Curriculum Bank
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
              {statsLoading
                ? 'Curated Technical Competencies & Question Banks'
                : stats && !statsError
                ? `${stats.totalDomains} Domains, ${stats.totalSkills} Competencies, ${stats.totalQuestions} Curated Questions`
                : 'Curated Technical Competencies & Question Banks'}
            </h2>
            <p className="text-sm text-muted-foreground">
              Real competency models and verified assessment banks loaded dynamically from our database.
            </p>
          </div>

          {statsLoading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl border border-border bg-card animate-pulse space-y-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-muted" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-full" />
                      <div className="h-3 bg-muted rounded w-5/6" />
                    </div>
                    <div className="pt-3 border-t border-border flex justify-between">
                      <div className="h-3 bg-muted rounded w-1/4" />
                      <div className="h-3 bg-muted rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:max-w-5xl lg:mx-auto">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl border border-border bg-card animate-pulse space-y-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-muted" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-full" />
                      <div className="h-3 bg-muted rounded w-5/6" />
                    </div>
                    <div className="pt-3 border-t border-border flex justify-between">
                      <div className="h-3 bg-muted rounded w-1/4" />
                      <div className="h-3 bg-muted rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : stats && !statsError && stats.domains.length > 0 ? (
            /* 4 + 3 centered layout on desktop, 2 columns on tablet, 1 on mobile */
            <div className="space-y-6">
              {/* Row 1: First 4 cards (4 on desktop, 2 on tablet, 1 on mobile) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.domains.slice(0, 4).map((d) => {
                  const Icon = domainIconMap[d.code] || Layers;
                  const description = d.description || defaultDomainDescriptions[d.code] || '';
                  return (
                    <div
                      key={d.code}
                      className="p-6 rounded-2xl border border-border bg-card flex flex-col justify-between space-y-4 hover:border-[#C2410C]/50 dark:hover:border-[#FB923C]/50 transition-colors"
                    >
                      <div className="space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-[#C2410C]/10 text-[#C2410C] dark:bg-[#FB923C]/10 dark:text-[#FB923C] flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-serif font-bold text-base text-foreground">
                            {d.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {description}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                        <span>{d.skillsCount} Core Skills</span>
                        <span className="font-medium text-foreground">{d.questionsCount} Questions</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Row 2: Remaining 3 cards (3 centered on desktop, 2 on tablet with 3rd centered, 1 on mobile) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:max-w-5xl lg:mx-auto">
                {stats.domains.slice(4).map((d, idx) => {
                  const Icon = domainIconMap[d.code] || Layers;
                  const description = d.description || defaultDomainDescriptions[d.code] || '';
                  return (
                    <div
                      key={d.code}
                      className={`p-6 rounded-2xl border border-border bg-card flex flex-col justify-between space-y-4 hover:border-[#C2410C]/50 dark:hover:border-[#FB923C]/50 transition-colors ${
                        idx === 2 ? 'sm:col-span-2 sm:max-w-md sm:mx-auto sm:w-full lg:col-span-1 lg:max-w-none' : ''
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-[#C2410C]/10 text-[#C2410C] dark:bg-[#FB923C]/10 dark:text-[#FB923C] flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-serif font-bold text-base text-foreground">
                            {d.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {description}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                        <span>{d.skillsCount} Core Skills</span>
                        <span className="font-medium text-foreground">{d.questionsCount} Questions</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Safe Fallback: hides numbers if API call fails or returns empty */
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {fallbackDomains.slice(0, 4).map((d) => {
                  const Icon = domainIconMap[d.code] || Layers;
                  const description = defaultDomainDescriptions[d.code] || '';
                  return (
                    <div
                      key={d.code}
                      className="p-6 rounded-2xl border border-border bg-card flex flex-col justify-between space-y-4 hover:border-[#C2410C]/50 dark:hover:border-[#FB923C]/50 transition-colors"
                    >
                      <div className="space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-[#C2410C]/10 text-[#C2410C] dark:bg-[#FB923C]/10 dark:text-[#FB923C] flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-serif font-bold text-base text-foreground">
                            {d.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:max-w-5xl lg:mx-auto">
                {fallbackDomains.slice(4).map((d, idx) => {
                  const Icon = domainIconMap[d.code] || Layers;
                  const description = defaultDomainDescriptions[d.code] || '';
                  return (
                    <div
                      key={d.code}
                      className={`p-6 rounded-2xl border border-border bg-card flex flex-col justify-between space-y-4 hover:border-[#C2410C]/50 dark:hover:border-[#FB923C]/50 transition-colors ${
                        idx === 2 ? 'sm:col-span-2 sm:max-w-md sm:mx-auto sm:w-full lg:col-span-1 lg:max-w-none' : ''
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-[#C2410C]/10 text-[#C2410C] dark:bg-[#FB923C]/10 dark:text-[#FB923C] flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-serif font-bold text-base text-foreground">
                            {d.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Honest FAQ (including "no job guarantee") */}
      <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto w-full space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#C2410C] dark:text-[#FB923C]">
            Transparency First
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-muted-foreground">
            Clear, honest answers about our methodology, scope, and guarantees.
          </p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-border bg-card overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-serif font-bold text-base text-foreground"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-card py-12 px-4 sm:px-6 text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-[#C2410C] text-white flex items-center justify-center font-serif font-bold text-xs">
                S
              </span>
              <span className="font-serif font-bold text-foreground text-sm">Skill Setu</span>
              <span>— Open Skill Intelligence & Learning Platform</span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/courses" className="hover:text-foreground transition-colors">Courses Catalog</Link>
              <Link to="/login" className="hover:text-foreground transition-colors">Learner Login</Link>
              <Link to="/signup" className="hover:text-foreground transition-colors">Sign Up</Link>
            </div>
          </div>

          <div className="border-t border-border/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
            <p>© {new Date().getFullYear()} Skill Setu. Open-source educational diagnostics platform. All course trademarks belong to their respective owners.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
