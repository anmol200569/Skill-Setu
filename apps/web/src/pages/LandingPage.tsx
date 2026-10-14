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
  ChevronDown,
  GraduationCap,
  Clock,
  Star,
  Award,
  Send,
  Globe,
  Laptop,
  Target
} from 'lucide-react';
import { SkillConstellationHero } from '../components/landing/SkillConstellationHero';

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

const genuineFeaturedCourses = [
  {
    id: 'cs50x',
    titleKey: 'landing.featuredCourses.courses.cs50x.title',
    defaultTitle: 'CS50x: Introduction to Computer Science',
    descriptionKey: 'landing.featuredCourses.courses.cs50x.description',
    defaultDescription: 'An introduction to the intellectual enterprises of computer science and the art of programming with C, Python, SQL, and algorithms.',
    providerKey: 'landing.featuredCourses.courses.cs50x.provider',
    defaultProvider: 'Harvard CS50',
    instructorKey: 'landing.featuredCourses.courses.cs50x.instructor',
    defaultInstructor: 'Prof. David J. Malan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 4.9,
    hours: 40,
    levelKey: 'common.beginner',
    defaultLevel: 'Beginner',
    badge: 'Harvard CS50',
    gradient: 'from-blue-600 to-indigo-700',
    destinationUrl: 'https://cs50.harvard.edu/x/'
  },
  {
    id: 'fullstack',
    titleKey: 'landing.featuredCourses.courses.fullstack.title',
    defaultTitle: 'Full Stack Open: Modern Web Development',
    descriptionKey: 'landing.featuredCourses.courses.fullstack.description',
    defaultDescription: 'Hands-on deep dive into React, Redux, Node.js, Express, REST APIs, GraphQL, TypeScript, and CI/CD pipelines.',
    providerKey: 'landing.featuredCourses.courses.fullstack.provider',
    defaultProvider: 'University of Helsinki',
    instructorKey: 'landing.featuredCourses.courses.fullstack.instructor',
    defaultInstructor: 'Matti Luukkainen',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 4.9,
    hours: 60,
    levelKey: 'common.intermediate',
    defaultLevel: 'Intermediate',
    badge: 'Univ. of Helsinki',
    gradient: 'from-emerald-600 to-teal-800',
    destinationUrl: 'https://fullstackopen.com/en/'
  },
  {
    id: 'cs50sql',
    titleKey: 'landing.featuredCourses.courses.cs50sql.title',
    defaultTitle: 'CS50: Introduction to Databases with SQL',
    descriptionKey: 'landing.featuredCourses.courses.cs50sql.description',
    defaultDescription: 'Relational database modeling, 3NF normalization, indexing, transactions, and query execution plans with PostgreSQL.',
    providerKey: 'landing.featuredCourses.courses.cs50sql.provider',
    defaultProvider: 'Harvard CS50',
    instructorKey: 'landing.featuredCourses.courses.cs50sql.instructor',
    defaultInstructor: 'Carter Zenke',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 4.9,
    hours: 30,
    levelKey: 'common.intermediate',
    defaultLevel: 'Intermediate',
    badge: 'Harvard CS50',
    gradient: 'from-rose-500 to-pink-700',
    destinationUrl: 'https://cs50.harvard.edu/sql/'
  },
  {
    id: 'fccMl',
    titleKey: 'landing.featuredCourses.courses.fccMl.title',
    defaultTitle: 'Machine Learning with Python Certification',
    descriptionKey: 'landing.featuredCourses.courses.fccMl.description',
    defaultDescription: 'Supervised and unsupervised ML algorithms, TensorFlow neural networks, and end-to-end model training pipelines.',
    providerKey: 'landing.featuredCourses.courses.fccMl.provider',
    defaultProvider: 'freeCodeCamp',
    instructorKey: 'landing.featuredCourses.courses.fccMl.instructor',
    defaultInstructor: 'Beau Carnes & FCC',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 4.9,
    hours: 45,
    levelKey: 'common.intermediate',
    defaultLevel: 'Intermediate',
    badge: 'freeCodeCamp',
    gradient: 'from-amber-500 to-orange-700',
    destinationUrl: 'https://www.freecodecamp.org/learn/machine-learning-with-python/'
  }
];

const verifiedFrameworkCards = [
  {
    icon: BookOpen,
    badgeKey: 'landing.methodology.card1Badge',
    defaultBadge: '60+ Open Tracks',
    titleKey: 'landing.methodology.card1Title',
    defaultTitle: 'Verified Open Curricula',
    descKey: 'landing.methodology.card1Desc',
    defaultDesc: 'Curated from Harvard CS50, University of Helsinki, freeCodeCamp, Microsoft Learn, Google Cloud Skills Boost, and NPTEL. No paywalls, ever.',
    colorClass: 'border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400'
  },
  {
    icon: BarChart3,
    badgeKey: 'landing.methodology.card2Badge',
    defaultBadge: '27 Industry Skills',
    titleKey: 'landing.methodology.card2Title',
    defaultTitle: '1.0 to 5.0 Competency Scale',
    descKey: 'landing.methodology.card2Desc',
    defaultDesc: 'Clear Bloom-calibrated rubric mapping foundational concepts to workplace architecture and hands-on implementation.',
    colorClass: 'border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400'
  },
  {
    icon: Target,
    badgeKey: 'landing.methodology.card3Badge',
    defaultBadge: '5 Core Career Roles',
    titleKey: 'landing.methodology.card3Title',
    defaultTitle: 'Role-Calibrated Readiness',
    descKey: 'landing.methodology.card3Desc',
    defaultDesc: 'Diagnostic tests measure your verified competency against employer benchmarks, identifying exact gaps to prioritize.',
    colorClass: 'border-purple-500/20 bg-purple-50/50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400'
  }
];

const openPartners = [
  'Harvard CS50',
  'University of Helsinki',
  'freeCodeCamp',
  'Microsoft Learn',
  'Google Cloud',
  'NPTEL (IITs)'
];

const faqKeys = ['q1', 'q2', 'q3', 'q4'];

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
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showConstellation, setShowConstellation] = useState(false);

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

    navigate(`/signup?role=${encodeURIComponent(selectedRole)}&level=${encodeURIComponent(selectedLevel)}&hours=${encodeURIComponent(selectedHours)}`);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setNewsletterEmail('');
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
              <span>{t('landing.hero.pill', { defaultValue: 'VERIFIED OPEN TECHNICAL EDUCATION' })}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[3.8rem] font-extrabold tracking-tight text-foreground leading-[1.1] break-words">
              {t('landing.hero.titleLine1', { defaultValue: 'Skills Today' })} <br />
              <span className="text-foreground">{t('landing.hero.titleLine2', { defaultValue: 'A Brighter ' })}</span>
              <span className="text-blue-600 dark:text-blue-400">{t('landing.hero.titleLine3', { defaultValue: 'Tomorrow' })}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-normal leading-relaxed max-w-xl">
              {t('landing.hero.subtitle', { defaultValue: 'World-class online courses, AI skill gap diagnostics, and personalized role roadmaps to help you grow, switch careers, or master in-demand skills with Skill-Setu.' })}
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

            {/* Hero Stats Row (Real Platform Metrics) */}
            <div className="pt-6 border-t border-border/80 grid grid-cols-3 gap-3 sm:gap-6 text-foreground">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-base sm:text-lg text-foreground leading-tight">
                    {t('landing.hero.statCourses', { defaultValue: '60+' })}
                  </div>
                  <div className="text-[11px] sm:text-xs text-muted-foreground truncate">
                    {t('landing.hero.statCoursesLabel', { defaultValue: 'Curated Tracks' })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-base sm:text-lg text-foreground leading-tight">
                    {t('landing.hero.statMentors', { defaultValue: 'Expert' })}
                  </div>
                  <div className="text-[11px] sm:text-xs text-muted-foreground truncate">
                    {t('landing.hero.statMentorsLabel', { defaultValue: 'AI Study Mentors' })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-base sm:text-lg text-foreground leading-tight">
                    {t('landing.hero.statAccess', { defaultValue: '100% Free' })}
                  </div>
                  <div className="text-[11px] sm:text-xs text-muted-foreground truncate">
                    {t('landing.hero.statAccessLabel', { defaultValue: 'Open Access' })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Image with Floating Cards & Script Badges (Mobile-Safe) */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end mt-2 lg:mt-0">
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
              
              {/* Handwritten Script Accent (Top-Right) */}
              <div className="hidden xs:block sm:block absolute -top-6 right-2 sm:-top-8 sm:right-6 z-20 pointer-events-none select-none text-right">
                <div className="font-handwriting text-xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 rotate-[4deg]">
                  {t('landing.hero.note', { defaultValue: 'A Brighter You Starts Here ↗' })}
                </div>
              </div>

              {/* Main Student Photo Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                  alt="Skill-Setu technical learner studying online"
                  className="w-full h-[340px] sm:h-[460px] object-cover object-center"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating Card: Diagnostic Skills Bridge */}
              <div className="absolute top-4 left-2 sm:-left-6 sm:top-8 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3.5 sm:p-5 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 space-y-2.5 sm:space-y-3 max-w-[190px] sm:max-w-[230px]">
                <div className="flex items-center gap-2 text-foreground font-bold text-xs sm:text-sm">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <div className="leading-tight text-xs sm:text-sm">{t('landing.hero.badgeTitle', { defaultValue: 'Skill Setu' })}</div>
                    <div className="text-[10px] sm:text-[11px] text-muted-foreground font-normal">{t('landing.hero.badgeSubtitle', { defaultValue: 'Diagnostic Bridge' })}</div>
                  </div>
                </div>

                <div className="space-y-1 sm:space-y-1.5 text-[10px] sm:text-[11px] text-foreground/80 font-medium">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600 flex-shrink-0" />
                    <span className="truncate">{t('landing.hero.badgeItem1', { defaultValue: '1.0 to 5.0 Diagnostic Scoring' })}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600 flex-shrink-0" />
                    <span className="truncate">{t('landing.hero.badgeItem2', { defaultValue: 'Role-Calibrated Gap Analysis' })}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600 flex-shrink-0" />
                    <span className="truncate">{t('landing.hero.badgeItem3', { defaultValue: 'Prioritized Open Curricula' })}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600 flex-shrink-0" />
                    <span className="truncate">{t('landing.hero.badgeItem4', { defaultValue: 'AI Practice Studio' })}</span>
                  </div>
                </div>
              </div>

              {/* Floating Badge (Bottom-Right Accent) */}
              <div className="absolute -bottom-3 right-2 sm:-bottom-5 sm:right-6 z-20 bg-white dark:bg-slate-900 p-2.5 sm:p-4 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 flex items-center gap-2.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold text-xs sm:text-sm">
                  ☕
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs font-bold text-foreground">{t('landing.hero.mugBadgeTitle', { defaultValue: 'Better Skills' })}</div>
                  <div className="text-[9px] sm:text-[10px] text-blue-600 dark:text-blue-400 font-semibold">{t('landing.hero.mugBadgeSubtitle', { defaultValue: 'Brighter You' })}</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Popular Categories (Real Skill Domains) */}
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
              {t('landing.categories.subtitle', { defaultValue: 'Explore in-demand skills and find the right course for your career goals.' })}
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

        {/* 7 Pastel Category Cards in a Responsive Grid */}
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

      {/* Featured Courses (Real Verified Open Curricula) */}
      <section className="py-12 sm:py-20 bg-slate-50/70 dark:bg-slate-900/30 border-y border-border/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-3">
            <div className="space-y-1.5">
              <div className="text-xs uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400">
                {t('landing.featuredCourses.tag', { defaultValue: 'Verified Open Curricula' })}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {t('landing.featuredCourses.title', { defaultValue: 'Featured Courses' })}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
                {t('landing.featuredCourses.subtitle', { defaultValue: 'Handpicked verified courses and roadmaps from world-class institutions to build real skills.' })}
              </p>
            </div>
            <Link
              to="/courses"
              className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 group whitespace-nowrap self-start sm:self-auto"
            >
              <span>{t('landing.featuredCourses.viewAll', { defaultValue: 'View All Courses' })}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 4 Real Course Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {genuineFeaturedCourses.map((c) => {
              const courseTitle = t(c.titleKey, { defaultValue: c.defaultTitle });
              const courseDesc = t(c.descriptionKey, { defaultValue: c.defaultDescription });
              const instructor = t(c.instructorKey, { defaultValue: c.defaultInstructor });
              const provider = t(c.providerKey, { defaultValue: c.defaultProvider });
              const level = t(c.levelKey, { defaultValue: c.defaultLevel });
              return (
                <div
                  key={c.id}
                  className="rounded-2xl border border-border bg-white dark:bg-slate-900/90 shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden flex flex-col justify-between group transform hover:-translate-y-1"
                >
                  {/* Visual Header */}
                  <div className={`h-32 sm:h-36 bg-gradient-to-tr ${c.gradient} p-4 flex flex-col justify-between text-white relative`}>
                    <div className="flex justify-between items-start">
                      <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                        {c.badge}
                      </span>
                      <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <BookOpen className="w-3.5 h-3.5 text-white" />
                      </span>
                    </div>
                    <div className="text-xs text-white/95 font-medium truncate">
                      {provider}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-extrabold text-sm sm:text-base text-foreground leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                        {courseTitle}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {courseDesc}
                      </p>
                    </div>

                    {/* Instructor & Rating */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          <img
                            src={c.avatar}
                            alt={instructor}
                            className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                          />
                          <span className="font-semibold text-foreground text-xs truncate">{instructor}</span>
                        </div>
                        <div className="flex items-center gap-1 font-bold text-amber-500 flex-shrink-0">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{c.rating}</span>
                        </div>
                      </div>

                      {/* Metadata Footer */}
                      <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground font-medium">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{t('landing.featuredCourses.hours', { hours: c.hours, defaultValue: `${c.hours} hours` })}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-foreground font-semibold text-[10px]">
                          {level}
                        </span>
                        <div className="font-extrabold text-emerald-600 dark:text-emerald-400 text-[11px]">
                          {t('landing.featuredCourses.freeOpenAccess', { defaultValue: '100% Free' })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Learn with Skill-Setu? */}
      <section id="why-skill-setu" className="py-14 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="relative mb-10 sm:mb-16">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              {t('landing.why.title', { defaultValue: 'Why Learn with Skill-Setu?' })}
            </h2>
            <p className="text-xs sm:text-base text-muted-foreground max-w-xl">
              {t('landing.why.subtitle', { defaultValue: "We're more than courses — we're your partner in lifelong career growth and skill verification." })}
            </p>
          </div>

          {/* Cursive Handwriting Note on Right */}
          <div className="hidden sm:block absolute right-0 top-0 text-right select-none pointer-events-none">
            <span className="font-handwriting text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 rotate-[-3deg] block">
              {t('landing.why.note', { defaultValue: 'Real Skills, Real Opportunities ✍️' })}
            </span>
          </div>
        </div>

        {/* 4 Feature Columns with Circular Outline Icons */}
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
              {t('landing.why.f1Desc', { defaultValue: 'Calibrated 1.0 to 5.0 proficiency scores derived from genuine technical scenario evaluations.' })}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-start space-y-2.5 sm:space-y-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1">
              <Laptop className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="font-extrabold text-base sm:text-lg text-foreground">
              {t('landing.why.f2Title', { defaultValue: '100% Free Curricula' })}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {t('landing.why.f2Desc', { defaultValue: 'Curated exclusively from world-class open institutions including Harvard, Helsinki, freeCodeCamp, Microsoft, Google, and NPTEL.' })}
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-start space-y-2.5 sm:space-y-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-purple-500/30 bg-purple-50/60 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-1">
              <Award className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="font-extrabold text-base sm:text-lg text-foreground">
              {t('landing.why.f3Title', { defaultValue: 'Personalized Roadmaps' })}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {t('landing.why.f3Desc', { defaultValue: 'Identifies exact competency gaps and builds a prioritized step-by-step path to reach your industry target.' })}
            </p>
          </div>

          {/* Feature 4 */}
          <div className="flex flex-col items-start space-y-2.5 sm:space-y-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-amber-500/30 bg-amber-50/60 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-1">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="font-extrabold text-base sm:text-lg text-foreground">
              {t('landing.why.f4Title', { defaultValue: 'AI Study Mentor & Quizzes' })}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {t('landing.why.f4Desc', { defaultValue: 'Generate interactive revision quizzes and receive 24/7 AI-guided concept explanations anytime.' })}
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
              {t('landing.wizard.subtitle', { defaultValue: 'Select your goal and weekly commitment. We map your current competencies against employer benchmarks.' })}
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-white dark:bg-slate-900 p-5 sm:p-10 shadow-xl space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Step 1: Role */}
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
                      {t(role.labelKey, { defaultValue: role.id })}
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
                <span>{t('landing.wizard.badge', { defaultValue: 'Zero credit card required • Selections auto-configure your custom diagnostic' })}</span>
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

          {/* Optional 3D Constellation Toggle */}
          <div className="text-center pt-2">
            <button
              onClick={() => setShowConstellation(!showConstellation)}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {showConstellation
                  ? t('landing.wizard.constellationHide', { defaultValue: 'Hide 3D Skill Constellation' })
                  : t('landing.wizard.constellationShow', { defaultValue: 'Explore Interactive 3D Skill Constellation →' })}
              </span>
            </button>

            {showConstellation && (
              <div className="mt-6 rounded-3xl overflow-hidden border border-border shadow-xl bg-card p-4 animate-in fade-in duration-300">
                <SkillConstellationHero />
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Verified Educational Framework & Open Partners (Replacing fake reviews) */}
      <section className="py-14 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-3">
          <div className="space-y-1.5">
            <div className="text-xs uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400">
              {t('landing.methodology.tag', { defaultValue: 'Transparency First' })}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {t('landing.methodology.title', { defaultValue: 'Verified Educational Framework & Partners' })}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              {t('landing.methodology.subtitle', { defaultValue: 'Grounded in empirical evaluation, open access curricula, and transparent 1–5 Bloom skill diagnostics.' })}
            </p>
          </div>
          <Link
            to="/courses"
            className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 group whitespace-nowrap self-start sm:self-auto"
          >
            <span>{t('landing.methodology.viewAll', { defaultValue: 'Explore Open Curricula' })}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3 Framework Verification Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {verifiedFrameworkCards.map((card, idx) => {
            const Icon = card.icon;
            const title = t(card.titleKey, { defaultValue: card.defaultTitle });
            const desc = t(card.descKey, { defaultValue: card.defaultDesc });
            const badge = t(card.badgeKey, { defaultValue: card.defaultBadge });
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-border bg-white dark:bg-slate-900/90 shadow-card flex flex-col justify-between space-y-4 hover:shadow-card-hover transition-all duration-200"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${card.colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-foreground">
                      {badge}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg text-foreground">
                    {title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Partner Badges Ribbon */}
        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-semibold text-muted-foreground text-center sm:text-left">
            {t('landing.methodology.partnersLabel', { defaultValue: 'Open Education Curators & Reference Institutions' })}:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {openPartners.map((partner) => (
              <span
                key={partner}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border border-border bg-slate-50 dark:bg-slate-900 text-foreground shadow-xs"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stay In The Loop Banner */}
      <section className="py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 p-6 sm:p-10 md:p-12 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
          
          {/* Subtle Background Pattern */}
          <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-3">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-widest">
                {t('landing.newsletter.pill', { defaultValue: 'STAY IN THE LOOP' })}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {t('landing.newsletter.title', { defaultValue: 'Get the latest courses, tips and platform updates.' })}
              </h2>
              <p className="text-xs sm:text-sm text-white/90 font-medium">
                {t('landing.newsletter.subtitle', { defaultValue: 'Join our community of learners building verified, in-demand technical skills every day.' })}
              </p>
            </div>

            {/* Right: Email Input & Handwritten Graphic */}
            <div className="lg:col-span-5 flex flex-col items-start lg:items-end space-y-3">
              
              <form onSubmit={handleSubscribe} className="w-full flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={t('landing.newsletter.placeholder', { defaultValue: 'Enter your email address' })}
                  required
                  className="flex-1 h-12 px-4 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/80 shadow-md"
                />
                <Button
                  type="submit"
                  className="h-12 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md whitespace-nowrap transition-transform active:scale-95 justify-center"
                >
                  {subscribed
                    ? t('landing.newsletter.subscribed', { defaultValue: 'Subscribed! ✓' })
                    : t('landing.newsletter.button', { defaultValue: 'Subscribe' })}
                </Button>
              </form>

              {/* Handwritten Script Accent */}
              <div className="pt-1 text-right self-end select-none">
                <span className="font-handwriting text-xl sm:text-2xl font-bold text-white drop-shadow-sm flex items-center gap-2 rotate-[-2deg]">
                  <Send className="w-4 h-4 text-white/80" />
                  <span>{t('landing.newsletter.note', { defaultValue: 'Learn, Grow, Belong' })}</span>
                </span>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Honest FAQ Accordion */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400">
            {t('landing.faq.tag', { defaultValue: 'TRANSPARENCY FIRST' })}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {t('landing.faq.title', { defaultValue: 'Frequently Asked Questions' })}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t('landing.faq.subtitle', { defaultValue: 'Clear, honest answers about our learning tracks, diagnostics, and free model.' })}
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
                className="rounded-2xl border border-border bg-white dark:bg-slate-900 overflow-hidden transition-colors shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-bold text-xs sm:text-sm md:text-base text-foreground"
                >
                  <span>{question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
                    {answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-white dark:bg-[#0B0F19] py-12 sm:py-14 px-4 sm:px-6 lg:px-8 text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
          
          {/* Main Footer Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            
            {/* Column 1: Brand & Tagline */}
            <div className="lg:col-span-2 space-y-3.5">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-lg text-foreground tracking-tight">
                  Skill<span className="text-blue-600">Setu</span>
                </span>
              </Link>
              <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                {t('landing.footer.about', { defaultValue: 'Skills for a brighter tomorrow. Objective skill gap diagnostics, personalized learning paths, and curated courses for your career goals.' })}
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

            {/* Column 3: Resources */}
            <div className="space-y-3">
              <div className="font-bold text-sm text-foreground">
                {t('landing.footer.colResources', { defaultValue: 'Resources' })}
              </div>
              <ul className="space-y-2 text-xs">
                <li><a href="#popular-categories" className="hover:text-blue-600 transition-colors">{t('landing.footer.popularCategories', { defaultValue: 'Popular Categories' })}</a></li>
                <li><a href="#why-skill-setu" className="hover:text-blue-600 transition-colors">{t('landing.footer.whySkillSetu', { defaultValue: 'Why Skill-Setu' })}</a></li>
                <li><a href="#pathway-wizard" className="hover:text-blue-600 transition-colors">{t('landing.footer.diagnosticWizard', { defaultValue: 'Diagnostic Wizard' })}</a></li>
                <li><Link to="/courses" className="hover:text-blue-600 transition-colors">{t('landing.footer.learningGuides', { defaultValue: 'Learning Guides' })}</Link></li>
              </ul>
            </div>

            {/* Column 4: Follow */}
            <div className="space-y-3">
              <div className="font-bold text-sm text-foreground">
                {t('landing.footer.colFollow', { defaultValue: 'Follow Us' })}
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:text-blue-600 transition-colors">
                  <span className="font-bold text-xs">in</span>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter / X" className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:text-blue-600 transition-colors">
                  <span className="font-bold text-xs">𝕏</span>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:text-blue-600 transition-colors">
                  <span className="font-bold text-xs">ig</span>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:text-blue-600 transition-colors">
                  <span className="font-bold text-xs">yt</span>
                </a>
              </div>
            </div>

          </div>

          {/* Bottom Bar: Copyright & Terms */}
          <div className="pt-6 sm:pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-center sm:text-left">
            <p>{t('landing.footer.allRights', { year: new Date().getFullYear(), defaultValue: `© ${new Date().getFullYear()} Skill-Setu. All rights reserved.` })}</p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <a href="#" className="hover:text-foreground transition-colors">{t('landing.footer.terms', { defaultValue: 'Terms' })}</a>
              <a href="#" className="hover:text-foreground transition-colors">{t('landing.footer.privacy', { defaultValue: 'Privacy' })}</a>
              <a href="#" className="hover:text-foreground transition-colors">{t('landing.footer.cookies', { defaultValue: 'Cookies' })}</a>
              <span className="text-foreground font-semibold flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>English / हिन्दी</span>
              </span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
