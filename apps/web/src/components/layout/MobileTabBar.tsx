import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Target,
  GitCompare,
  Route,
  Sparkles,
  BookOpen,
  User,
  Search,
  Globe,
  Sun,
  Moon,
  LogOut,
  Shield,
  Menu,
  X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

export function MobileTabBar() {
  const { t, i18n } = useTranslation();
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Close more menu whenever the route changes
  useEffect(() => {
    setIsMoreOpen(false);
  }, [location.pathname]);

  // Lock body scroll when More drawer is open
  useEffect(() => {
    if (!isMoreOpen || typeof document === 'undefined') return;

    const originalOverflow = document.body.style.overflow;
    const originalGutter = document.body.style.scrollbarGutter;

    document.body.style.scrollbarGutter = 'stable';
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMoreOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.scrollbarGutter = originalGutter;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMoreOpen]);

  const toggleLanguage = (lang: 'en' | 'hi') => {
    i18n.changeLanguage(lang);
    localStorage.setItem('skill_setu_lang', lang);
  };

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('skill_setu_theme', isDark ? 'dark' : 'light');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsMoreOpen(false);
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      setIsMoreOpen(false);
      navigate('/courses');
    }
  };

  // Primary 4 quick tabs + More
  const tabs = [
    { name: t('nav.dashboard'), to: '/dashboard', icon: LayoutDashboard },
    { name: t('nav.assessmentsShort', { defaultValue: 'Assess' }), to: '/assessments', icon: Target },
    { name: t('nav.skillGapsShort', { defaultValue: 'Gaps' }), to: '/skill-gaps', icon: GitCompare },
    { name: t('nav.roadmapShort', { defaultValue: 'Roadmap' }), to: '/roadmap', icon: Route },
  ];

  // Secondary items in More drawer are highlighted if current pathname matches
  const isMoreActive =
    location.pathname === '/quizzes' ||
    location.pathname === '/courses' ||
    location.pathname === '/profile' ||
    location.pathname.startsWith('/admin');

  return (
    <>
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-[#0B0F19]/90 backdrop-blur-2xl border-t border-white/30 dark:border-white/10 shadow-[0_-8px_32px_rgba(0,0,0,0.15)] safe-bottom"
      >
        <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-1.5 items-center">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center py-1 px-0.5 rounded-xl text-[10px] font-semibold transition-all select-none',
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={cn(
                      'p-1.5 rounded-xl transition-all duration-200',
                      isActive
                        ? 'bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] border border-blue-500/20 scale-105'
                        : 'hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
                    )}
                  >
                    <tab.icon className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <span className="truncate w-full text-center leading-tight mt-0.5 text-[9.5px] sm:text-[10px] tracking-tight">
                    {tab.name}
                  </span>
                </>
              )}
            </NavLink>
          ))}

          {/* 5th Tab: More Drawer Trigger */}
          <button
            type="button"
            onClick={() => setIsMoreOpen(true)}
            className={cn(
              'flex flex-col items-center justify-center py-1 px-0.5 rounded-xl text-[10px] font-semibold transition-all select-none',
              isMoreActive || isMoreOpen
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-muted-foreground hover:text-foreground'
            )}
            aria-label={t('nav.more', { defaultValue: 'More' })}
          >
            <div
              className={cn(
                'p-1.5 rounded-xl transition-all duration-200',
                isMoreActive || isMoreOpen
                  ? 'bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] border border-blue-500/20 scale-105'
                  : 'hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
              )}
            >
              <Menu className="w-4 h-4" aria-hidden="true" />
            </div>
            <span className="truncate w-full text-center leading-tight mt-0.5 text-[9.5px] sm:text-[10px] tracking-tight">
              {t('nav.more', { defaultValue: 'More' })}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile More Drawer Overlay (Portal on document.body) */}
      {isMoreOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t('nav.moreMenuTitle', { defaultValue: 'Menu & Tools' })}
            className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-md animate-in fade-in w-screen h-dvh min-h-dvh max-h-dvh"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsMoreOpen(false);
            }}
          >
            <div
              className="w-full max-h-[85dvh] bg-card/95 backdrop-blur-2xl border-t border-white/20 dark:border-white/10 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Drag Bar & Header */}
              <div className="pt-3 pb-2 px-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold text-sm">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      {t('nav.moreMenuTitle', { defaultValue: 'Menu & Tools' })}
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      {user?.email || 'Skill Setu Learner'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMoreOpen(false)}
                  aria-label="Close menu"
                  className="p-1.5 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Drawer Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                {/* 1. Quick Mobile Search */}
                <div>
                  <form onSubmit={handleSearchSubmit} className="relative w-full">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('nav.searchPlaceholder', { defaultValue: 'Search courses & skills...' })}
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-border bg-secondary text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                    />
                  </form>
                </div>

                {/* 2. Core Navigation Links */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">
                    Explore & Practice
                  </span>

                  {/* AI Quizzes (Featured) */}
                  <Link
                    to="/quizzes"
                    onClick={() => setIsMoreOpen(false)}
                    className={cn(
                      'flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold transition-colors',
                      location.pathname === '/quizzes'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'hover:bg-secondary text-foreground'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span>{t('nav.quizzes', { defaultValue: 'AI Quizzes' })}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                      Practice
                    </span>
                  </Link>

                  {/* Course Catalog */}
                  <Link
                    to="/courses"
                    onClick={() => setIsMoreOpen(false)}
                    className={cn(
                      'flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold transition-colors',
                      location.pathname === '/courses'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'hover:bg-secondary text-foreground'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <span>{t('nav.courses', { defaultValue: 'Courses' })}</span>
                    </div>
                  </Link>

                  {/* Profile & Portfolio */}
                  <Link
                    to="/profile"
                    onClick={() => setIsMoreOpen(false)}
                    className={cn(
                      'flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold transition-colors',
                      location.pathname === '/profile'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'hover:bg-secondary text-foreground'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <span>{t('nav.profile', { defaultValue: 'My Profile & Portfolio' })}</span>
                    </div>
                  </Link>

                  {/* Admin Studio (If Admin/Trainer) */}
                  {(role === 'admin' || role === 'trainer') && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMoreOpen(false)}
                      className={cn(
                        'flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold transition-colors',
                        location.pathname.startsWith('/admin')
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'hover:bg-secondary text-indigo-600 dark:text-indigo-400'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center">
                          <Shield className="w-4 h-4" />
                        </div>
                        <span>Admin Studio</span>
                      </div>
                    </Link>
                  )}
                </div>

                {/* 3. Language & Theme Preferences */}
                <div className="pt-2 border-t border-border space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">
                    Preferences
                  </span>

                  {/* Language Selector */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-secondary/50 border border-border">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-foreground">Language</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => toggleLanguage('en')}
                        className={cn(
                          'px-2.5 py-1 rounded-lg text-xs font-bold transition-all',
                          i18n.language === 'en'
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        EN
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleLanguage('hi')}
                        className={cn(
                          'px-2.5 py-1 rounded-lg text-xs font-bold transition-all',
                          i18n.language === 'hi'
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        हिन्दी
                      </button>
                    </div>
                  </div>

                  {/* Theme Selector */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-secondary/50 border border-border">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-500 hidden dark:block" />
                      <Moon className="w-4 h-4 text-slate-700 block dark:hidden" />
                      <span className="font-semibold text-foreground">
                        {t('nav.themeMode', { defaultValue: 'Theme' })}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-card border border-border text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
                    >
                      <Sun className="w-3.5 h-3.5 text-amber-500 hidden dark:block" />
                      <Moon className="w-3.5 h-3.5 text-slate-700 block dark:hidden" />
                      <span>Toggle Theme</span>
                    </button>
                  </div>
                </div>

                {/* 4. Sign Out */}
                {user && (
                  <div className="pt-2 border-t border-border">
                    <button
                      type="button"
                      onClick={async () => {
                        setIsMoreOpen(false);
                        await signOut();
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('nav.logout', { defaultValue: 'Sign Out' })}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
