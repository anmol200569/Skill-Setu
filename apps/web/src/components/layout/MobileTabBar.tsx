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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur border-t border-border shadow-lg safe-bottom"
    >
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto px-1">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg text-[10px] font-medium transition-colors select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C2410C]',
                isActive
                  ? 'text-[#C2410C] dark:text-[#FB923C] font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={cn(
                    'p-1 rounded-full transition-transform',
                    isActive ? 'scale-110 bg-[#C2410C]/10 dark:bg-[#FB923C]/15' : ''
                  )}
                >
                  <tab.icon className="w-4 h-4" aria-hidden="true" />
                </div>
                <span className="truncate w-full text-center leading-tight mt-0.5">
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
