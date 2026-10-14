import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { ChartWrapper } from '../ui/ChartWrapper';
import { EmptyState } from '../ui/EmptyState';
import { TrendingUp, Sparkles, RefreshCw } from 'lucide-react';

export interface ReadinessHistoryPoint {
  date: string;
  score: number;
  label?: string;
}

export interface ReadinessTrendChartProps {
  history?: ReadinessHistoryPoint[];
  currentScore?: number | null;
  className?: string;
}

export function ReadinessTrendChart({ history = [], currentScore, className }: ReadinessTrendChartProps) {
  const { t } = useTranslation();

  // If history is empty or only 1 data point, show the honest empty state
  const dataPoints = history.length > 0
    ? history
    : currentScore !== null && currentScore !== undefined
    ? [{ date: 'Initial Diagnostic', score: Math.round(currentScore), label: 'Baseline' }]
    : [];

  const isHonestSinglePoint = dataPoints.length <= 1;

  if (isHonestSinglePoint) {
    return (
      <ChartWrapper
        title={t('dashboard.trend.title')}
        description={t('dashboard.trend.description')}
        className={className}
      >
        <div className="py-6 px-4 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-secondary text-muted-foreground flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="max-w-md space-y-1">
            <div className="text-sm font-semibold font-serif text-foreground">
              {dataPoints.length === 1
                ? t('dashboard.trend.singlePointEmptyTitle')
                : t('dashboard.trend.title')}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {dataPoints.length === 1
                ? t('dashboard.trend.singlePointEmptyDesc')
                : t('dashboard.trend.noDataDesc')}
            </p>
          </div>
          {dataPoints.length === 1 && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-xs text-foreground font-medium border border-border">
              <span>Baseline: {dataPoints[0].score}/100</span>
              <span className="text-muted-foreground">• Needs 1 more reassessment</span>
            </div>
          )}
        </div>
      </ChartWrapper>
    );
  }

  // 2+ points: render line chart
  return (
    <ChartWrapper
      title={t('dashboard.trend.title')}
      description={t('dashboard.trend.description')}
      className={className}
    >
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dataPoints} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2DED4" className="dark:stroke-[#383633]" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#636058', fontSize: 11 }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: '#636058', fontSize: 11 }}
              unit="%"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="p-2.5 rounded-lg bg-card border border-border shadow-md text-xs space-y-0.5">
                      <div className="text-muted-foreground">{item.date}</div>
                      <div className="font-bold font-serif text-foreground text-sm">
                        {item.score} / 100
                      </div>
                      {item.label && <div className="text-[11px] text-[#C2410C]">{item.label}</div>}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#C2410C"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#C2410C' }}
              activeDot={{ r: 6, fill: '#C2410C', stroke: '#FFFFFF', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartWrapper>
  );
}
