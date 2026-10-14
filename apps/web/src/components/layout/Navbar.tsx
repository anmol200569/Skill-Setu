import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import {
  Globe,
  Moon,
  Sun,
  LogOut,
  Search,
  ChevronDown,
  Shield,
  Compass,
  Sparkles,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function Navbar() {
  const { user, role, profile, signOut } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [coursesMenuOpen, setCoursesMenuOpen] = useState(false);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('skill_setu_lang', nextLang);
  };

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('skill_setu_theme', isDark ? 'dark' : 'light');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/courses');
    }
  };

  // Format career role display name
  const getCareerGoalDisplay = () => {
    if (!profile?.targetRoleId) return null;
    const roleId = profile.targetRoleId;
    const roleKey = `landing.wizard.roles.${roleId}`;
    const translated = t(roleKey, { defaultValue: '' });
    if (translated) return translated;
    return roleId.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  };

  const careerGoal = getCareerGoalDisplay();

  const navLinks = [
    { name: t('nav.dashboard', { defaultValue: 'Dashboard' }), to: '/dashboard' },
    { name: t('nav.assessments', { defaultValue: 'Assessments' }), to: '/assessments' },
    { name: t('nav.skillGaps', { defaultValue: 'Skill Gaps' }), to: '/skill-gaps' },
    { name: t('nav.roadmap', { defaultValue: 'Roadmap' }), to: '/roadmap' },
    { name: t('nav.courses', { defaultValue: 'Courses' }), to: '/courses' },
    { name: t('nav.quizzes', { defaultValue: 'AI Quizzes' }), to: '/quizzes' },
  ];

  return (
    <>
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-xl focus:shadow-lg focus:outline-none"
      >
        {t('nav.skipToContent', { defaultValue: 'Skip to content' })}
      </a>

      <header className="sticky top-0 z-40 w-full border-b border-border bg-white/95 dark:bg-[#0B0F19]/90 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
          
          {/* Left: Brand Logo & Public Nav Links */}
          <div className="flex items-center gap-6 lg:gap-8 flex-shrink-0">
            <Link
              to={user ? (role === 'admin' || role === 'trainer' ? '/admin' : '/dashboard') : '/'}
              className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-xl"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-xl font-extrabold tracking-tight text-foreground flex items-center gap-1">
                  Skill<span className="text-blue-600">Setu</span>
                </span>
              </div>
            </Link>

            {/* Public Links (Inspired by Skillify top nav) */}
            {!user && (
              <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-foreground/80">
                {/* Courses Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setCoursesMenuOpen(true)}
                  onMouseLeave={() => setCoursesMenuOpen(false)}
                >
                  <Link
                    to="/courses"
                    className="flex items-center gap-1 hover:text-blue-600 transition-colors py-2"
                  >
                    <span>Courses</span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform", coursesMenuOpen && "rotate-180")} />
                  </Link>

                  {coursesMenuOpen && (
                    <div className="absolute top-full left-0 w-64 p-3 bg-card border border-border rounded-2xl shadow-xl space-y-1 animate-in fade-in-50 zoom-in-95 duration-150 z-50">
                      <Link
                        to="/courses?category=development"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 text-foreground transition-colors"
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Software Development
                      </Link>
                      <Link
                        to="/courses?category=data"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 text-foreground transition-colors"
                      >
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Data Science & AI
                      </Link>
                      <Link
                        to="/courses?category=design"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 text-foreground transition-colors"
                      >
                        <span className="w-2 h-2 rounded-full bg-purple-500" />
                        UI/UX & Product Design
                      </Link>
                      <div className="pt-2 border-t border-border mt-1">
                        <Link
                          to="/courses"
                          className="block text-center text-xs font-bold text-blue-600 hover:underline py-1"
                        >
                          Explore All 500+ Courses →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <a href="#popular-categories" className="hover:text-blue-600 transition-colors">
                  Categories
                </a>
                <a href="#why-skill-setu" className="hover:text-blue-600 transition-colors">
                  Why Skill-Setu
                </a>
                <a href="#pathway-wizard" className="hover:text-blue-600 transition-colors flex items-center gap-1 text-blue-600 dark:text-blue-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Career Diagnostic</span>
                </a>
              </div>
            )}

            {/* Current Career Goal Pill if logged in */}
            {user && (
              <div className="hidden lg:flex items-center">
                <Link
                  to="/profile"
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all max-w-[240px] truncate',
                    careerGoal
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100'
                      : 'bg-secondary text-muted-foreground border-border hover:text-foreground'
                  )}
                  title={`${t('nav.careerGoal', { defaultValue: 'Career Goal' })}: ${careerGoal || t('nav.noCareerGoal', { defaultValue: 'None' })}`}
                >
                  <Compass className="w-3.5 h-3.5 flex-shrink-0 text-blue-600" aria-hidden="true" />
                  <span className="truncate">{careerGoal || t('nav.selectGoal', { defaultValue: 'Select Role Goal' })}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Center Search Bar (Inspired by Skillify Header) */}
          <div className="hidden md:flex flex-1 max-w-md mx-2">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for courses, skills, or career roles..."
                className="w-full h-11 pl-10 pr-4 rounded-full border border-border bg-slate-50 dark:bg-slate-900/60 text-foreground placeholder:text-muted-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
              />
            </form>
          </div>

          {/* Logged-In Navigation (Desktop) */}
          {user && (
            <nav aria-label="Primary Navigation" className="hidden xl:flex items-center gap-5 text-sm font-semibold">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={cn(
                      'transition-colors py-1 px-2 rounded-lg',
                      isActive
                        ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/50'
                        : 'text-foreground/75 hover:text-blue-600 dark:hover:text-blue-400'
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
              {(role === 'admin' || role === 'trainer') && (
                <Link
                  to="/admin"
                  className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 hover:underline ml-1"
                >
                  <Shield className="w-3.5 h-3.5" />
                  {t('nav.admin', { defaultValue: 'Admin' })}
                </Link>
              )}
            </nav>
          )}

          {/* Right Actions: Language, Theme, User CTA */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              aria-label={`${t('nav.toggleLang', { defaultValue: 'Toggle language' })}: ${i18n.language === 'en' ? 'हिन्दी' : 'English'}`}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-border hover:bg-muted text-foreground transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
              <span className="text-xs font-bold">
                {i18n.language === 'en' ? 'हिन्दी' : 'EN'}
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={t('nav.toggleTheme', { defaultValue: 'Toggle theme' })}
              className="p-2 rounded-xl border border-border hover:bg-muted text-foreground transition-colors"
            >
              <Sun className="w-4 h-4 hidden dark:block text-amber-400" aria-hidden="true" />
              <Moon className="w-4 h-4 block dark:hidden text-foreground/80" aria-hidden="true" />
            </button>

            {/* User State */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  aria-label={t('nav.profile', { defaultValue: 'Profile' })}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border hover:bg-muted text-foreground transition-colors text-xs font-semibold"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {(user.user_metadata?.fullName || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline truncate max-w-[110px]">
                    {user.user_metadata?.fullName?.split(' ')[0] || user.email?.split('@')[0]}
                  </span>
                </Link>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    await signOut();
                    navigate('/login');
                  }}
                  aria-label={t('nav.logout', { defaultValue: 'Logout' })}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs whitespace-nowrap rounded-xl"
                >
                  <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">{t('nav.logout', { defaultValue: 'Log out' })}</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="whitespace-nowrap text-xs sm:text-sm font-semibold rounded-xl px-3.5">
                    {t('nav.login', { defaultValue: 'Log in' })}
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    variant="primary"
                    size="sm"
                    className="whitespace-nowrap px-4 py-2 text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20"
                  >
                    {t('nav.signup', { defaultValue: 'Sign Up' })}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
