import React, { useState, useMemo } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { ChartWrapper } from '../ui/ChartWrapper';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { ArrowUpDown, Target, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

export interface SkillRadarItem {
  skill: string;
  fullSkill?: string;
  current: number | null;
  required: number;
}

export interface SkillRadarChartProps {
  data: SkillRadarItem[];
  className?: string;
}

type SortField = 'skill' | 'current' | 'required' | 'gap';
type SortOrder = 'asc' | 'desc';

export function SkillRadarChart({ data, className }: SkillRadarChartProps) {
  const { t } = useTranslation();
  const [sortField, setSortField] = useState<SortField>('gap');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Chart data format (exclude unassessed or null values so radar is clean)
  const chartData = useMemo(() => {
    return data
      .filter((d) => d.current !== null && d.current !== undefined)
      .map((d) => ({
        skill: d.skill,
        fullSkill: d.fullSkill || d.skill,
        achieved: Number(d.current?.toFixed(1) || 0),
        target: Number(d.required.toFixed(1)),
      }));
  }, [data]);

  // Sortable table view data
  const tableData = useMemo(() => {
    const list = data.map((d) => {
      const current = d.current ?? 0;
      const isAssessed = d.current !== null && d.current !== undefined;
      const gap = Math.max(0, d.required - current);
      return {
        ...d,
        isAssessed,
        currentVal: current,
        gapVal: gap,
      };
    });

    return list.sort((a, b) => {
      let diff = 0;
      if (sortField === 'skill') {
        diff = (a.fullSkill || a.skill).localeCompare(b.fullSkill || b.skill);
      } else if (sortField === 'current') {
        diff = a.currentVal - b.currentVal;
      } else if (sortField === 'required') {
        diff = a.required - b.required;
      } else if (sortField === 'gap') {
        diff = a.gapVal - b.gapVal;
      }
      return sortOrder === 'asc' ? diff : -diff;
    });
  }, [data, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  if (!data || data.length === 0) {
    return (
      <ChartWrapper
        title={t('dashboard.radar.title')}
        description={t('dashboard.radar.description')}
        className={className}
      >
        <EmptyState
          icon={Target}
          title={t('dashboard.radar.emptyTitle')}
          description={t('dashboard.radar.emptyDesc')}
          className="my-4"
        />
      </ChartWrapper>
    );
  }

  // Accessible Table View
  const tableViewNode = (
    <div className="w-full">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-border bg-secondary/40 text-muted-foreground font-semibold">
            <th scope="col" className="p-3">
              <button
                type="button"
                onClick={() => handleSort('skill')}
                className="flex items-center gap-1 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C2410C] rounded"
              >
                <span>{t('dashboard.radar.tableSkill')}</span>
                <ArrowUpDown className="w-3 h-3" />
              </button>
            </th>
            <th scope="col" className="p-3 text-center">
              <button
                type="button"
                onClick={() => handleSort('current')}
                className="flex items-center gap-1 mx-auto hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C2410C] rounded"
              >
                <span>{t('dashboard.radar.tableAchieved')}</span>
                <ArrowUpDown className="w-3 h-3" />
              </button>
            </th>
            <th scope="col" className="p-3 text-center">
              <button
                type="button"
                onClick={() => handleSort('required')}
                className="flex items-center gap-1 mx-auto hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C2410C] rounded"
              >
                <span>{t('dashboard.radar.tableTarget')}</span>
                <ArrowUpDown className="w-3 h-3" />
              </button>
            </th>
            <th scope="col" className="p-3 text-center">
              <button
                type="button"
                onClick={() => handleSort('gap')}
                className="flex items-center gap-1 mx-auto hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C2410C] rounded"
              >
                <span>{t('dashboard.radar.tableGap')}</span>
                <ArrowUpDown className="w-3 h-3" />
              </button>
            </th>
            <th scope="col" className="p-3 text-right">
              <span>{t('dashboard.radar.tableStatus')}</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {tableData.map((item, idx) => {
            const isMet = item.isAssessed && item.currentVal >= item.required;
            const isNeeds = item.isAssessed && item.currentVal < item.required;

            return (
              <tr key={idx} className="hover:bg-muted/40 transition-colors">
                <td className="p-3 font-medium text-foreground">
                  {item.fullSkill || item.skill}
                </td>
                <td className="p-3 text-center tabular-nums font-semibold">
                  {item.isAssessed ? `${item.currentVal.toFixed(1)} / 5` : '—'}
                </td>
                <td className="p-3 text-center tabular-nums text-muted-foreground">
                  {item.required.toFixed(1)} / 5
                </td>
                <td className="p-3 text-center tabular-nums">
                  {item.isAssessed ? (
                    item.gapVal > 0 ? (
                      <span className="font-semibold text-amber-600 dark:text-amber-400">
                        -{item.gapVal.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        0.0
                      </span>
                    )
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="p-3 text-right">
                  {!item.isAssessed ? (
                    <Badge variant="notAssessed" icon={HelpCircle}>
                      {t('common.notAssessed')}
                    </Badge>
                  ) : isMet ? (
                    <Badge variant="strong" icon={CheckCircle2}>
                      {t('common.strong')}
                    </Badge>
                  ) : (
                    <Badge variant="needsImprovement" icon={AlertTriangle}>
                      {t('common.needsImprovement')}
                    </Badge>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <ChartWrapper
      title={t('dashboard.radar.title')}
      description={t('dashboard.radar.description')}
      tableView={tableViewNode}
      className={className}
    >
      <div className="w-full h-72 sm:h-80 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} margin={{ top: 10, right: 25, bottom: 10, left: 25 }}>
            <PolarGrid stroke="#E2DED4" className="dark:stroke-[#383633]" />
            <PolarAngleAxis
              dataKey="skill"
              tick={{ fill: '#636058', fontSize: 11, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 5]}
              tick={{ fill: '#A39F95', fontSize: 10 }}
            />
            <Radar
              name={t('dashboard.radar.achieved')}
              dataKey="achieved"
              stroke="#C2410C"
              fill="#C2410C"
              fillOpacity={0.25}
              strokeWidth={2}
            />
            <Radar
              name={t('dashboard.radar.target')}
              dataKey="target"
              stroke="#64748B"
              fill="#64748B"
              fillOpacity={0.08}
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              iconType="circle"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const dataPoint = payload[0].payload;
                  return (
                    <div className="p-2.5 rounded-lg bg-card border border-border shadow-lg text-xs space-y-1">
                      <div className="font-serif font-bold text-foreground">
                        {dataPoint.fullSkill || dataPoint.skill}
                      </div>
                      <div className="flex items-center justify-between gap-4 text-emerald-600 dark:text-emerald-400">
                        <span>{t('dashboard.radar.achieved')}:</span>
                        <span className="font-semibold">{dataPoint.achieved} / 5</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-muted-foreground">
                        <span>{t('dashboard.radar.target')}:</span>
                        <span className="font-semibold">{dataPoint.target} / 5</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </ChartWrapper>
  );
}
