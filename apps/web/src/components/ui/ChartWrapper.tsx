import React, { useState } from 'react';
import { Table, BarChart2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card';
import { cn } from '../../lib/utils';

export interface ChartWrapperProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  tableView?: React.ReactNode;
  headerAction?: React.ReactNode;
  className?: string;
}

export function ChartWrapper({
  title,
  description,
  badge,
  children,
  tableView,
  headerAction,
  className,
}: ChartWrapperProps) {
  const [showTable, setShowTable] = useState(false);

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CardTitle>{title}</CardTitle>
            {badge}
          </div>
          {description && <CardDescription>{description}</CardDescription>}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {headerAction}
          {tableView && (
            <button
              type="button"
              onClick={() => setShowTable((prev) => !prev)}
              aria-label={showTable ? 'Switch to visual chart view' : 'Switch to accessible data table view'}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-border bg-secondary hover:bg-muted text-foreground transition-colors"
            >
              {showTable ? (
                <>
                  <BarChart2 className="w-3.5 h-3.5 text-[#C2410C] dark:text-[#FB923C]" />
                  <span>Chart View</span>
                </>
              ) : (
                <>
                  <Table className="w-3.5 h-3.5 text-[#C2410C] dark:text-[#FB923C]" />
                  <span>Table View</span>
                </>
              )}
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {showTable && tableView ? (
          <div className="overflow-x-auto focus-visible:outline-none" tabIndex={0} aria-label={`${title} data table`}>
            {tableView}
          </div>
        ) : (
          <div className="w-full">{children}</div>
        )}
      </CardContent>
    </Card>
  );
}
