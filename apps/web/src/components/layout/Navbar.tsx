import React, { useState, useRef, useEffect } from 'react';
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
  GraduationCap,
  LayoutDashboard,
  Target,
  GitCompare,
  Route,
  User,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function Navbar() {
  const { user, role, profile, signOut } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [coursesMenuOpen, setCoursesMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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

  // Safe formatting for Career Goal without showing raw UUIDs
  const getCareerGoalDisplay = () => {
    if (!profile?.targetRoleId) return null;
    const roleId = profile.targetRoleId;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(roleId);
    if (isUuid) {
      return (profile as any)?.targetRoleName || 'Target Career Goal';
    }
    const roleKey = `landing.wizard.roles.${roleId}`;
    const translated = t(roleKey, { defaultValue: '' });
    if (translated) return translated;
    return roleId.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  };

  const careerGoal = getCareerGoalDisplay();

  // Unified single nav list
  const navLinks = [
    { name: t('nav.dashboard', { defaultValue: 'Dashboard' }), to: '/dashboard', icon: LayoutDashboard },
    { name: t('nav.assessments', { defaultValue: 'Assessments' }), to: '/assessments', icon: Target },
    { name: t('nav.skillGaps', { defaultValue: 'Skill Gaps' }), to: '/skill-gaps', icon: GitCompare },
    { name: t('nav.roadmap', { defaultValue: 'Roadmap' }), to: '/roadmap', icon: Route },
    { name: t('nav.courses', { defaultValue: 'Courses' }), to: '/courses', icon: BookOpen },
    { name: t('nav.quizzes', { defaultValue: 'AI Quizzes' }), to: '/quizzes', icon: Sparkles },
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

      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#0B0F19]/85 backdrop-blur-2xl border-b border-white/30 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_14px_40px_rgba(0,0,0,0.5)] transition-colors">
        <div className="w-full max-w-[1720px] mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-10 gap-3 xl:gap-6">
          
          {/* Left: Brand Logo & Career Role Badge */}
          <div className="flex items-center gap-3 lg:gap-4 flex-shrink-0">
            <Link
              to={user ? (role === 'admin' || role === 'trainer' ? '/admin' : '/dashboard') : '/'}
              className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-2xl"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-[0_4px_18px_rgba(37,99,235,0.35)] border border-white/30 group-hover:scale-105 transition-all">
                <GraduationCap className="w-6 h-6 drop-shadow-sm" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-xl font-extrabold tracking-tight text-foreground flex items-center gap-0.5">
                  Skill<span className="text-blue-600 dark:text-blue-400">Setu</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 ml-0.5 animate-pulse" />
                </span>
              </div>
            </Link>

            {/* Current Career Goal Pill (Neumorphic Liquid Glass Pill) */}
            {user && (
              <div className="hidden sm:flex items-center">
                <Link
                  to="/profile"
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all max-w-[220px] truncate backdrop-blur-md shadow-sm',
                    careerGoal
                      ? 'bg-blue-500/10 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-400/30 hover:bg-blue-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]'
                      : 'bg-slate-100/70 dark:bg-slate-800/60 text-muted-foreground border-slate-200/80 dark:border-white/10 hover:text-foreground'
                  )}
                  title={`${t('nav.careerGoal', { defaultValue: 'Career Goal' })}: ${careerGoal || t('nav.selectGoal', { defaultValue: 'Select Role Goal' })}`}
                >
                  <Compass className="w-3.5 h-3.5 flex-shrink-0 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  <span className="truncate">{careerGoal || t('nav.selectGoal', { defaultValue: 'Set Target Role' })}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Center Navigation Links (Single Sleek Navigation Bar) */}
          {user ? (
            <nav aria-label="Primary Navigation" className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={cn(
                      'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all select-none',
                      isActive
                        ? 'text-white bg-gradient-to-r from-blue-600 to-blue-500 shadow-[0_4px_16px_rgba(37,99,235,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-blue-400/40 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/50'
                    )}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
              {(role === 'admin' || role === 'trainer') && (
                <Link
                  to="/admin"
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-bold text-indigo-600 dark:text-indigo-400 transition-all hover:bg-indigo-50 dark:hover:bg-indigo-950/40',
                    location.pathname.startsWith('/admin') && 'bg-indigo-50 dark:bg-indigo-950/50 underline'
                  )}
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}
            </nav>
          ) : (
            /* Public Links */
            <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-foreground/80">
              <Link to="/courses" className="hover:text-blue-600 transition-colors">
                Courses
              </Link>
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

          {/* Sleek Search Bar (Neumorphic Inset) */}
          <div className="hidden md:flex flex-1 max-w-xs xl:max-w-sm">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses & skills..."
                className="w-full h-10 pl-10 pr-4 rounded-full border border-slate-200/80 dark:border-white/10 bg-slate-100/70 dark:bg-slate-900/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] text-foreground placeholder:text-muted-foreground text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
              />
            </form>
          </div>

          {/* Right Actions: Language, Theme, User Profile */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Language Switcher (Liquid Glass Pill) */}
            <button
              onClick={toggleLanguage}
              aria-label={`${t('nav.toggleLang', { defaultValue: 'Toggle language' })}: ${i18n.language === 'en' ? 'हिन्दी' : 'English'}`}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground shadow-sm transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span className="text-xs font-bold">
                {i18n.language === 'en' ? 'हिन्दी' : 'EN'}
              </span>
            </button>

            {/* Theme Toggle (Liquid Glass Circle) */}
            <button
              onClick={toggleTheme}
              aria-label={t('nav.toggleTheme', { defaultValue: 'Toggle theme' })}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground shadow-sm transition-all"
            >
              <Sun className="w-4 h-4 hidden dark:block text-amber-400" aria-hidden="true" />
              <Moon className="w-4 h-4 block dark:hidden text-foreground/80" aria-hidden="true" />
            </button>

            {/* User Dropdown / Sign-in */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-full border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-sm hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-500/25 border border-white/30">
                    {(user.user_metadata?.fullName || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline font-semibold text-xs text-foreground max-w-[100px] truncate">
                    {user.user_metadata?.fullName?.split(' ')[0] || user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
                </button>

                {/* Dropdown Menu (Liquid Glass Card) */}
                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-white/40 dark:border-white/10 bg-card/95 backdrop-blur-2xl p-2 shadow-2xl animate-in fade-in-50 zoom-in-95 z-50">
                    <div className="px-3 py-2 border-b border-border mb-1">
                      <p className="text-xs font-bold text-foreground truncate">
                        {user.user_metadata?.fullName || 'Skill Setu Learner'}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 text-foreground transition-colors"
                    >
                      <User className="w-4 h-4 text-blue-600" />
                      <span>{t('nav.profile', { defaultValue: 'My Profile & Portfolio' })}</span>
                    </Link>

                    {(role === 'admin' || role === 'trainer') && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 text-foreground transition-colors"
                      >
                        <Shield className="w-4 h-4 text-indigo-600" />
                        <span>Admin Studio</span>
                      </Link>
                    )}

                    <div className="pt-1 border-t border-border mt-1">
                      <button
                        onClick={async () => {
                          setUserDropdownOpen(false);
                          await signOut();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('nav.logout', { defaultValue: 'Sign Out' })}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="whitespace-nowrap text-xs font-semibold rounded-full px-3.5">
                    {t('nav.login', { defaultValue: 'Log in' })}
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    variant="primary"
                    size="sm"
                    className="whitespace-nowrap px-4 py-2 text-xs font-bold rounded-full shadow-md shadow-blue-500/20"
                  >
                    {t('nav.signup', { defaultValue: 'Sign Up' })}
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md text-foreground"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-card/95 backdrop-blur-2xl px-4 py-4 space-y-2 animate-in slide-in-from-top-2">
            {user ? (
              navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all',
                      isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-foreground/80 hover:bg-secondary'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </Link>
                );
              })
            ) : (
              <>
                <Link to="/courses" className="block px-4 py-2 rounded-xl text-sm font-medium hover:bg-secondary">
                  Courses
                </Link>
                <Link to="/login" className="block px-4 py-2 rounded-xl text-sm font-medium hover:bg-secondary">
                  Log In
                </Link>
                <Link to="/signup" className="block px-4 py-2 rounded-xl text-sm font-bold text-blue-600 hover:bg-secondary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </header>
    </>
  );
}
export default Navbar;
