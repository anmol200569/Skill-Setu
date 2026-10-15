import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { getLandingPageRedirect, getPrefilledWizardRole } from '../lib/authRedirect';
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
  GraduationCap,
  Target,
  Globe,
  Layers,
  HelpCircle,
  Laptop
} from 'lucide-react';

const wizardRoles = [
  { id: 'fullstack-dev', labelKey: 'landing.wizard.roles.fullstack-dev', defaultLabel: 'Full-Stack Developer' },
  { id: 'data-analyst', labelKey: 'landing.wizard.roles.data-analyst', defaultLabel: 'Data Analyst' },
  { id: 'ml-engineer', labelKey: 'landing.wizard.roles.ml-engineer', defaultLabel: 'Machine Learning Engineer' },
  { id: 'product-manager', labelKey: 'landing.wizard.roles.product-manager', defaultLabel: 'Product Manager' },
  { id: 'business-analyst', labelKey: 'landing.wizard.roles.business-analyst', defaultLabel: 'Business Analyst' },
  { id: 'cloud-architect', labelKey: 'landing.wizard.roles.cloud-architect', defaultLabel: 'Cloud Solutions Architect' }
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

const genuineCategories = [
  {
    id: 'prog-soft-dev',
    nameKey: 'landing.categories.progSoftDev',
    defaultName: 'Programming & Software Development',
    icon: Code2,
    colorClass: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100/70 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900',
    query: 'programming'
  },
  {
    id: 'data-analytics',
    nameKey: 'landing.categories.dataAnalytics',
    defaultName: 'Data & Analytics',
    icon: BarChart3,
    colorClass: 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100/70 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900',
    query: 'data'
  },
  {
    id: 'cloud-devops',
    nameKey: 'landing.categories.cloudDevops',
    defaultName: 'Cloud & DevOps',
    icon: Cloud,
    colorClass: 'bg-cyan-50 text-cyan-600 border-cyan-100 hover:bg-cyan-100/70 dark:bg-cyan-950/40 dark:text-cyan-400 dark:border-cyan-900',
    query: 'cloud'
  },
  {
    id: 'ai-ml',
    nameKey: 'landing.categories.aiMl',
    defaultName: 'AI & Machine Learning',
    icon: Sparkles,
    colorClass: 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100/70 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900',
    query: 'machine learning'
  },
  {
    id: 'cybersecurity',
    nameKey: 'landing.categories.cybersecurity',
    defaultName: 'Cybersecurity & AppSec',
    icon: ShieldCheck,
    colorClass: 'bg-teal-50 text-teal-600 border-teal-100 hover:bg-teal-100/70 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-900',
    query: 'security'
  },
  {
    id: 'communication-leadership',
    nameKey: 'landing.categories.commLeadership',
    defaultName: 'Communication & Leadership',
    icon: Users,
    colorClass: 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100/70 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900',
    query: 'communication'
  },
  {
    id: 'product-management',
    nameKey: 'landing.categories.productManagement',
    defaultName: 'Product & Project Management',
    icon: Kanban,
    colorClass: 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100/70 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900',
    query: 'product'
  }
];

export function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, profile, role } = useAuth();

  // Logged-in users with a saved target role navigate directly to dashboard
  useEffect(() => {
    const redirectPath = getLandingPageRedirect({ user, profile, role });
    if (redirectPath) {
      navigate(redirectPath, { replace: true });
    }
  }, [user, profile, role, navigate]);

  // Inline Wizard State
  const [selectedRole, setSelectedRole] = useState(() => getPrefilledWizardRole(profile, 'fullstack-dev'));
  const [selectedLevel, setSelectedLevel] = useState('intermediate');
  const [selectedHours, setSelectedHours] = useState('6-10');

  useEffect(() => {
    if (profile) {
      setSelectedRole(getPrefilledWizardRole(profile, selectedRole));
    }
  }, [profile]);

  const handleFinishWizard = () => {
    const pathwayData = {
      role: selectedRole,
      level: selectedLevel,
      hours: selectedHours
    };
    try {
      localStorage.setItem('skill_setu_pathway', JSON.stringify(pathwayData));
    } catch (_) {}

    if (user) {
      navigate(`/assessments?role=${encodeURIComponent(selectedRole)}&startBaseline=true`);
    } else {
      navigate(`/signup?role=${encodeURIComponent(selectedRole)}&level=${encodeURIComponent(selectedLevel)}&hours=${encodeURIComponent(selectedHours)}`);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-foreground flex flex-col font-sans overflow-x-hidden selection:bg-blue-500/20 selection:text-blue-600">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 md:pt-16 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Subtitle, CTA & Real Platform Stats */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7 text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>{t('landing.hero.pill', { defaultValue: 'OPEN TECHNICAL EDUCATION' })}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[3.8rem] font-extrabold tracking-tight text-foreground leading-[1.15] lg:leading-[1.12] break-words">
              {t('landing.hero.titleLine1', { defaultValue: 'Skills Today' })} <br />
              <span className="text-foreground">{t('landing.hero.titleLine2', { defaultValue: 'A Brighter ' })}</span>
              <span className="text-blue-600 dark:text-blue-400">{t('landing.hero.titleLine3', { defaultValue: 'Tomorrow' })}</span>
            </h1>

            {/* Subtitle - Accurate to what exists in the app */}
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-normal leading-relaxed max-w-xl">
              {t('landing.hero.subtitle', {
                defaultValue:
                  'Identify your technical skill gaps through diagnostic assessments, follow a personalized role-based roadmap, learn with free courses from external providers, and prepare with AI practice quizzes in English and हिन्दी.'
              })}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
              <Button
                size="lg"
                onClick={() => navigate('/courses')}
                className="w-full sm:w-auto px-6 sm:px-7 py-3.5 text-sm sm:text-base font-bold rounded-xl shadow-lg shadow-blue-500/25 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white transition-all transform hover:-translate-y-0.5 justify-center"
              >
                <span>{t('landing.hero.exploreCourses', { defaultValue: 'Explore Courses' })}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <a
                href="#pathway-wizard"
                className="inline-flex items-center justify-center w-full sm:w-auto h-12 px-5 text-sm sm:text-base font-semibold text-foreground bg-slate-50 dark:bg-slate-900/60 border border-border hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <Sparkles className="w-4 h-4 mr-2 text-blue-600" />
                <span>{t('landing.hero.aiSkillAssessment', { defaultValue: 'AI Skill Assessment' })}</span>
              </a>
            </div>

            {/* Hero Stats Row (Real Platform Metrics Only) */}
            <div className="pt-6 border-t border-border/80 grid grid-cols-3 gap-3 sm:gap-6 text-foreground">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-base sm:text-lg text-foreground leading-tight">
                    61
                  </div>
                  <div className="text-[11px] sm:text-xs text-muted-foreground truncate">
                    {t('landing.hero.statCoursesLabel', { defaultValue: 'Curated Courses' })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center flex-shrink-0">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-base sm:text-lg text-foreground leading-tight">
                    6
                  </div>
                  <div className="text-[11px] sm:text-xs text-muted-foreground truncate">
                    {t('landing.hero.statRolesLabel', { defaultValue: 'Career Roles' })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-base sm:text-lg text-foreground leading-tight">
                    27
                  </div>
                  <div className="text-[11px] sm:text-xs text-muted-foreground truncate">
                    {t('landing.hero.statSkillsLabel', { defaultValue: 'Assessed Skills' })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Learner Photo & Real Platform Data Cards */}
          <div className="lg:col-span-5 relative flex flex-col items-center lg:items-end mt-4 lg:mt-0">
            <div className="relative w-full max-w-[480px]">
              {/* Blue-tinted ambient gradient backdrop */}
              <div
                aria-hidden="true"
                className="absolute -inset-2 sm:-inset-3 bg-gradient-to-tr from-blue-600/15 via-indigo-500/10 to-sky-400/15 dark:from-blue-600/25 dark:via-indigo-950/40 dark:to-cyan-900/20 rounded-[2rem] blur-xl -z-10 pointer-events-none"
              />

              {/* Photo Frame Container (Rounded shape with soft border in dark mode) */}
              <div className="relative rounded-3xl p-2 sm:p-2.5 bg-gradient-to-b from-blue-50/50 via-slate-100/60 to-white/70 dark:from-slate-900/80 dark:via-slate-900/90 dark:to-slate-950/90 border border-slate-200/80 dark:border-white/10 dark:ring-1 dark:ring-white/10 shadow-2xl dark:shadow-blue-950/40 backdrop-blur-sm">
                
                {/* Photo Element (Picture element with WebP source and JPG fallback, width=548, height=444, fetchpriority="high", no lazy-load, max-w ~480px, alt="") */}
                <div className="rounded-2xl overflow-hidden border border-slate-200/60 dark:border-white/10 bg-slate-100 dark:bg-slate-900 shadow-inner">
                  <picture>
                    <source srcSet="/images/hero-learner.webp" type="image/webp" />
                    <img
                      src="/images/hero-learner.jpg"
                      width={548}
                      height={444}
                      fetchPriority="high"
                      alt=""
                      className="w-full h-auto object-cover block select-none"
                    />
                  </picture>
                </div>

                {/* Floating Chip: Real fact (6 Target Career Roles) - Top-left away from face */}
                <div className="absolute -top-3 left-2 sm:-left-3 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md py-1.5 px-3 rounded-full border border-blue-200/80 dark:border-blue-900/60 shadow-md flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  <Target className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold text-foreground tracking-tight whitespace-nowrap">
                    {t('landing.hero.facts.roles', { defaultValue: '6 Target Career Roles' })}
                  </span>
                </div>

                {/* Floating Card: Real database values (61 courses, 5 providers, 7 domains with icons) - Bottom-left away from face */}
                <div className="absolute -bottom-5 left-2 sm:-left-4 z-10 max-w-[290px] sm:max-w-[320px] w-[calc(100%-1rem)] sm:w-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-900/10 dark:shadow-black/50">
                  <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-1.5">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <span className="font-bold text-xs text-foreground tracking-tight">
                        {t('landing.hero.resourceCard.title', { defaultValue: '61 Free Courses • 5 Providers' })}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40">
                      {t('landing.hero.resourceCard.badge', { defaultValue: 'Open Curricula' })}
                    </span>
                  </div>

                  <div className="text-[10px] text-muted-foreground pt-1.5 pb-1 font-medium truncate">
                    {t('landing.hero.resourceCard.providers', { defaultValue: 'CS50 • freeCodeCamp • Microsoft • Google • NPTEL' })}
                  </div>

                  <div className="grid grid-cols-2 gap-x-2.5 gap-y-1 pt-1 border-t border-border/40 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1.5 truncate">
                      <Code2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                      <span className="truncate">{t('landing.domains.programming', { defaultValue: 'Programming' })}: <strong className="text-foreground">22</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Cloud className="w-3 h-3 text-cyan-500 flex-shrink-0" />
                      <span className="truncate">{t('landing.domains.cloud', { defaultValue: 'Cloud & DevOps' })}: <strong className="text-foreground">15</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <BarChart3 className="w-3 h-3 text-amber-500 flex-shrink-0" />
                      <span className="truncate">{t('landing.domains.data', { defaultValue: 'Data & Analytics' })}: <strong className="text-foreground">12</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <ShieldCheck className="w-3 h-3 text-teal-500 flex-shrink-0" />
                      <span className="truncate">{t('landing.domains.security', { defaultValue: 'Cybersecurity' })}: <strong className="text-foreground">11</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Sparkles className="w-3 h-3 text-purple-500 flex-shrink-0" />
                      <span className="truncate">{t('landing.domains.ai', { defaultValue: 'AI & ML' })}: <strong className="text-foreground">9</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Kanban className="w-3 h-3 text-rose-500 flex-shrink-0" />
                      <span className="truncate">{t('landing.domains.product', { defaultValue: 'Product' })}: <strong className="text-foreground">8</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checklist Card: 5 Built-in Platform Features */}
              <div className="w-full max-w-[480px] mt-8 bg-card/90 dark:bg-slate-900/80 border border-border/80 rounded-2xl p-4 sm:p-4.5 shadow-sm backdrop-blur-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>{t('landing.hero.checklist.title', { defaultValue: 'Built-in Platform Features' })}</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-foreground/90 font-medium">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{t('landing.hero.checklist.item1', { defaultValue: 'Diagnostic skill assessments with calibrated proficiency scoring' })}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{t('landing.hero.checklist.item2', { defaultValue: 'Personalized role-based milestone roadmap targeting your gaps' })}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{t('landing.hero.checklist.item3', { defaultValue: 'AI practice quizzes dynamically generated from study notes' })}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{t('landing.hero.checklist.item4', { defaultValue: '61 curated free courses from 5 external open providers' })}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{t('landing.hero.checklist.item5', { defaultValue: 'Bilingual user interface and workflows in English & हिन्दी' })}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Popular Categories (Real Skill Domains with Real Courses) */}
      <section id="popular-categories" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-3">
          <div className="space-y-1.5">
            <div className="text-xs uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400">
              {t('landing.categories.tag', { defaultValue: 'Competency Domains' })}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {t('landing.categories.title', { defaultValue: 'Popular Categories' })}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              {t('landing.categories.subtitle', { defaultValue: 'Explore technical skills and find open curated courses for your career goals.' })}
            </p>
          </div>
          <Link
            to="/courses"
            className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 group whitespace-nowrap self-start sm:self-auto"
          >
            <span>{t('landing.categories.viewAll', { defaultValue: 'View All Categories' })}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 7 Domain Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {genuineCategories.map((cat) => {
            const Icon = cat.icon;
            const categoryName = t(cat.nameKey, { defaultValue: cat.defaultName });
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => navigate(`/courses?search=${encodeURIComponent(cat.query)}`)}
                className={`p-3.5 sm:p-4 rounded-2xl border flex flex-col items-center justify-center text-center gap-2.5 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md ${cat.colorClass} min-h-[110px]`}
              >
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900/80 shadow-xs flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] sm:text-xs font-bold tracking-tight leading-tight line-clamp-2">
                  {categoryName}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Why Learn with Skill-Setu (Real App Capabilities Only) */}
      <section id="why-skill-setu" className="py-14 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-border/80">
        <div className="mb-10 sm:mb-16">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              {t('landing.why.title', { defaultValue: 'Why Learn with Skill-Setu?' })}
            </h2>
            <p className="text-xs sm:text-base text-muted-foreground max-w-xl">
              {t('landing.why.subtitle', { defaultValue: 'An objective platform to measure assessed technical competencies and follow focused learning paths.' })}
            </p>
          </div>
        </div>

        {/* 4 Feature Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          
          {/* Feature 1 */}
          <div className="flex flex-col items-start space-y-2.5 sm:space-y-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-blue-500/30 bg-blue-50/60 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1">
              <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="font-extrabold text-base sm:text-lg text-foreground">
              {t('landing.why.f1Title', { defaultValue: 'Objective Diagnostics' })}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {t('landing.why.f1Desc', { defaultValue: 'Calibrated 1.0 to 5.0 proficiency scores derived from technical evaluations.' })}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-start space-y-2.5 sm:space-y-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1">
              <Laptop className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="font-extrabold text-base sm:text-lg text-foreground">
              {t('landing.why.f2Title', { defaultValue: 'Free Curated Curricula' })}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {t('landing.why.f2Desc', { defaultValue: 'Curated from open institutions including Harvard CS50, University of Helsinki, freeCodeCamp, Microsoft Learn, Google Cloud, and NPTEL.' })}
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-start space-y-2.5 sm:space-y-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-purple-500/30 bg-purple-50/60 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-1">
              <Target className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="font-extrabold text-base sm:text-lg text-foreground">
              {t('landing.why.f3Title', { defaultValue: 'Personalized Roadmaps' })}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {t('landing.why.f3Desc', { defaultValue: 'Identifies exact competency gaps and builds a prioritized step-by-step path to reach your target career role.' })}
            </p>
          </div>

          {/* Feature 4 */}
          <div className="flex flex-col items-start space-y-2.5 sm:space-y-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-amber-500/30 bg-amber-50/60 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-1">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="font-extrabold text-base sm:text-lg text-foreground">
              {t('landing.why.f4Title', { defaultValue: 'AI Practice Quizzes' })}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {t('landing.why.f4Desc', { defaultValue: 'Generate interactive practice quizzes from your study materials and practice role-based questions anytime.' })}
            </p>
          </div>

        </div>
      </section>

      {/* Interactive Career Pathway & Diagnostic Wizard */}
      <section id="pathway-wizard" className="py-14 sm:py-20 bg-slate-50/80 dark:bg-slate-900/40 border-y border-border/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400">
              {t('landing.wizard.tag', { defaultValue: 'AI DIAGNOSTIC BENCHMARK' })}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              {t('landing.wizard.title', { defaultValue: 'Plan Your Pathway in 30 Seconds' })}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t('landing.wizard.subtitle', { defaultValue: 'Select your target goal and weekly commitment. We compare your assessed level with the target level required for the role.' })}
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-white dark:bg-slate-900 p-5 sm:p-10 shadow-xl space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Step 1: Role (Real Roles from Database) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    1
                  </span>
                  <span>{t('landing.wizard.step1Title', { defaultValue: 'Target Career Role' })}</span>
                </div>
                <div className="space-y-2">
                  {wizardRoles.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all min-h-[44px] ${
                        selectedRole === role.id
                          ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 shadow-xs'
                          : 'border-border bg-card hover:bg-slate-50 dark:hover:bg-slate-800 text-foreground/80'
                      }`}
                    >
                      {t(role.labelKey, { defaultValue: role.defaultLabel })}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Level */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    2
                  </span>
                  <span>{t('landing.wizard.step2Title', { defaultValue: 'Current Experience' })}</span>
                </div>
                <div className="space-y-2">
                  {wizardLevels.map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setSelectedLevel(lvl.id)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl border text-xs sm:text-sm transition-all min-h-[44px] ${
                        selectedLevel === lvl.id
                          ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 font-semibold text-blue-700 dark:text-blue-300 shadow-xs'
                          : 'border-border bg-card hover:bg-slate-50 dark:hover:bg-slate-800 text-muted-foreground'
                      }`}
                    >
                      <div className="text-foreground font-semibold text-xs sm:text-sm">{t(lvl.labelKey)}</div>
                      <div className="text-[11px] text-muted-foreground">{t(lvl.subKey)}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Hours */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    3
                  </span>
                  <span>{t('landing.wizard.step3Title', { defaultValue: 'Weekly Commitment' })}</span>
                </div>
                <div className="space-y-2">
                  {wizardHours.map((hrs) => (
                    <button
                      key={hrs.id}
                      type="button"
                      onClick={() => setSelectedHours(hrs.id)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl border text-xs sm:text-sm transition-all min-h-[44px] ${
                        selectedHours === hrs.id
                          ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 font-semibold text-blue-700 dark:text-blue-300 shadow-xs'
                          : 'border-border bg-card hover:bg-slate-50 dark:hover:bg-slate-800 text-muted-foreground'
                      }`}
                    >
                      <div className="text-foreground font-semibold text-xs sm:text-sm">{t(hrs.labelKey)}</div>
                      <div className="text-[11px] text-muted-foreground">{t(hrs.subKey)}</div>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Wizard CTA */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border">
              <div className="text-xs text-muted-foreground flex items-center gap-2 text-center sm:text-left">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{t('landing.wizard.badge', { defaultValue: 'Selections auto-configure your custom diagnostic assessment' })}</span>
              </div>
              <Button
                onClick={handleFinishWizard}
                className="w-full sm:w-auto px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20"
              >
                <span>{t('landing.wizard.cta', { defaultValue: 'Continue with This Pathway' })}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-white dark:bg-[#0B0F19] py-12 sm:py-14 px-4 sm:px-6 lg:px-8 text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Column 1: Brand & Tagline */}
            <div className="space-y-3.5">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-lg text-foreground tracking-tight">
                  Skill<span className="text-blue-600">Setu</span>
                </span>
              </Link>
              <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                {t('landing.footer.about', { defaultValue: 'Objective skill gap diagnostics, personalized learning paths, and curated courses for your career goals.' })}
              </p>
            </div>

            {/* Column 2: Products */}
            <div className="space-y-3">
              <div className="font-bold text-sm text-foreground">
                {t('landing.footer.colProducts', { defaultValue: 'Products' })}
              </div>
              <ul className="space-y-2 text-xs">
                <li><Link to="/courses" className="hover:text-blue-600 transition-colors">{t('landing.footer.allCourses', { defaultValue: 'All Courses' })}</Link></li>
                <li><Link to="/roadmap" className="hover:text-blue-600 transition-colors">{t('landing.footer.careerRoadmaps', { defaultValue: 'Career Roadmaps' })}</Link></li>
                <li><Link to="/assessments" className="hover:text-blue-600 transition-colors">{t('landing.footer.skillDiagnostics', { defaultValue: 'Skill Diagnostics' })}</Link></li>
                <li><Link to="/quizzes" className="hover:text-blue-600 transition-colors">{t('landing.footer.aiPracticeQuizzes', { defaultValue: 'AI Practice Quizzes' })}</Link></li>
              </ul>
            </div>

            {/* Column 3: Navigation */}
            <div className="space-y-3">
              <div className="font-bold text-sm text-foreground">
                {t('landing.footer.colResources', { defaultValue: 'Sections' })}
              </div>
              <ul className="space-y-2 text-xs">
                <li><a href="#popular-categories" className="hover:text-blue-600 transition-colors">{t('landing.footer.popularCategories', { defaultValue: 'Popular Categories' })}</a></li>
                <li><a href="#why-skill-setu" className="hover:text-blue-600 transition-colors">{t('landing.footer.whySkillSetu', { defaultValue: 'Why Skill-Setu' })}</a></li>
                <li><a href="#pathway-wizard" className="hover:text-blue-600 transition-colors">{t('landing.footer.diagnosticWizard', { defaultValue: 'Pathway Wizard' })}</a></li>
              </ul>
            </div>

            {/* Column 4: Languages */}
            <div className="space-y-3">
              <div className="font-bold text-sm text-foreground">
                Languages
              </div>
              <p className="text-xs text-muted-foreground">
                Fully localized in English and हिन्दी for bilingual skill diagnostics.
              </p>
              <div className="pt-1">
                <span className="text-foreground font-semibold flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span>English / हिन्दी</span>
                </span>
              </div>
            </div>

          </div>

          {/* Bottom Bar: Copyright */}
          <div className="pt-6 sm:pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-center sm:text-left">
            <p>{t('landing.footer.allRights', { year: new Date().getFullYear(), defaultValue: `© ${new Date().getFullYear()} Skill-Setu. All rights reserved.` })}</p>
          </div>

        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
