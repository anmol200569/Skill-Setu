import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Target, GitCompare, Route, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';

export function MobileTabBar() {
  const { t } = useTranslation();

  const tabs = [
    { name: t('nav.dashboard'), to: '/dashboard', icon: LayoutDashboard },
    { name: t('nav.assessments'), to: '/assessments', icon: Target },
    { name: t('nav.skillGaps'), to: '/skill-gaps', icon: GitCompare },
    { name: t('nav.roadmap'), to: '/roadmap', icon: Route },
    { name: t('nav.courses'), to: '/courses', icon: BookOpen },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-[#0B0F19]/85 backdrop-blur-2xl border-t border-white/30 dark:border-white/10 shadow-[0_-8px_32px_rgba(0,0,0,0.15)] safe-bottom"
    >
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-2 items-center">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center py-1 px-1 rounded-xl text-[10px] font-semibold transition-all select-none',
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
                <span className="truncate w-full text-center leading-tight mt-1 text-[10px]">
                  {tab.name}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
