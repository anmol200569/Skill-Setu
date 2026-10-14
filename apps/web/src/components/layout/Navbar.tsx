import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { Globe, Moon, Sun, LogOut, User as UserIcon, Shield, Compass, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Navbar() {
  const { user, role, profile, signOut } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('skill_setu_lang', nextLang);
  };

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('skill_setu_theme', isDark ? 'dark' : 'light');
  };

  // Format career role display name
  const getCareerGoalDisplay = () => {
    if (!profile?.targetRoleId) return null;
    const roleId = profile.targetRoleId;
    // Map known role IDs or format cleanly
    const roleKey = `landing.wizard.roles.${roleId}`;
    const translated = t(roleKey, { defaultValue: '' });
    if (translated) return translated;
    return roleId.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  };

  const careerGoal = getCareerGoalDisplay();

  const navLinks = [
    { name: t('nav.dashboard'), to: '/dashboard' },
    { name: t('nav.assessments'), to: '/assessments' },
    { name: t('nav.skillGaps'), to: '/skill-gaps' },
    { name: t('nav.roadmap'), to: '/roadmap' },
    { name: t('nav.courses'), to: '/courses' },
    { name: t('nav.quizzes'), to: '/quizzes' },
  ];

  return (
    <>
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#C2410C] focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none"
      >
        {t('nav.skipToContent')}
      </a>

      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-3 sm:px-6">
          {/* Left: Brand Logo & Title */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              to={user ? (role === 'admin' || role === 'trainer' ? '/admin' : '/dashboard') : '/'}
              className="flex items-center gap-2.5 flex-shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C] rounded-lg p-1"
            >
              <img
                src="/logo.svg"
                alt="Skill Setu Logo"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform"
              />
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-foreground whitespace-nowrap">
                Skill Setu
              </span>
            </Link>

            {/* Current Career Goal Pill */}
            {user && (
              <div className="hidden lg:flex items-center">
                <Link
                  to="/profile"
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors max-w-[220px] truncate',
                    careerGoal
                      ? 'bg-[#C2410C]/10 text-[#C2410C] dark:text-[#FB923C] border-[#C2410C]/25 dark:border-[#FB923C]/35 hover:bg-[#C2410C]/20'
                      : 'bg-secondary text-muted-foreground border-border hover:text-foreground'
                  )}
                  title={`${t('nav.careerGoal')}: ${careerGoal || t('nav.noCareerGoal')}`}
                >
                  <Compass className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                  <span className="truncate">{careerGoal || t('nav.selectGoal')}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Center Links if logged in (Desktop) */}
          {user && (
            <nav aria-label="Primary Navigation" className="hidden xl:flex items-center gap-5 text-sm font-medium">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={cn(
                      'transition-colors py-1 px-1.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C]',
                      isActive
                        ? 'text-[#C2410C] dark:text-[#FB923C] font-semibold border-b-2 border-[#C2410C] dark:border-[#FB923C]'
                        : 'text-foreground/75 hover:text-[#C2410C] dark:hover:text-[#FB923C]'
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
              {(role === 'admin' || role === 'trainer') && (
                <Link
                  to="/admin"
                  className="text-[#C2410C] dark:text-[#FB923C] font-semibold flex items-center gap-1 hover:underline ml-2"
                >
                  <Shield className="w-3.5 h-3.5" />
                  {t('nav.admin')}
                </Link>
              )}
            </nav>
          )}

          {/* Right Actions: Language, Theme, User Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              aria-label={`${t('nav.toggleLang')}: ${i18n.language === 'en' ? 'हिन्दी' : 'English'}`}
              className="flex items-center gap-1 text-xs font-semibold px-2 py-1.5 rounded-lg border border-border hover:bg-muted text-foreground transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C]"
            >
              <Globe className="w-3.5 h-3.5 text-[#C2410C] dark:text-[#FB923C]" aria-hidden="true" />
              <span className="text-[11px] sm:text-xs font-medium">
                {i18n.language === 'en' ? 'हिन्दी' : 'EN'}
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={t('nav.toggleTheme')}
              className="p-1.5 sm:p-2 rounded-lg border border-border hover:bg-muted text-foreground transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C]"
            >
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 hidden dark:block text-amber-400" aria-hidden="true" />
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 block dark:hidden text-foreground/80" aria-hidden="true" />
            </button>

            {/* User State */}
            {user ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  to="/profile"
                  aria-label={t('nav.profile')}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border hover:bg-muted text-foreground transition-colors text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C]"
                >
                  <div className="w-5 h-5 rounded-full bg-[#C2410C]/15 dark:bg-[#FB923C]/20 text-[#C2410C] dark:text-[#FB923C] flex items-center justify-center font-bold text-[10px]">
                    {(user.user_metadata?.fullName || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline truncate max-w-[100px]">
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
                  aria-label={t('nav.logout')}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#C2410C]"
                >
                  <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">{t('nav.logout')}</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <Link to="/login" className="hidden sm:inline-flex">
                  <Button variant="ghost" size="sm" className="whitespace-nowrap text-xs sm:text-sm">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    variant="primary"
                    size="sm"
                    className="whitespace-nowrap px-3 py-1.5 text-xs sm:text-sm font-semibold bg-[#C2410C] hover:bg-[#9A3412] text-white"
                  >
                    {t('nav.signup')}
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
