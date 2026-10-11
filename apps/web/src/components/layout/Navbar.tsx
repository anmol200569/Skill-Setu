import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { Globe, Moon, Sun, LogOut, User as UserIcon, Shield } from 'lucide-react';

export function Navbar() {
  const { user, role, signOut } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('skill_setu_lang', nextLang);
  };

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('skill_setu_theme', isDark ? 'dark' : 'light');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="Skill Setu" className="w-8 h-8 rounded-md" />
          <div className="flex flex-col">
            <span className="font-serif text-xl font-bold tracking-tight text-foreground">Skill Setu</span>
            <span className="text-[10px] tracking-wider uppercase font-semibold text-[#C2410C] -mt-1">
              AI Skill Intelligence
            </span>
          </div>
        </Link>

        {/* Center Links if logged in */}
        {user && (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/dashboard" className="text-foreground/80 hover:text-[#C2410C] transition-colors">
              {t('nav.dashboard')}
            </Link>
            <Link to="/assessments" className="text-foreground/80 hover:text-[#C2410C] transition-colors">
              {t('nav.assessments')}
            </Link>
            <Link to="/courses" className="text-foreground/80 hover:text-[#C2410C] transition-colors">
              {t('nav.courses')}
            </Link>
            <Link to="/learning-path" className="text-foreground/80 hover:text-[#C2410C] transition-colors">
              {t('nav.learningPath')}
            </Link>
            <Link to="/quizzes" className="text-foreground/80 hover:text-[#C2410C] transition-colors">
              {t('nav.quizzes')}
            </Link>
            {(role === 'admin' || role === 'trainer') && (
              <Link to="/admin" className="text-[#C2410C] font-semibold flex items-center gap-1 hover:underline">
                <Shield className="w-3.5 h-3.5" />
                {t('nav.admin')}
              </Link>
            )}
          </nav>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            title="Switch Language (English / हिंदी)"
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-md border border-border hover:bg-muted text-foreground transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-[#C2410C]" />
            <span>{i18n.language === 'en' ? 'हिन्दी' : 'EN'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title="Toggle Light / Dark mode"
            className="p-2 rounded-md border border-border hover:bg-muted text-foreground transition-colors"
          >
            <Sun className="w-4 h-4 hidden dark:block text-amber-400" />
            <Moon className="w-4 h-4 block dark:hidden text-foreground/80" />
          </button>

          {/* Auth State */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/profile" className="hidden sm:flex items-center gap-1.5 text-xs text-foreground/80 hover:text-[#C2410C]">
                <UserIcon className="w-4 h-4" />
                <span className="truncate max-w-[120px]">{user.email?.split('@')[0]}</span>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await signOut();
                  navigate('/login');
                }}
                className="flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('nav.logout')}</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  {t('nav.login')}
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm">
                  {t('nav.signup')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
