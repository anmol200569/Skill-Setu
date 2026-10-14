import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { apiClient } from '../lib/api';
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
  Layers,
  GraduationCap,
  Clock,
  Star,
  Award,
  Briefcase,
  Palette,
  Megaphone,
  Camera,
  Activity,
  Send,
  Check,
  Globe,
  Compass,
  Laptop
} from 'lucide-react';
import { SkillConstellationHero } from '../components/landing/SkillConstellationHero';

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

const popularCategories = [
  { id: 'design', name: 'Design', icon: Palette, colorClass: 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100/70 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900', query: 'UI/UX' },
  { id: 'business', name: 'Business', icon: Briefcase, colorClass: 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100/70 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900', query: 'Leadership' },
  { id: 'development', name: 'Development', icon: Code2, colorClass: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100/70 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900', query: 'Full Stack' },
  { id: 'marketing', name: 'Marketing', icon: Megaphone, colorClass: 'bg-pink-50 text-pink-600 border-pink-100 hover:bg-pink-100/70 dark:bg-pink-950/40 dark:text-pink-400 dark:border-pink-900', query: 'Marketing' },
  { id: 'datascience', name: 'Data Science', icon: BarChart3, colorClass: 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100/70 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900', query: 'Data' },
  { id: 'personal', name: 'Personal Dev', icon: Users, colorClass: 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100/70 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900', query: 'Communication' },
  { id: 'cloud', name: 'Cloud & DevOps', icon: Cloud, colorClass: 'bg-cyan-50 text-cyan-600 border-cyan-100 hover:bg-cyan-100/70 dark:bg-cyan-950/40 dark:text-cyan-400 dark:border-cyan-900', query: 'Cloud' },
  { id: 'cybersecurity', name: 'Cybersecurity', icon: ShieldCheck, colorClass: 'bg-teal-50 text-teal-600 border-teal-100 hover:bg-teal-100/70 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-900', query: 'Security' }
];

const featuredCourses = [
  {
    id: 'course-uiux',
    title: 'UI/UX Design Fundamentals',
    description: 'Learn to design beautiful, user-centered experiences from scratch with modern design systems.',
    instructor: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 4.8,
    reviews: '12.4K',
    hours: 12,
    level: 'Beginner',
    badge: 'Top Rated',
    gradient: 'from-blue-600 to-indigo-700',
    originalPrice: '$79',
    price: '$49 (Free on Setu)'
  },
  {
    id: 'course-webdev',
    title: 'Complete Web Development Bootcamp',
    description: 'Go from zero to hero with HTML, CSS, JavaScript, React, Node.js and full-stack REST architectures.',
    instructor: 'Jamie Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 4.9,
    reviews: '28.1K',
    hours: 40,
    level: 'All Levels',
    badge: 'Most Popular',
    gradient: 'from-emerald-600 to-teal-800',
    originalPrice: '$99',
    price: '$59 (Free on Setu)'
  },
  {
    id: 'course-marketing',
    title: 'Digital Marketing & Growth Masterclass',
    description: 'Grow brands with proven marketing strategies, analytics, content engines, and modern campaigns.',
    instructor: 'Taylor Kim',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 4.6,
    reviews: '9.7K',
    hours: 18,
    level: 'Intermediate',
    badge: 'Trending',
    gradient: 'from-rose-500 to-pink-700',
    originalPrice: '$89',
    price: '$49 (Free on Setu)'
  },
  {
    id: 'course-python',
    title: 'Python for Data Science & Machine Learning',
    description: 'Analyze real datasets, build predictive models, and bring machine learning ideas to life.',
    instructor: 'Dr. Morgan Lee',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 4.8,
    reviews: '22.3K',
    hours: 25,
    level: 'Intermediate',
    badge: 'AI Track',
    gradient: 'from-amber-500 to-orange-700',
    originalPrice: '$99',
    price: '$59 (Free on Setu)'
  }
];

const testimonials = [
  {
    quote: "Skill-Setu gave me the confidence and skills to switch careers. The courses and personalized roadmap are clear, practical and engaging!",
    name: "Priya S.",
    role: "Product Designer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=140&h=140&q=80"
  },
  {
    quote: "The flexibility is amazing. I could learn at my own pace and practice AI quizzes while working full-time. Highly recommend to any engineer!",
    name: "James T.",
    role: "Software Engineer",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=140&h=140&q=80"
  },
  {
    quote: "Great instructors, practical content and a supportive platform. The diagnostic assessment accurately found my skill gaps and bridged them.",
    name: "Maria L.",
    role: "Marketing Specialist",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=140&h=140&q=80"
  }
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

      {/* Hero Section (1:1 with Inspiration Image Layout) */}
      <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Subtitle, CTA & Stats */}
          <div className="lg:col-span-7 space-y-7 text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>LEARN ANYTIME, ANYWHERE</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-extrabold tracking-tight text-foreground leading-[1.08]">
              Skills Today <br />
              <span className="text-foreground">A Brighter </span>
              <span className="text-blue-600 dark:text-blue-400">Tomorrow</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-muted-foreground font-normal leading-relaxed max-w-xl">
              World-class online courses, AI skill gap diagnostics, and personalized role roadmaps to help you grow, switch careers, or master in-demand skills with Skill-Setu.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Button
                size="lg"
                onClick={() => navigate('/courses')}
                className="px-7 py-3.5 text-sm sm:text-base font-bold rounded-xl shadow-lg shadow-blue-500/25 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white transition-all transform hover:-translate-y-0.5"
              >
                <span>Explore Courses</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <a
                href="#pathway-wizard"
                className="inline-flex items-center justify-center h-12 px-5 text-sm sm:text-base font-semibold text-foreground bg-slate-50 dark:bg-slate-900/60 border border-border hover:bg-slate-100 rounded-xl transition-colors"
              >
                <Sparkles className="w-4 h-4 mr-2 text-blue-600" />
                <span>AI Skill Assessment</span>
              </a>
            </div>

            {/* Hero Stats Row (1:1 with inspiration image) */}
            <div className="pt-6 border-t border-border/80 flex flex-wrap items-center gap-8 sm:gap-12 text-foreground">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-lg text-foreground leading-tight">500+</div>
                  <div className="text-xs text-muted-foreground">Courses</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-lg text-foreground leading-tight">Expert</div>
                  <div className="text-xs text-muted-foreground">AI Mentors</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-lg text-foreground leading-tight">Lifetime</div>
                  <div className="text-xs text-muted-foreground">Access & Roadmap</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Image with Floating Cards & Script Badges */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md sm:max-w-lg">
              
              {/* Handwritten Script Accent (Top-Right) */}
              <div className="absolute -top-7 right-4 sm:-top-8 sm:right-6 z-20 pointer-events-none select-none text-right">
                <div className="font-handwriting text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 rotate-[4deg]">
                  A Brighter You <br /> Starts Here ↗
                </div>
              </div>

              {/* Main Student Photo Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                  alt="Young learner smiling while studying online with a laptop"
                  className="w-full h-[430px] sm:h-[480px] object-cover object-center"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating Card: "Keep Learning, Keep Growing" (Top-Left 1:1 with inspiration image) */}
              <div className="absolute top-8 -left-4 sm:-left-8 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 space-y-3 max-w-[210px] sm:max-w-[230px] animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="flex items-center gap-2 text-foreground font-bold text-xs sm:text-sm">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="leading-tight">Keep Learning</div>
                    <div className="text-[11px] text-muted-foreground font-normal">Keep Growing</div>
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px] text-foreground/80 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span>Flexible learning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span>Certificates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span>Career support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span>Learn at own pace</span>
                  </div>
                </div>
              </div>

              {/* Floating Badge (Bottom-Right Mug Accent) */}
              <div className="absolute -bottom-4 right-4 sm:-bottom-5 sm:right-6 z-20 bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold text-sm">
                  ☕
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">Better Skills</div>
                  <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">Brighter You</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Popular Categories (1:1 with Inspiration Image) */}
      <section id="popular-categories" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Popular Categories
            </h2>
            <p className="text-sm text-muted-foreground">
              Explore in-demand skills and find the right course for your career goals.
            </p>
          </div>
          <Link
            to="/courses"
            className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 group whitespace-nowrap"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 8 Pastel Category Cards in a Responsive Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {popularCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => navigate(`/courses?search=${encodeURIComponent(cat.query)}`)}
                className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center gap-2.5 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md ${cat.colorClass}`}
              >
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900/80 shadow-xs flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold tracking-tight">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Courses (1:1 with Inspiration Image) */}
      <section className="py-14 sm:py-20 bg-slate-50/70 dark:bg-slate-900/30 border-y border-border/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Featured Courses
              </h2>
              <p className="text-sm text-muted-foreground">
                Handpicked courses and roadmaps from top instructors to help you build real skills.
              </p>
            </div>
            <Link
              to="/courses"
              className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 group whitespace-nowrap"
            >
              <span>View All Courses</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 4 Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCourses.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-border bg-white dark:bg-slate-900/90 shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden flex flex-col justify-between group transform hover:-translate-y-1"
              >
                {/* Visual Header */}
                <div className={`h-36 bg-gradient-to-tr ${c.gradient} p-4 flex flex-col justify-between text-white relative`}>
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                      {c.badge}
                    </span>
                    <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <BookOpen className="w-3.5 h-3.5 text-white" />
                    </span>
                  </div>
                  <div className="text-xs text-white/90 font-medium">Skill-Setu Curated Track</div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-base text-foreground leading-snug group-hover:text-blue-600 transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {c.description}
                    </p>
                  </div>

                  {/* Instructor & Rating */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={c.avatar}
                          alt={c.instructor}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="font-semibold text-foreground text-xs">{c.instructor}</span>
                      </div>
                      <div className="flex items-center gap-1 font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{c.rating}</span>
                        <span className="text-[10px] text-muted-foreground font-normal">({c.reviews})</span>
                      </div>
                    </div>

                    {/* Metadata Footer */}
                    <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground font-medium">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.hours} hours</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-foreground font-semibold text-[10px]">
                        {c.level}
                      </span>
                      <div className="font-extrabold text-blue-600 dark:text-blue-400 text-xs">
                        {c.price}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Learn with Skill-Setu? (1:1 with Inspiration Image Layout) */}
      <section id="why-skill-setu" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="relative mb-12 sm:mb-16">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Why Learn with Skill-Setu?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
              We're more than courses — we're your partner in lifelong career growth and skill verification.
            </p>
          </div>

          {/* Cursive Handwriting Note on Right */}
          <div className="hidden sm:block absolute right-0 top-0 text-right select-none pointer-events-none">
            <span className="font-handwriting text-3xl font-bold text-blue-600 dark:text-blue-400 rotate-[-3deg] block">
              Real Skills, <br /> Real Opportunities ✍️
            </span>
          </div>
        </div>

        {/* 4 Feature Columns with Circular Outline Icons (1:1 with inspiration image) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Feature 1 */}
          <div className="flex flex-col items-start space-y-3">
            <div className="w-14 h-14 rounded-full border-2 border-blue-500/30 bg-blue-50/60 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-lg text-foreground">
              Expert Instructors
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Learn from industry professionals and certified educators with real-world architectures.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-start space-y-3">
            <div className="w-14 h-14 rounded-full border-2 border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1">
              <Laptop className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-lg text-foreground">
              Flexible Learning
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Study at your own pace, on your own schedule. Our AI recalculates your path as you progress.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-start space-y-3">
            <div className="w-14 h-14 rounded-full border-2 border-purple-500/30 bg-purple-50/60 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-1">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-lg text-foreground">
              Certificates & Badges
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Earn recognized certificates and verified skill badges to showcase on LinkedIn and resume.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="flex flex-col items-start space-y-3">
            <div className="w-14 h-14 rounded-full border-2 border-amber-500/30 bg-amber-50/60 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-1">
              <Briefcase className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-lg text-foreground">
              Career Support
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Get diagnostic gap analysis, interview preparation quizzes, and direct career alignment.
            </p>
          </div>

        </div>
      </section>

      {/* Interactive Career Pathway & Diagnostic Wizard */}
      <section id="pathway-wizard" className="py-16 sm:py-20 bg-slate-50/80 dark:bg-slate-900/40 border-y border-border/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400">
              AI DIAGNOSTIC BENCHMARK
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Plan Your Pathway in 30 Seconds
            </h2>
            <p className="text-sm text-muted-foreground">
              Select your goal and weekly commitment. We map your current competencies against employer benchmarks.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Step 1: Role */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    1
                  </span>
                  <span>Target Career Role</span>
                </div>
                <div className="space-y-2">
                  {wizardRoles.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
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
                  <span>Current Experience</span>
                </div>
                <div className="space-y-2">
                  {wizardLevels.map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setSelectedLevel(lvl.id)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-all ${
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
                  <span>Weekly Commitment</span>
                </div>
                <div className="space-y-2">
                  {wizardHours.map((hrs) => (
                    <button
                      key={hrs.id}
                      type="button"
                      onClick={() => setSelectedHours(hrs.id)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-all ${
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
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Zero credit card required • Selections auto-configure your custom diagnostic</span>
              </div>
              <Button
                onClick={handleFinishWizard}
                className="w-full sm:w-auto px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20"
              >
                <span>Continue with This Pathway</span>
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
              <span>{showConstellation ? 'Hide 3D Skill Constellation' : 'Explore Interactive 3D Skill Constellation →'}</span>
            </button>

            {showConstellation && (
              <div className="mt-6 rounded-3xl overflow-hidden border border-border shadow-xl bg-card p-4 animate-in fade-in duration-300">
                <SkillConstellationHero />
              </div>
            )}
          </div>

        </div>
      </section>

      {/* What Our Students Say (Testimonials 1:1 with Inspiration Image) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              What Our Students Say
            </h2>
            <p className="text-sm text-muted-foreground">
              Join thousands of learners who are transforming their careers with Skill-Setu.
            </p>
          </div>
          <a
            href="#why-skill-setu"
            className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 group whitespace-nowrap"
          >
            <span>View All Testimonials</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((tItem, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-border bg-white dark:bg-slate-900/90 shadow-card flex flex-col justify-between space-y-6"
            >
              <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed italic">
                "{tItem.quote}"
              </p>

              <div className="flex items-center gap-3 pt-3 border-t border-border/70">
                <img
                  src={tItem.avatar}
                  alt={tItem.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <div className="font-bold text-sm text-foreground">{tItem.name}</div>
                  <div className="text-xs text-muted-foreground">{tItem.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stay In The Loop Banner (1:1 with Inspiration Image Layout) */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 p-8 sm:p-12 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
          
          {/* Subtle Background Pattern */}
          <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-3">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-widest">
                STAY IN THE LOOP
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Get the latest courses, tips and exclusive offers.
              </h2>
              <p className="text-sm text-white/90 font-medium">
                Join our community of lifelong learners building in-demand skills every day.
              </p>
            </div>

            {/* Right: Email Input & Handwritten Graphic */}
            <div className="lg:col-span-5 flex flex-col items-start lg:items-end space-y-3">
              
              <form onSubmit={handleSubscribe} className="w-full flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 h-12 px-4 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/80 shadow-md"
                />
                <Button
                  type="submit"
                  className="h-12 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md whitespace-nowrap transition-transform active:scale-95"
                >
                  {subscribed ? 'Subscribed! ✓' : 'Subscribe'}
                </Button>
              </form>

              {/* Handwritten Script Accent (1:1 with inspiration image) */}
              <div className="pt-2 text-right self-end select-none">
                <span className="font-handwriting text-2xl font-bold text-white drop-shadow-sm flex items-center gap-2 rotate-[-2deg]">
                  <Send className="w-4 h-4 text-white/80" />
                  <span>Learn, Grow, Belong</span>
                </span>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Honest FAQ Accordion */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400">
            TRANSPARENCY FIRST
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-muted-foreground">
            Clear, honest answers about our learning tracks, diagnostics, and free model.
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
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-foreground"
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

      {/* Footer (1:1 with Inspiration Image Layout) */}
      <footer className="mt-auto border-t border-border bg-white dark:bg-[#0B0F19] py-14 px-4 sm:px-6 lg:px-8 text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Main 4-Column Footer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            
            {/* Column 1: Brand & Tagline */}
            <div className="lg:col-span-2 space-y-4">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-lg text-foreground tracking-tight">
                  Skill<span className="text-blue-600">Setu</span>
                </span>
              </Link>
              <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                Skills for a brighter tomorrow. Objective skill gap diagnostics, personalized learning paths, and curated courses for your career goals.
              </p>
            </div>

            {/* Column 2: Products */}
            <div className="space-y-3">
              <div className="font-bold text-sm text-foreground">Products</div>
              <ul className="space-y-2 text-xs">
                <li><Link to="/courses" className="hover:text-blue-600 transition-colors">All Courses</Link></li>
                <li><Link to="/roadmap" className="hover:text-blue-600 transition-colors">Career Roadmaps</Link></li>
                <li><Link to="/assessments" className="hover:text-blue-600 transition-colors">Skill Diagnostics</Link></li>
                <li><Link to="/quizzes" className="hover:text-blue-600 transition-colors">AI Practice Quizzes</Link></li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div className="space-y-3">
              <div className="font-bold text-sm text-foreground">Resources</div>
              <ul className="space-y-2 text-xs">
                <li><a href="#popular-categories" className="hover:text-blue-600 transition-colors">Popular Categories</a></li>
                <li><a href="#why-skill-setu" className="hover:text-blue-600 transition-colors">Why Skill-Setu</a></li>
                <li><a href="#pathway-wizard" className="hover:text-blue-600 transition-colors">Diagnostic Wizard</a></li>
                <li><Link to="/courses" className="hover:text-blue-600 transition-colors">Learning Guides</Link></li>
              </ul>
            </div>

            {/* Column 4: Company & Follow */}
            <div className="space-y-3">
              <div className="font-bold text-sm text-foreground">Follow Us</div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:text-blue-600 transition-colors">
                  <span className="font-bold text-xs">in</span>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:text-blue-600 transition-colors">
                  <span className="font-bold text-xs">𝕏</span>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:text-blue-600 transition-colors">
                  <span className="font-bold text-xs">ig</span>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:text-blue-600 transition-colors">
                  <span className="font-bold text-xs">yt</span>
                </a>
              </div>
            </div>

          </div>

          {/* Bottom Bar: Copyright & Terms */}
          <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <p>© {new Date().getFullYear()} Skill-Setu. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Cookies</a>
              <span className="text-foreground font-semibold flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                English / हिन्दी
              </span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
