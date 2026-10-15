import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Target,
  GitCompare,
  Route,
  BookOpen,
  Sparkles,
  User,
  Shield,
  Layers,
  GraduationCap,
  Users,
  Compass
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  mode?: 'learner' | 'admin';
}

export function Sidebar({ mode = 'learner' }: SidebarProps) {
  const { role } = useAuth();
  const { t } = useTranslation();

  const learnerNav = [
    { name: t('nav.dashboard'), to: '/dashboard', icon: LayoutDashboard },
    { name: t('nav.assessments'), to: '/assessments', icon: Target },
    { name: t('nav.skillGaps'), to: '/skill-gaps', icon: GitCompare },
    { name: t('nav.roadmap'), to: '/roadmap', icon: Route },
    { name: t('nav.courses'), to: '/courses', icon: BookOpen },
    { name: t('nav.quizzes'), to: '/quizzes', icon: Sparkles },
    { name: t('nav.profile'), to: '/profile', icon: User },
  ];

  const adminNav = [
    { name: t('admin.nav.analytics', { defaultValue: 'Analytics Hub' }), to: '/admin', icon: LayoutDashboard },
    { name: t('admin.nav.framework', { defaultValue: 'Competency Framework' }), to: '/admin/competency', icon: Layers },
    { name: t('admin.nav.courses', { defaultValue: 'Course Library' }), to: '/admin/courses', icon: GraduationCap },
    { name: t('admin.nav.quizzes', { defaultValue: 'Quiz Management' }), to: '/admin/quizzes', icon: Sparkles },
    { name: t('admin.nav.learners', { defaultValue: 'Learner Cohorts' }), to: '/admin/learners', icon: Users },
  ];

  const navItems = mode === 'admin' ? adminNav : learnerNav;

  return (
    <aside
      aria-label={t('nav.desktopNav', { defaultValue: 'Desktop Navigation' })}
      className="w-64 flex-shrink-0 border-r border-border bg-card/60 min-h-[calc(100vh-4rem)] p-4 flex-col justify-between hidden md:flex select-none"
    >
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 px-3 py-1 text-[11px] font-bold tracking-wider uppercase text-muted-foreground">
            <Compass className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{mode === 'admin' ? t('nav.adminStudio', { defaultValue: 'Admin Studio' }) : t('nav.skillJourney', { defaultValue: 'Skill Journey' })}</span>
          </div>
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard' || item.to === '/admin'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600',
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold border-l-4 border-blue-600 dark:border-blue-500 pl-2.5 shadow-sm'
                      : 'text-foreground/75 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-foreground'
                  )
                }
              >
                <item.icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Switch mode pill if trainer/admin */}
        {(role === 'admin' || role === 'trainer') && (
          <div className="p-3.5 rounded-xl border border-blue-100 dark:border-blue-950 bg-blue-50/50 dark:bg-blue-950/30 text-xs">
            <div className="font-semibold text-foreground mb-1">
              {mode === 'admin' ? t('admin.nav.switchToLearner', { defaultValue: 'Switch to Learner View' }) : t('admin.nav.adminTools', { defaultValue: 'Administrator Tools' })}
            </div>
            <p className="text-muted-foreground text-[11px] mb-2 leading-relaxed">
              {mode === 'admin'
                ? t('admin.nav.learnerDesc', { defaultValue: 'Preview the learner experience and take diagnostic assessments.' })
                : t('admin.nav.adminDesc', { defaultValue: 'Manage competency skills, publish quizzes, and view cohort analytics.' })}
            </p>
            <NavLink
              to={mode === 'admin' ? '/dashboard' : '/admin'}
              className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline text-xs"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{mode === 'admin' ? t('admin.nav.goToLearner', { defaultValue: 'Go to Learner Dashboard' }) : t('admin.nav.openStudio', { defaultValue: 'Open Admin Studio' })}</span>
            </NavLink>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-border text-[11px] text-muted-foreground flex items-center justify-between">
        <span>{t('nav.platform', { defaultValue: 'Skill Setu Platform' })}</span>
        <span className="font-mono text-[10px] bg-secondary text-foreground/80 px-1.5 py-0.5 rounded border border-border">v1.0</span>
      </div>
    </aside>
  );
}
