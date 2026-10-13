import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { apiClient } from '../lib/api';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code2,
  BarChart3,
  Cloud,
  ShieldCheck,
  Users,
  Kanban,
  ChevronDown,
  Layers
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

const fallbackDomains = [
  { code: 'prog-soft-dev', name: 'Programming & Software Development' },
  { code: 'data-analytics', name: 'Data & Analytics' },
  { code: 'cloud-devops', name: 'Cloud & DevOps' },
  { code: 'ai-ml', name: 'AI & Machine Learning' },
  { code: 'cybersecurity', name: 'Cybersecurity & Digital Safety' },
  { code: 'communication-leadership', name: 'Communication & Leadership' },
  { code: 'product-management', name: 'Product & Project Management' }
];

const wizardRoles = [
  { id: 'fullstack-dev', labelKey: 'landing.wizard.roles.fullstack-dev' },
  { id: 'data-analyst', labelKey: 'landing.wizard.roles.data-analyst' },
  { id: 'cloud-engineer', labelKey: 'landing.wizard.roles.cloud-engineer' },
  { id: 'ml-engineer', labelKey: 'landing.wizard.roles.ml-engineer' },
  { id: 'appsec-engineer', labelKey: 'landing.wizard.roles.appsec-engineer' }
];

const wizardLevels = [
  { id: 'beginner', labelKey: 'landing.wizard.levels.beginner.label', subKey: 'landing.wizard.levels.beginner.sub' },
  { id: 'intermediate', labelKey: 'landing.wizard.levels.intermediate.label', subKey: 'landing.wizard.levels.intermediate.sub' },
  { id: 'advanced', labelKey: 'landing.wizard.levels.advanced.label', subKey: 'landing.wizard.levels.advanced.sub' }
];

const wizardHours = [
  { id: '3-5', labelKey: 'landing.wizard.hours.h3_5.label', subKey: 'landing.wizard.hours.h3_5.sub' },
  { id: '6-10', labelKey: 'landing.wizard.hours.h6_10.label', subKey: 'landing.wizard.hours.h6_10.sub' },
  { id: '11-15', labelKey: 'landing.wizard.hours.h11_15.label', subKey: 'landing.wizard.hours.h11_15.sub' },
  { id: '15+', labelKey: 'landing.wizard.hours.h15_plus.label', subKey: 'landing.wizard.hours.h15_plus.sub' }
];

const loopStepKeys = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6'];
const faqKeys = ['q1', 'q2', 'q3', 'q4'];

export function LandingPage() {
  const { t } = useTranslation();
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
            {t('landing.badge')}
          </Badge>

          {/* Headline shortened to 2 lines on desktop */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-foreground leading-[1.15] max-w-2xl">
            {t('landing.heroTitle')}
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground font-normal leading-relaxed max-w-2xl">
            {t('landing.heroSubtitle')}
          </p>

          <div className="pt-2">
            <Button
              size="lg"
              onClick={scrollToWizard}
              className="px-8 py-6 text-base font-semibold shadow-md bg-[#C2410C] hover:bg-[#9A3412] text-white"
            >
              {t('landing.heroCta')}
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
                  {t('landing.wizard.tag')}
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground mt-0.5">
                  {t('landing.wizard.title')}
                </h2>
              </div>
              <span className="text-xs text-muted-foreground self-start sm:self-auto">
                {t('landing.wizard.badge')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Wizard Step 1: Target Role */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <span className="w-5 h-5 rounded-full bg-[#C2410C]/10 text-[#C2410C] dark:bg-[#FB923C]/10 dark:text-[#FB923C] flex items-center justify-center font-bold">1</span>
                  {t('landing.wizard.step1Title')}
                </div>
                <div className="space-y-2">
                  {wizardRoles.map((role) => (
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
                      {t(role.labelKey)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wizard Step 2: Current Level */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <span className="w-5 h-5 rounded-full bg-[#C2410C]/10 text-[#C2410C] dark:bg-[#FB923C]/10 dark:text-[#FB923C] flex items-center justify-center font-bold">2</span>
                  {t('landing.wizard.step2Title')}
                </div>
                <div className="space-y-2">
                  {wizardLevels.map((lvl) => (
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
                      <div className="text-foreground font-medium">{t(lvl.labelKey)}</div>
                      <div className="text-xs text-muted-foreground">{t(lvl.subKey)}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Wizard Step 3: Weekly Commitment */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <span className="w-5 h-5 rounded-full bg-[#C2410C]/10 text-[#C2410C] dark:bg-[#FB923C]/10 dark:text-[#FB923C] flex items-center justify-center font-bold">3</span>
                  {t('landing.wizard.step3Title')}
                </div>
                <div className="space-y-2">
                  {wizardHours.map((hrs) => (
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
                      <div className="text-foreground font-medium">{t(hrs.labelKey)}</div>
                      <div className="text-xs text-muted-foreground">{t(hrs.subKey)}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border">
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                <span>{t('landing.wizard.summary')}</span>
              </div>
              <Button
                onClick={handleFinishWizard}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#C2410C] hover:bg-[#9A3412] text-white font-semibold shadow-sm"
              >
                {t('landing.wizard.cta')}
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
              {t('landing.sampleResult.tag')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
              {t('landing.sampleResult.title')}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t('landing.sampleResult.subtitle')}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-2">
              <div>
                <Badge variant="neutral" className="text-xs uppercase tracking-wider font-semibold mb-1">
                  {t('landing.sampleResult.badge')}
                </Badge>
                <h3 className="text-lg font-serif font-bold text-foreground">
                  {t('landing.sampleResult.role')}
                </h3>
              </div>
              <div className="text-left sm:text-right">
                {/* Updated copy per Item 3: "Estimated readiness" */}
                <div className="text-xs text-muted-foreground">{t('landing.sampleResult.readinessLabel')}</div>
                <div className="text-2xl font-serif font-bold text-[#C2410C] dark:text-[#FB923C]">{t('landing.sampleResult.readinessValue')}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('landing.sampleResult.competencySummary')}
                </div>
                <div className="space-y-2.5">
                  <div className="p-3 rounded-lg border border-border bg-background flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-foreground">TypeScript & JavaScript</div>
                      <div className="text-muted-foreground">
                        {t('landing.sampleResult.currentRequired', { current: '3.5', required: '4.0' })}
                      </div>
                    </div>
                    <Badge variant="default">{t('landing.sampleResult.gapMinor')}</Badge>
                  </div>

                  <div className="p-3 rounded-lg border border-border bg-background flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-foreground">System Design & Scalability</div>
                      <div className="text-muted-foreground">
                        {t('landing.sampleResult.currentRequired', { current: '1.0', required: '3.0' })}
                      </div>
                    </div>
                    <Badge variant="critical">{t('landing.sampleResult.gapCritical')}</Badge>
                  </div>

                  <div className="p-3 rounded-lg border border-border bg-background flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-foreground">OWASP Application Security</div>
                      <div className="text-muted-foreground">
                        {t('landing.sampleResult.currentRequired', { current: '2.0', required: '3.0' })}
                      </div>
                    </div>
                    <Badge variant="high">{t('landing.sampleResult.gapHigh')}</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('landing.sampleResult.targetedIntervention')}
                </div>
                <div className="p-4 rounded-xl border border-border bg-background space-y-3 text-xs">
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <BookOpen className="w-4 h-4 text-[#C2410C] dark:text-[#FB923C]" />
                    <span>{t('landing.sampleResult.topCoursesTitle')}</span>
                  </div>
                  <ul className="space-y-3 text-muted-foreground pl-1">
                    <li className="flex items-start gap-2.5">
                      <span className="font-bold text-[#C2410C] dark:text-[#FB923C] mt-0.5">•</span>
                      <div className="space-y-1">
                        <div>
                          <strong className="text-foreground">{t('landing.sampleResult.az305Title')}</strong>{' '}
                          <span className="text-xs text-muted-foreground">{t('landing.sampleResult.az305Provider')}</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground flex items-center flex-wrap gap-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#C2410C]/10 text-[#C2410C] dark:bg-[#FB923C]/10 dark:text-[#FB923C] font-semibold">
                            {t('landing.sampleResult.az305Covers')}
                          </span>
                          <span>{t('landing.sampleResult.az305Bridges')}</span>
                        </div>
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="font-bold text-[#C2410C] dark:text-[#FB923C] mt-0.5">•</span>
                      <div className="space-y-1">
                        <div>
                          <strong className="text-foreground">{t('landing.sampleResult.fccTitle')}</strong>{' '}
                          <span className="text-xs text-muted-foreground">{t('landing.sampleResult.fccProvider')}</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground flex items-center flex-wrap gap-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#C2410C]/10 text-[#C2410C] dark:bg-[#FB923C]/10 dark:text-[#FB923C] font-semibold">
                            {t('landing.sampleResult.fccCovers')}
                          </span>
                          <span>{t('landing.sampleResult.fccBridges')}</span>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <div className="pt-2 border-t border-border/80 text-[11px] text-muted-foreground">
                    {t('landing.sampleResult.sampleEstimate')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* "How It Works" Loop — Title shortened per Item 3 so no single word is orphaned */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#C2410C] dark:text-[#FB923C]">
            {t('landing.loop.tag')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
            {t('landing.loop.title')}
          </h2>
          <p className="text-muted-foreground text-sm">
            {t('landing.loop.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loopStepKeys.map((stepKey, idx) => (
            <div
              key={stepKey}
              className="p-6 rounded-2xl border border-border bg-card relative space-y-2 hover:border-[#C2410C]/40 dark:hover:border-[#FB923C]/40 transition-colors"
            >
              <div className="text-xs font-mono font-bold text-[#C2410C] dark:text-[#FB923C]">
                {`0${idx + 1}`}
              </div>
              <h3 className="font-serif font-bold text-lg text-foreground">
                {t(`landing.loop.steps.${stepKey}.title`)}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t(`landing.loop.steps.${stepKey}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Domain Cards with REAL database counts — "verified" removed per Item 3 */}
      <section className="py-20 bg-secondary/30 border-y border-border px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#C2410C] dark:text-[#FB923C]">
              {t('landing.domains.tag')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
              {statsLoading
                ? t('landing.domains.titleLoading')
                : stats && !statsError
                ? t('landing.domains.titleWithStats', {
                    domains: stats.totalDomains,
                    skills: stats.totalSkills,
                    questions: stats.totalQuestions
                  })
                : t('landing.domains.titleLoading')}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t('landing.domains.subtitle')}
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
                  const localizedName = t(`landing.domains.names.${d.code}`, { defaultValue: d.name });
                  const localizedDesc = t(`landing.domains.descriptions.${d.code}`, { defaultValue: d.description || '' });
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
                            {localizedName}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {localizedDesc}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                        <span>{t('landing.domains.coreSkills', { count: d.skillsCount })}</span>
                        <span className="font-medium text-foreground">{t('landing.domains.questions', { count: d.questionsCount })}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Row 2: Remaining 3 cards (3 centered on desktop, 2 on tablet with 3rd centered, 1 on mobile) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:max-w-5xl lg:mx-auto">
                {stats.domains.slice(4).map((d, idx) => {
                  const Icon = domainIconMap[d.code] || Layers;
                  const localizedName = t(`landing.domains.names.${d.code}`, { defaultValue: d.name });
                  const localizedDesc = t(`landing.domains.descriptions.${d.code}`, { defaultValue: d.description || '' });
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
                            {localizedName}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {localizedDesc}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                        <span>{t('landing.domains.coreSkills', { count: d.skillsCount })}</span>
                        <span className="font-medium text-foreground">{t('landing.domains.questions', { count: d.questionsCount })}</span>
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
                  const localizedName = t(`landing.domains.names.${d.code}`, { defaultValue: d.name });
                  const localizedDesc = t(`landing.domains.descriptions.${d.code}`, { defaultValue: '' });
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
                            {localizedName}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {localizedDesc}
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
                  const localizedName = t(`landing.domains.names.${d.code}`, { defaultValue: d.name });
                  const localizedDesc = t(`landing.domains.descriptions.${d.code}`, { defaultValue: '' });
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
                            {localizedName}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {localizedDesc}
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
            {t('landing.faq.tag')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
            {t('landing.faq.title')}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t('landing.faq.subtitle')}
          </p>
        </div>

        <div className="space-y-3">
          {faqKeys.map((k, idx) => {
            const isOpen = openFaqIdx === idx;
            const question = t(`landing.faq.items.${k}.question`);
            const answer = t(`landing.faq.items.${k}.answer`);
            return (
              <div
                key={k}
                className="rounded-xl border border-border bg-card overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-serif font-bold text-base text-foreground"
                >
                  <span>{question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                    {answer}
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
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="w-6 h-6 rounded bg-[#C2410C] text-white flex items-center justify-center font-serif font-bold text-xs flex-shrink-0">
                  S
                </span>
                <span className="font-serif font-bold text-foreground text-sm whitespace-nowrap">
                  Skill Setu
                </span>
              </div>
              <span>— {t('landing.footer.tagline')}</span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/courses" className="hover:text-foreground transition-colors">{t('landing.footer.courses')}</Link>
              <Link to="/login" className="hover:text-foreground transition-colors">{t('landing.footer.login')}</Link>
              <Link to="/signup" className="hover:text-foreground transition-colors">{t('landing.footer.signup')}</Link>
            </div>
          </div>

          <div className="border-t border-border/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
            <p>{t('landing.footer.copyright', { year: new Date().getFullYear() })}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
