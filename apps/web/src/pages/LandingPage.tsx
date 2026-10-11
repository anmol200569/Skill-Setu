import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useTranslation } from 'react-i18next';
import {
  Sparkles,
  ArrowRight,
  Target,
  BookOpen,
  FileText,
  BrainCircuit,
  Award,
  CheckCircle2,
  TrendingUp,
  Cpu
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';

const sampleRadarData = [
  { skill: 'TypeScript', current: 2, required: 4 },
  { skill: 'React Architecture', current: 3, required: 4 },
  { skill: 'Node.js APIs', current: 2.5, required: 4 },
  { skill: 'System Design', current: 1.5, required: 3 },
  { skill: 'SQL & Database', current: 3.5, required: 4 },
  { skill: 'App Security', current: 2, required: 3 }
];

export function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
          <Badge variant="default" className="px-3.5 py-1 text-xs uppercase tracking-wider font-semibold">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            {t('landing.badge')}
          </Badge>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-foreground leading-[1.1]">
            {t('landing.title')}
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl font-normal leading-relaxed">
            {t('landing.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto px-8 text-base shadow-md font-semibold">
                {t('landing.ctaStart')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/courses">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-6 text-base">
                {t('landing.ctaExplore')}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-10 border-t border-border/80 w-full max-w-xl text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-foreground">50+</div>
              <div className="text-xs text-muted-foreground mt-0.5">{t('landing.statsCurated')}</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#C2410C]">1 - 5</div>
              <div className="text-xs text-muted-foreground mt-0.5">Proficiency Metric</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-foreground">98.4%</div>
              <div className="text-xs text-muted-foreground mt-0.5">{t('landing.statsAccuracy')}</div>
            </div>
          </div>
        </div>

        {/* Realistic Skill-Gap Report Preview */}
        <div className="mt-16 sm:mt-24 rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-xl max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-border gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-[#C2410C]">
                Diagnostic Intelligence Report Preview
              </span>
              <h3 className="text-2xl font-serif font-bold text-foreground mt-1">
                Full-Stack Developer Qualification Audit
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Overall Readiness</div>
                <div className="text-2xl font-bold font-serif text-[#C2410C]">68%</div>
              </div>
              <div className="h-10 w-10 rounded-full border-4 border-[#C2410C] flex items-center justify-center font-bold text-xs">
                B+
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
            {/* Radar Chart */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center bg-background/50 rounded-xl p-4 border border-border/60">
              <span className="text-xs font-semibold text-muted-foreground mb-2">
                Proficiency Competency Mapping (1 to 5 Scale)
              </span>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={sampleRadarData}>
                    <PolarGrid stroke="#D4D0C5" />
                    <PolarAngleAxis dataKey="skill" tick={{ fill: '#6B6861', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#6B6861', fontSize: 10 }} />
                    <Radar name="Current Proficiency" dataKey="current" stroke="#C2410C" fill="#C2410C" fillOpacity={0.4} />
                    <Radar name="Target Requirement" dataKey="required" stroke="#1A1A18" fill="#1A1A18" fillOpacity={0.15} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-6 text-xs text-muted-foreground mt-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#C2410C]"></span> Current Level
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#1A1A18]"></span> Role Requirement
                </span>
              </div>
            </div>

            {/* Gap Table & Summary */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Ranked Priority Gaps
                </h4>
                <div className="space-y-2.5">
                  <div className="p-3 rounded-lg border border-border bg-secondary/30 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm text-foreground">System Design & Scalability</div>
                      <div className="text-xs text-muted-foreground">Current: 1.5/5 • Required: 3.0/5</div>
                    </div>
                    <Badge variant="critical">Critical Gap (-1.5)</Badge>
                  </div>
                  <div className="p-3 rounded-lg border border-border bg-secondary/30 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm text-foreground">TypeScript & Advanced Types</div>
                      <div className="text-xs text-muted-foreground">Current: 2.0/5 • Required: 4.0/5</div>
                    </div>
                    <Badge variant="high">High Gap (-2.0)</Badge>
                  </div>
                  <div className="p-3 rounded-lg border border-border bg-secondary/30 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm text-foreground">OWASP Application Security</div>
                      <div className="text-xs text-muted-foreground">Current: 2.0/5 • Required: 3.0/5</div>
                    </div>
                    <Badge variant="medium">Medium Gap (-1.0)</Badge>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#C2410C]/30 bg-[#C2410C]/5 text-xs text-foreground/90 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-[#C2410C]">
                  <BrainCircuit className="w-4 h-4" />
                  AI Synthesis & Recommendation
                </div>
                <p className="leading-relaxed text-muted-foreground">
                  Your core foundation in relational databases is solid. Completing the recommended System Design Primer track and TypeScript production modules will bridge 78% of your critical role gap.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-20 bg-secondary/40 border-y border-border px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
              Built for precision learning, not aimless tutorials.
            </h2>
            <p className="text-muted-foreground mt-3 text-base">
              Skill Setu connects diagnostic testing with verified role benchmarks from leading technology leaders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="w-12 h-12 rounded-lg bg-[#C2410C]/10 text-[#C2410C] flex items-center justify-center mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-foreground mb-2">Diagnostic Assessments</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Objective evaluations with timed test scenarios and weighted formula scoring to establish genuine skill proficiency.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="w-12 h-12 rounded-lg bg-[#C2410C]/10 text-[#C2410C] flex items-center justify-center mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-foreground mb-2">AI Quiz Generator</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Upload your lecture PDFs, slide decks, or notes. Gemini crafts rigorous MCQs, multi-correct, and True/False tests with instant PDF export.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="w-12 h-12 rounded-lg bg-[#C2410C]/10 text-[#C2410C] flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-foreground mb-2">Curated Free Courses</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Over 50 verified learning paths from Microsoft Learn, freeCodeCamp, NPTEL, and Harvard CS50 mapped specifically to your ranked gaps.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="w-12 h-12 rounded-lg bg-[#C2410C]/10 text-[#C2410C] flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-foreground mb-2">Adaptive Learning Path</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A structured, step-by-step roadmap tailored to your weekly available hours, learning style, and target role criteria.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Careers Section */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="neutral" className="mb-2">Industry Benchmarks</Badge>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
            Target high-impact technology careers
          </h2>
          <p className="text-muted-foreground mt-2">
            Each role includes verified competency matrices with 1-5 proficiency thresholds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-border bg-card hover:border-[#C2410C]/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-serif font-bold text-lg text-foreground">Full-Stack Developer</h4>
              <Badge variant="high">Very High Demand</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              TypeScript, React, Node.js, relational schema design, system architecture, and OWASP application security.
            </p>
            <div className="text-xs font-semibold text-[#C2410C]">8 Required Competencies</div>
          </div>

          <div className="p-6 rounded-xl border border-border bg-card hover:border-[#C2410C]/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-serif font-bold text-lg text-foreground">Data Analyst</h4>
              <Badge variant="default">High Demand</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Advanced SQL window functions, exploratory data analysis with Pandas, Power BI executive storytelling, and BI modeling.
            </p>
            <div className="text-xs font-semibold text-[#C2410C]">6 Required Competencies</div>
          </div>

          <div className="p-6 rounded-xl border border-border bg-card hover:border-[#C2410C]/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-serif font-bold text-lg text-foreground">ML Engineer</h4>
              <Badge variant="critical">Critical Demand</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Python, machine learning mathematics, Generative AI engineering, RAG pipelines, vector databases, and model deployment.
            </p>
            <div className="text-xs font-semibold text-[#C2410C]">7 Required Competencies</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-card py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Skill Setu" className="w-5 h-5 rounded" />
            <span className="font-serif font-bold text-foreground">Skill Setu</span>
            <span>— AI Skill Intelligence & Learning Platform</span>
          </div>
          <div>Built with Supabase PostgreSQL, Google Gemini AI & React 18</div>
        </div>
      </footer>
    </div>
  );
}
