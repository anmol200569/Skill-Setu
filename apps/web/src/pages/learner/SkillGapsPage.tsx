import React from 'react';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { GitCompare } from 'lucide-react';

export function SkillGapsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Breadcrumbs items={[{ label: t('nav.skillGaps') }]} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-foreground tracking-tight flex items-center gap-2.5">
            <GitCompare className="w-6 h-6 text-[#C2410C] dark:text-[#FB923C]" />
            <span>{t('nav.skillGaps')}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Differential skill analysis comparing your verified abilities against target role requirements.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Skill Gap Diagnostic View</CardTitle>
          <CardDescription>Comprehensive breakdown of assessed proficiencies, deficits, and mapped learning resources.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground py-8 text-center">
            Loading differential gap matrix...
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
