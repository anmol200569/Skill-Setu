import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const { t } = useTranslation();

  return (
    <nav aria-label={t('breadcrumbs.label', { defaultValue: 'Breadcrumbs' })} className={cn('flex items-center text-xs text-muted-foreground mb-4', className)}>
      <ol className="flex items-center space-x-1.5 flex-wrap">
        <li>
          <Link
            to="/dashboard"
            className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600 rounded p-0.5"
            aria-label={t('nav.home')}
          >
            <Home className="w-3.5 h-3.5" />
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center space-x-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60 flex-shrink-0" aria-hidden="true" />
              {isLast || !item.href ? (
                <span className="font-semibold text-foreground truncate max-w-[200px]" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate max-w-[150px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600 rounded p-0.5"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
