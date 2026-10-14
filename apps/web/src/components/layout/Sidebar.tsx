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
    { name: 'Analytics Hub', to: '/admin', icon: LayoutDashboard },
    { name: 'Competency Framework', to: '/admin/competency', icon: Layers },
    { name: 'Course Library', to: '/admin/courses', icon: GraduationCap },
    { name: 'Quiz Management', to: '/admin/quizzes', icon: Sparkles },
    { name: 'Learner Cohorts', to: '/admin/learners', icon: Users },
  ];

  const navItems = mode === 'admin' ? adminNav : learnerNav;

  return (
    <aside
      aria-label="Desktop Navigation"
      className="w-64 flex-shrink-0 border-r border-border bg-card/60 min-h-[calc(100vh-4rem)] p-4 flex-col justify-between hidden md:flex select-none"
    >
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 px-3 py-1 text-[11px] font-bold tracking-wider uppercase text-muted-foreground">
            <Compass className="w-3.5 h-3.5 text-[#C2410C] dark:text-[#FB923C]" />
            <span>{mode === 'admin' ? 'Admin Studio' : 'Skill Journey'}</span>
          </div>
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard' || item.to === '/admin'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C]',
                    isActive
                      ? 'bg-[#C2410C]/10 text-[#C2410C] dark:text-[#FB923C] font-semibold border-l-4 border-[#C2410C] dark:border-[#FB923C] pl-2 shadow-sm'
                      : 'text-foreground/75 hover:bg-muted hover:text-foreground'
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
          <div className="p-3 rounded-lg border border-border bg-secondary/40 text-xs">
            <div className="font-semibold text-foreground mb-1">
              {mode === 'admin' ? 'Switch to Learner View' : 'Administrator Tools'}
            </div>
            <p className="text-muted-foreground text-[11px] mb-2 leading-relaxed">
              {mode === 'admin'
                ? 'Preview the learner experience and take diagnostic assessments.'
                : 'Manage competency skills, publish quizzes, and view cohort analytics.'}
            </p>
            <NavLink
              to={mode === 'admin' ? '/dashboard' : '/admin'}
              className="inline-flex items-center gap-1 font-semibold text-[#C2410C] dark:text-[#FB923C] hover:underline text-xs"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{mode === 'admin' ? 'Go to Learner Dashboard' : 'Open Admin Studio'}</span>
            </NavLink>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-border text-[11px] text-muted-foreground flex items-center justify-between">
        <span>Skill Setu Platform</span>
        <span className="font-mono text-[10px] bg-secondary text-foreground/80 px-1.5 py-0.5 rounded border border-border">v1.0</span>
      </div>
    </aside>
  );
}
